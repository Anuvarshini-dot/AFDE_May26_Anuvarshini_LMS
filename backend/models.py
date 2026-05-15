from sqlalchemy import Column, Integer, String, Boolean, Date, ForeignKey
from sqlalchemy.orm import relationship
from database import Base

class Book(Base):
    __tablename__ = "books"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, nullable=False)
    author = Column(String, nullable=False)
    category = Column(String, nullable=False)
    isbn = Column(String, unique=True, nullable=False)
    is_available = Column(Boolean, default=True)

    transactions = relationship("Transaction", back_populates="book", passive_deletes=True)


class Borrower(Base):
    __tablename__ = "borrowers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, nullable=False)
    contact_number = Column(String, nullable=False)
    email = Column(String, unique=True, nullable=False)

    transactions = relationship("Transaction", back_populates="borrower", passive_deletes=True)


class Transaction(Base):
    __tablename__ = "transactions"

    id = Column(Integer, primary_key=True, index=True)
    book_id = Column(Integer, ForeignKey("books.id"), nullable=False)
    borrower_id = Column(Integer, ForeignKey("borrowers.id"), nullable=False)
    book_title = Column(String, nullable=False)
    borrower_name = Column(String, nullable=False)
    borrow_date = Column(Date, nullable=False)
    return_date = Column(Date, nullable=True)
    status = Column(String, default="borrowed")  # borrowed | returned

    book = relationship("Book", back_populates="transactions")
    borrower = relationship("Borrower", back_populates="transactions")
