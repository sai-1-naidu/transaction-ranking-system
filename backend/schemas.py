from pydantic import BaseModel, Field

class TransactionCreate(BaseModel):
    user_id: int
    amount: float = Field(gt=0)
    transaction_type: str
    idempotency_key: str