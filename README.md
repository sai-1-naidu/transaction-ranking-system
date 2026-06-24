# Transaction Ranking System

## Overview

A FastAPI-based backend and React frontend that manages user transactions, generates user summaries, and ranks users using a fair scoring system.

## APIs

### POST /transaction

Creates a new transaction.

Request:

{
"user_id": 1,
"amount": 100,
"transaction_type": "purchase",
"idempotency_key": "txn1"
}

Features:

* Request validation
* Duplicate prevention
* Amount limit validation
* Database transaction rollback

### GET /summary/{user_id}

Returns:

* Total transactions
* Total amount

### GET /ranking

Returns ranked users based on:

Score = (Total Amount × 0.6) + (Transaction Count × 25)

## Duplicate Prevention

Each transaction contains a unique idempotency_key.

Duplicate requests with the same key are rejected.

## Concurrency & Consistency

Database commits are wrapped in try/except blocks.

Failures trigger rollback() to prevent inconsistent data.

## Run Backend

pip install -r requirements.txt

uvicorn main:app --reload

## Run Frontend

npm install

npm run dev
