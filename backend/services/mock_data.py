import asyncio
import json
import logging
from pathlib import Path
from datetime import datetime
from typing import Any, Iterable

from core.database import get_db_manager
from sqlalchemy import MetaData, Table, func, select
from sqlalchemy.exc import NoSuchTableError, SQLAlchemyError

logger = logging.getLogger(__name__)

# FIX 1: Point to the actual mock data directory, not the schemas
MOCK_DATA_DIR = Path(__file__).resolve().parent.parent / "mock_data"
MAX_CONCURRENT_LOADS = 5

def _coerce_temporal_value(value: Any, column_type: Any) -> Any:
    """Convert JSON strings to Date/Datetime objects when needed."""
    if value is None or not isinstance(value, str):
        return value
        
    try:
        if "DATETIME" in str(column_type).upper() or "TIMESTAMP" in str(column_type).upper():
            return datetime.fromisoformat(value.replace('Z', '+00:00'))
    except ValueError:
        pass
        
    return value

# FIX 2: Removed 'async' - run_sync requires a purely synchronous function
def _reflect_table(sync_conn: Any, table_name: str) -> Table:
    """Reflect a table definition inside a synchronous context."""
    metadata = MetaData()
    metadata.reflect(bind=sync_conn, only=[table_name])
    return metadata.tables[table_name]

async def _load_file(data_file: Path) -> None:
    try:
        table_name = data_file.stem
        
        with open(data_file, 'r', encoding='utf-8') as f:
            raw_records = json.load(f)
            
        if not raw_records:
            return
            
        db_manager = get_db_manager()
        
        async with db_manager.engine.begin() as conn:
            # We use run_sync to reflect the table structure using SQLAlchemy
            table = await conn.run_sync(_reflect_table, table_name)
            
            # FIX 3: Prevent duplicate inserts if the server restarts
            result = await conn.execute(select(func.count()).select_from(table))
            if result.scalar() > 0:
                logger.debug(f"Table '{table_name}' already has data. Skipping.")
                return

            # Prepare records with coerced temporal types
            prepared_records = []
            for record in raw_records:
                prepared = {}
                for key, value in record.items():
                    if key in table.columns:
                        prepared[key] = _coerce_temporal_value(value, table.columns[key].type)
                if prepared:
                    prepared_records.append(prepared)
            
            # Insert the mocked records
            if prepared_records:
                await conn.execute(table.insert(), prepared_records)
                logger.info(f"Mock data loaded into table '{table_name}'")
                
    except Exception as e:
        logger.error(f"Error loading mock data from {data_file.name}: {e}")

async def initialize_mock_data():
    """Populate tables with mock JSON data when they are empty."""
    db_manager = get_db_manager()
    
    if not db_manager._initialized:
        logger.warning("Database engine is not ready; skipping mock data initialization")
        return
        
    if not MOCK_DATA_DIR.exists():
        logger.info(f"No mock data directory found at {MOCK_DATA_DIR}.")
        return
        
    data_files = sorted(MOCK_DATA_DIR.glob("*.json"))
    if not data_files:
        return
        
    semaphore = asyncio.Semaphore(MAX_CONCURRENT_LOADS)
    
    async def load_with_semaphore(file_path):
        async with semaphore:
            await _load_file(file_path)
            
    await asyncio.gather(*(load_with_semaphore(f) for f in data_files))