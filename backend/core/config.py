from typing import Optional
from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv

# Find the absolute path to the directory containing this config file
# (If your config.py is inside a 'core' folder, add .parent to go up one level to the root)
BASE_DIR = Path(__file__).resolve().parent.parent 
ENV_PATH = BASE_DIR / ".env"

# Force Python to load the file into the environment before Pydantic even boots up
load_dotenv(ENV_PATH)

class Settings(BaseSettings):
    # App Settings
    project_name: str = "PAUDC 2026 Debate Tournament" # Added this!
    api_v1_str: str = "/api/v1"
    version: str = "1.0.0"
    debug: bool = True
    environment: str = "dev"
    DATABASE_URL: str = "sqlite+aiosqlite:///./paudc.db"
    
    # Auth & JWT
    jwt_secret_key: str = "local_dev_secret_key_change_in_production"
    jwt_algorithm: str = "HS256"
    jwt_expire_minutes: int = 60
    
    # OIDC (OpenID Connect)
    oidc_client_id: str = ""
    oidc_client_secret: str = ""
    oidc_issuer_url: str = ""
    oidc_scope: str = "openid email profile"
    
    # URLs
    frontend_url: str = "http://localhost:3000"
    backend_url: str = "http://localhost:8000"
    
    # External APIs
    stripe_api_key: Optional[str] = None
    stripe_webhook_secret: Optional[str] = None 
    oss_service_url: Optional[str] = None
    oss_api_key: Optional[str] = None
    api_base_url: Optional[str] = None
    api_key: Optional[str] = None
    
    # Admin User Initialization
    admin_user_id: Optional[str] = None
    admin_user_email: Optional[str] = None

    # Pydantic v2 configuration
    model_config = SettingsConfigDict(
        env_file=".env", 
        env_file_encoding="utf-8", 
        extra="ignore",
        case_sensitive=False
    )

settings = Settings()