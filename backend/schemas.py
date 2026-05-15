from pydantic import BaseModel, EmailStr
from typing import Optional
from datetime import date


# ── Book Schemas ──────────────────────────────────────────────────────────────

class BookCreate(BaseModel):
    title: str
    author: str
    category: str
    isbn: str

class BookUpdate(BaseModel):
    title: Optional[str] = None
    author: Optional[str] = None
    category: Optional[str] = None
    isbn: Optional[str] = None

class BookOut(BaseModel):
    id: int
    title: str
    author: str
    category: str
    isbn: str
    is_available: bool

    class Config:
        from_attributes = True


# ── Borrower Schemas ──────────────────────────────────────────────────────────

class BorrowerCreate(BaseModel):
    name: str
    contact_number: str
    email: EmailStr

class BorrowerUpdate(BaseModel):
    name: Optional[str] = None
    contact_number: Optional[str] = None
    email: Optional[EmailStr] = None

class BorrowerOut(BaseModel):
    id: int
    name: str
    contact_number: str
    email: str

    class Config:
        from_attributes = True


# ── Transaction Schemas ───────────────────────────────────────────────────────

class BorrowRequest(BaseModel):
    book_id: int
    borrower_id: int

class ReturnRequest(BaseModel):
    transaction_id: int

class TransactionOut(BaseModel):
    id: int
    book_id: int
    borrower_id: int
    book_title: Optional[str] = None
    borrower_name: Optional[str] = None
    borrow_date: date
    return_date: Optional[date] = None
    status: str
    book: Optional[BookOut] = None
    borrower: Optional[BorrowerOut] = None

    class Config:
        from_attributes = True
