# 🏆 Transaction Ranking System

## Overview

The Transaction Ranking System is a full-stack web application built using FastAPI, React, SQLAlchemy, and SQLite.

The system allows users to create transactions, view transaction summaries, and participate in a ranking system based on transaction activity and value. It also includes request validation, duplicate transaction prevention, data consistency handling, and fair ranking logic.

---

## Live Demo

### Frontend

https://transaction-ranking-system-liard.vercel.app

### Backend API

https://transaction-ranking-api-zz3n.onrender.com

### API Documentation

https://transaction-ranking-api-zz3n.onrender.com/docs

---

## Tech Stack

### Backend

* FastAPI
* SQLAlchemy
* SQLite
* Pydantic
* Uvicorn

### Frontend

* React
* Axios
* CSS

### Deployment

* Render (Backend)
* Vercel (Frontend)

---

## Project Architecture

React Frontend

↓

FastAPI Backend

↓

SQLite Database

---

## Features

### Transaction Creation

* Create new transactions
* Request validation
* Amount validation
* Transaction type support

### Duplicate Prevention

* Uses unique idempotency keys
* Prevents duplicate transaction processing

### User Summary

* Total transaction count
* Total transaction amount

### Ranking System

* Multi-factor ranking logic
* Fair scoring mechanism
* Dynamic leaderboard

### Error Handling

* Validation errors
* User-friendly messages
* Database rollback on failure

### Data Consistency

* Safe database commits
* Rollback support
* Duplicate request prevention

---

## API Endpoints

### POST /transaction

Create a new transaction.

#### Request

```json
{
  "user_id": 1,
  "amount": 100,
  "transaction_type": "purchase",
  "idempotency_key": "txn1"
}
```

#### Features

* Request validation
* Duplicate prevention
* Amount limit validation
* Database transaction rollback

---

### GET /summary/{user_id}

Returns transaction statistics for a user.

#### Example Response

```json
{
  "user_id": 1,
  "total_transactions": 5,
  "total_amount": 1200
}
```

---

### GET /ranking

Returns ranked users based on transaction activity and value.

#### Example Response

```json
[
  {
    "rank": 1,
    "user_id": 3,
    "score": 650
  }
]
```

---

## Ranking Logic

The ranking system uses multiple factors to ensure fairness.

Score Formula:

```text
Score =
(Total Amount × 0.6)
+
(Transaction Count × 25)
```

This approach rewards both transaction value and user activity.

---

## Duplicate Request Prevention

Each transaction contains a unique:

```text
idempotency_key
```

If the same key is submitted more than once, the request is rejected to prevent duplicate processing.

---

## Concurrency & Consistency

Database operations are wrapped inside transaction handling logic.

* Commit on success
* Rollback on failure
* Prevent inconsistent database states

Example:

```python
try:
    db.commit()
except Exception:
    db.rollback()
```

---

## Local Setup

### Backend

```bash
cd backend

pip install -r requirements.txt

uvicorn main:app --reload
```

Backend URL:

```text
http://127.0.0.1:8000
```

---

### Frontend

```bash
cd frontend

npm install

npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

---

## Validation Rules

* Amount must be greater than 0
* Amount cannot exceed configured limit
* User ID is required
* Transaction Type is required
* Idempotency Key is required

---

## Future Improvements

* PostgreSQL integration
* JWT Authentication
* Docker support
* Admin Dashboard
* Analytics & Reporting

---

## Author

Tungala Lakshmi Venkata Sai

GitHub:
https://github.com/sai-1-naidu

LinkedIn:
https://www.linkedin.com/in/tungala-lakshmi-venkata-sai-5038b6307
