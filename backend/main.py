from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import Optional
import models, schemas, crud
from database import engine, get_db

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="Library Management System")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_methods=["*"],
    allow_headers=["*"],
)


# ── Books ─────────────────────────────────────────────────────────────────────

@app.get("/books", response_model=list[schemas.BookOut])
def get_books(db: Session = Depends(get_db)):
    return crud.get_books(db)

@app.get("/books/{book_id}", response_model=schemas.BookOut)
def get_book(book_id: int, db: Session = Depends(get_db)):
    book = crud.get_book(db, book_id)
    if not book:
        raise HTTPException(status_code=404, detail="Book not found")
    return book

@app.post("/books", response_model=schemas.BookOut, status_code=201)
def create_book(book: schemas.BookCreate, db: Session = Depends(get_db)):
    return crud.create_book(db, book)

@app.put("/books/{book_id}", response_model=schemas.BookOut)
def update_book(book_id: int, book: schemas.BookUpdate, db: Session = Depends(get_db)):
    updated = crud.update_book(db, book_id, book)
    if not updated:
        raise HTTPException(status_code=404, detail="Book not found")
    return updated

@app.delete("/books/{book_id}", response_model=schemas.BookOut)
def delete_book(book_id: int, db: Session = Depends(get_db)):
    deleted, status = crud.delete_book(db, book_id)
    if status == "not_found":
        raise HTTPException(status_code=404, detail="Book not found")
    if status == "active":
        raise HTTPException(status_code=409, detail="Cannot delete book — it is currently borrowed")
    return deleted


# ── Borrowers ─────────────────────────────────────────────────────────────────

@app.get("/borrowers", response_model=list[schemas.BorrowerOut])
def get_borrowers(db: Session = Depends(get_db)):
    return crud.get_borrowers(db)

@app.post("/borrowers", response_model=schemas.BorrowerOut, status_code=201)
def create_borrower(borrower: schemas.BorrowerCreate, db: Session = Depends(get_db)):
    return crud.create_borrower(db, borrower)

@app.put("/borrowers/{borrower_id}", response_model=schemas.BorrowerOut)
def update_borrower(borrower_id: int, borrower: schemas.BorrowerUpdate, db: Session = Depends(get_db)):
    updated = crud.update_borrower(db, borrower_id, borrower)
    if not updated:
        raise HTTPException(status_code=404, detail="Borrower not found")
    return updated

@app.delete("/borrowers/{borrower_id}", response_model=schemas.BorrowerOut)
def delete_borrower(borrower_id: int, db: Session = Depends(get_db)):
    deleted, status = crud.delete_borrower(db, borrower_id)
    if status == "not_found":
        raise HTTPException(status_code=404, detail="Borrower not found")
    if status == "active":
        raise HTTPException(status_code=409, detail="Cannot delete borrower — they currently hold a borrowed book")
    return deleted


# ── Transactions ──────────────────────────────────────────────────────────────

@app.get("/transactions", response_model=list[schemas.TransactionOut])
def get_transactions(db: Session = Depends(get_db)):
    return crud.get_transactions(db)

@app.post("/borrow", response_model=schemas.TransactionOut, status_code=201)
def borrow_book(req: schemas.BorrowRequest, db: Session = Depends(get_db)):
    txn = crud.borrow_book(db, req)
    if not txn:
        raise HTTPException(status_code=400, detail="Book not available or not found")
    return txn

@app.post("/return", response_model=schemas.TransactionOut)
def return_book(req: schemas.ReturnRequest, db: Session = Depends(get_db)):
    txn = crud.return_book(db, req)
    if not txn:
        raise HTTPException(status_code=400, detail="Transaction not found or already returned")
    return txn


# ── Search ────────────────────────────────────────────────────────────────────

@app.get("/search", response_model=list[schemas.BookOut])
def search_books(
    q: Optional[str] = None,
    category: Optional[str] = None,
    author: Optional[str] = None,
    db: Session = Depends(get_db)
):
    return crud.search_books(db, q=q, category=category, author=author)


# ── Dashboard Stats ───────────────────────────────────────────────────────────

@app.get("/stats")
def get_stats(db: Session = Depends(get_db)):
    books = crud.get_books(db)
    transactions = crud.get_transactions(db)
    total = len(books)
    available = sum(1 for b in books if b.is_available)
    borrowed = total - available
    recent = sorted(transactions, key=lambda t: t.borrow_date, reverse=True)[:5]
    return {
        "total_books": total,
        "available_books": available,
        "borrowed_books": borrowed,
        "recent_transactions": [
            {
                "id": t.id,
                "book_title": t.book_title,
                "borrower_name": t.borrower_name,
                "borrow_date": str(t.borrow_date),
                "return_date": str(t.return_date) if t.return_date else None,
                "status": t.status,
            }
            for t in recent
        ]
    }
