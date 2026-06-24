from sqlalchemy import Column,Integer,String,Float,DateTime
from sqlalchemy.sql import func
from database import Base

class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True,index=True)

    user_id = Column(Integer,index=True)

    amount = Column(Float)

    transaction_type = Column(String)

    idempotency_key = Column(
        String,
        unique=True,
        nullable=False
    )

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )