from sqlalchemy.orm import Session
from sqlalchemy import or_
from datetime import date
import models, schemas


# ── Books ─────────────────────────────────────────────────────────────────────

def get_books(db: Session):
    return db.query(models.Book).all()

def get_book(db: Session, book_id: int):
    return db.query(models.Book).filter(models.Book.id == book_id).first()

def create_book(db: Session, book: schemas.BookCreate):
    db_book = models.Book(**book.model_dump())
    db.add(db_book)
    db.commit()
    db.refresh(db_book)
    return db_book

def update_book(db: Session, book_id: int, book: schemas.BookUpdate):
    db_book = get_book(db, book_id)
    if not db_book:
        return None
    for field, value in book.model_dump(exclude_none=True).items():
        setattr(db_book, field, value)
    db.commit()
    db.refresh(db_book)
    return db_book

def delete_book(db: Session, book_id: int):
    db_book = get_book(db, book_id)
    if not db_book:
        return None, "not_found"
    has_active = db.query(models.Transaction).filter(
        models.Transaction.book_id == book_id,
        models.Transaction.status == "borrowed"
    ).first() is not None
    if has_active:
        return None, "active"
    db.delete(db_book)
    db.commit()
    return db_book, "ok"


# ── Borrowers ─────────────────────────────────────────────────────────────────

def get_borrowers(db: Session):
    return db.query(models.Borrower).all()

def get_borrower(db: Session, borrower_id: int):
    return db.query(models.Borrower).filter(models.Borrower.id == borrower_id).first()

def create_borrower(db: Session, borrower: schemas.BorrowerCreate):
    db_borrower = models.Borrower(**borrower.model_dump())
    db.add(db_borrower)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower

def update_borrower(db: Session, borrower_id: int, borrower: schemas.BorrowerUpdate):
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return None
    for field, value in borrower.model_dump(exclude_none=True).items():
        setattr(db_borrower, field, value)
    db.commit()
    db.refresh(db_borrower)
    return db_borrower

def delete_borrower(db: Session, borrower_id: int):
    db_borrower = get_borrower(db, borrower_id)
    if not db_borrower:
        return None, "not_found"
    has_active = db.query(models.Transaction).filter(
        models.Transaction.borrower_id == borrower_id,
        models.Transaction.status == "borrowed"
    ).first() is not None
    if has_active:
        return None, "active"
    db.delete(db_borrower)
    db.commit()
    return db_borrower, "ok"


# ── Transactions ──────────────────────────────────────────────────────────────

def get_transactions(db: Session):
    return db.query(models.Transaction).all()

def borrow_book(db: Session, req: schemas.BorrowRequest):
    book = get_book(db, req.book_id)
    if not book or not book.is_available:
        return None
    borrower = get_borrower(db, req.borrower_id)
    if not borrower:
        return None
    book.is_available = False
    txn = models.Transaction(
        book_id=req.book_id,
        borrower_id=req.borrower_id,
        book_title=book.title,
        borrower_name=borrower.name,
        borrow_date=date.today(),
        status="borrowed"
    )
    db.add(txn)
    db.commit()
    db.refresh(txn)
    return txn

def return_book(db: Session, req: schemas.ReturnRequest):
    txn = db.query(models.Transaction).filter(models.Transaction.id == req.transaction_id).first()
    if not txn or txn.status == "returned":
        return None
    txn.return_date = date.today()
    txn.status = "returned"
    book = get_book(db, txn.book_id)
    if book:
        book.is_available = True
    db.commit()
    db.refresh(txn)
    return txn


# ── Search ────────────────────────────────────────────────────────────────────

def search_books(db: Session, q: str = None, category: str = None, author: str = None):
    query = db.query(models.Book)
    if q:
        query = query.filter(
            or_(
                models.Book.title.ilike(f"%{q}%"),
                models.Book.author.ilike(f"%{q}%"),
                models.Book.category.ilike(f"%{q}%"),
            )
        )
    if category:
        query = query.filter(models.Book.category.ilike(f"%{category}%"))
    if author:
        query = query.filter(models.Book.author.ilike(f"%{author}%"))
    return query.all()
