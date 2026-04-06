from core.database import Base
from sqlalchemy import Column, Integer, String

class QuizQuestions(Base):
    __tablename__ = "quiz_questions"
    __table_args__ = {'extend_existing': True}

    id = Column(Integer, primary_key=True, index=True, autoincrement=True, nullable=False)
    quiz_id = Column(Integer, nullable=False)
    question_text = Column(String, nullable=False)
    question_type = Column(String, nullable=False)
    options = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    points = Column(Integer, nullable=False)
    order_index = Column(Integer, nullable=False)