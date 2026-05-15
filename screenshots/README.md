# Screenshots — LibraryMS

All screenshots were captured from the running application at `http://localhost:5173`.

---

## 01 — Dashboard
**File:** `01_Dashboard_page.png`

Dashboard showing live stats: Total Books, Available, and Borrowed counts. Includes a Recent Transactions table with borrow/return history.

---

## 02 — Books Page
**File:** `02_Books_page.png`

Books list with columns for Title, Author, Category, ISBN, Status, and Actions (Edit / Delete). Includes an **Available Only** toggle switch to filter available books instantly.

---

## 03 — Add Book Form
**File:** `03_Add_book_page.png`

Modal form to add a new book. Fields: Title, Author, Category, ISBN.

---

## 04 — Borrowers Page
**File:** `04_Borrowers_page.png`

Borrowers list showing Name, Contact Number, Email, and Edit / Delete actions per row.

---

## 05 — Add Borrower Form
**File:** `05_Add_borrowers_page.png`

Modal form to register a new borrower. Fields: Full Name, Contact Number, Email.

---

## 06 — Borrow / Return Page
**File:** `06_Borrow_return_page.png`

Split-panel page with **Borrow a Book** (select book + borrower) on the left and **Return a Book** (select active transaction) on the right. Full transaction history table below.

---

## 07 — Search Page
**File:** `07_Search_book_page.png`

Search books using keyword (title/author/category), category filter, and author filter. Displays matching results with availability status.

---

## How to Run

```bash
# Terminal 1 — Backend
cd backend
uvicorn main:app --reload

# Terminal 2 — Frontend
cd frontend
npm run dev
```

Open `http://localhost:5173` in your browser.
