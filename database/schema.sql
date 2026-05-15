-- Library Management System - Database Schema
-- SQLite

-- Drop tables if they exist (for clean recreation)
DROP TABLE IF EXISTS transactions;
DROP TABLE IF EXISTS books;
DROP TABLE IF EXISTS borrowers;

-- Books table
CREATE TABLE books (
    id          INTEGER PRIMARY KEY AUTOINCREMENT,
    title       TEXT    NOT NULL,
    author      TEXT    NOT NULL,
    category    TEXT    NOT NULL,
    isbn        TEXT    NOT NULL UNIQUE,
    is_available INTEGER NOT NULL DEFAULT 1  -- 1 = available, 0 = borrowed
);

-- Borrowers table
CREATE TABLE borrowers (
    id             INTEGER PRIMARY KEY AUTOINCREMENT,
    name           TEXT    NOT NULL,
    contact_number TEXT    NOT NULL,
    email          TEXT    NOT NULL UNIQUE
);

-- Transactions table
CREATE TABLE transactions (
    id           INTEGER PRIMARY KEY AUTOINCREMENT,
    book_id      INTEGER NOT NULL REFERENCES books(id),
    borrower_id  INTEGER NOT NULL REFERENCES borrowers(id),
    borrow_date  TEXT    NOT NULL,  -- ISO date: YYYY-MM-DD
    return_date  TEXT,              -- NULL until returned
    status       TEXT    NOT NULL DEFAULT 'borrowed'  -- 'borrowed' | 'returned'
);

-- Sample data (optional – remove before submission if not needed)
INSERT INTO books (title, author, category, isbn, is_available) VALUES
    ('The Great Gatsby',        'F. Scott Fitzgerald', 'Fiction',    '978-0743273565', 1),
    ('Clean Code',              'Robert C. Martin',    'Technology', '978-0132350884', 1),
    ('To Kill a Mockingbird',   'Harper Lee',          'Fiction',    '978-0061935466', 1),
    ('Design Patterns',         'Gang of Four',        'Technology', '978-0201633610', 1),
    ('Sapiens',                 'Yuval Noah Harari',   'Non-Fiction','978-0062316097', 1);

INSERT INTO borrowers (name, contact_number, email) VALUES
    ('Alice Johnson', '9876543210', 'alice@example.com'),
    ('Bob Smith',     '9123456780', 'bob@example.com');
