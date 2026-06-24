from fastapi import FastAPI
from database import engine
from models import Base
from database import SessionLocal
from fastapi import Depends, HTTPException
from sqlalchemy.orm import Session
from collections import defaultdict

from schemas import TransactionCreate
from models import Transaction
from fastapi.middleware.cors import CORSMiddleware

Base.metadata.create_all(bind=engine)

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
@app.get("/")
def home():
    return {"message":"API Running"}
def get_db():
    db = SessionLocal()

    try:
        yield db

    finally:
        db.close()
@app.post("/transaction")
def create_transaction(
    data: TransactionCreate,
    db: Session = Depends(get_db)
):
    if data.amount > 100000:
        raise HTTPException(
        status_code=400,
        detail="Amount exceeds limit"
    )
    existing = db.query(Transaction).filter(
    Transaction.idempotency_key
    == data.idempotency_key
).first()

    if existing:
        raise HTTPException(
        status_code=400,
        detail="Transaction already processed"
    )        
    transaction = Transaction(
    user_id=data.user_id,
    amount=data.amount,
    transaction_type=data.transaction_type,
    idempotency_key=data.idempotency_key
)

    try:
        db.add(transaction)

        db.commit()

        db.refresh(transaction)

    except Exception:
        db.rollback()

        raise HTTPException(
        status_code=500,
        detail="Transaction failed"
    )
    return {
    "message":"Transaction created",
    "id":transaction.id
}
@app.get("/summary/{user_id}")
def get_summary(
    user_id: int,
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).filter(
        Transaction.user_id == user_id
    ).all()

    if not transactions:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    total_amount = sum(t.amount for t in transactions)

    transaction_count = len(transactions)

    return {
        "user_id": user_id,
        "total_transactions": transaction_count,
        "total_amount": total_amount
    }
@app.get("/ranking")
def get_ranking(
    db: Session = Depends(get_db)
):
    transactions = db.query(Transaction).all()

    users = defaultdict(
        lambda: {
            "total_amount": 0,
            "transaction_count": 0
        }
    )

    for t in transactions:

        users[t.user_id]["total_amount"] += t.amount

        users[t.user_id]["transaction_count"] += 1

    rankings = []

    for user_id, data in users.items():

        amount_score = data["total_amount"] * 0.6

        frequency_score = data["transaction_count"] * 25

        score = amount_score + frequency_score

        rankings.append({
            "user_id": user_id,
            "total_amount": data["total_amount"],
            "transaction_count": data["transaction_count"],
            "score": score
        })

    rankings.sort(
        key=lambda x: x["score"],
        reverse=True
    )

    for i, user in enumerate(rankings):
        user["rank"] = i + 1

    return rankings