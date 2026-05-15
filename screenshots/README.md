# Screenshots — LibraryMS

All screenshots were captured from the running application at `http://localhost:5173`.

---

## 01 — Initial Dashboard
**File:** `01_Initial_Dashboard.png`

Dashboard on first launch showing stats: Total Books **1**, Available **1**, Borrowed **0**. The Recent Transactions panel shows "No transactions yet."

---

## 02 — Add Book Form
**File:** `02_Add_books_page.png`

Modal form on the Books page used to add a new book. Fields: Title, Author, Category, ISBN. Shown here filled with *1984* by George Orwell (Dystopian Fiction).

---

## 03 — Books List (Initial — 1 Book)
**File:** `03_Initial_list_of_books.png`

Books page after adding the first book. Table columns: #, Title, Author, Category, ISBN, Status, Actions (Edit / Delete). The single entry *1984* shows status **Available**.

---

## 04 — Books List (5 Books)
**File:** `04_list_book_page.png`

Books page after adding more records. Shows 5 books — *1984*, *Crime and Punishment*, *Meditations*, *Dune*, *To Kill a Mockingbird* — all with **Available** status and Edit / Delete buttons.

---

## 05 — Borrowers List
**File:** `05_list_browers_page.png`

Borrowers page listing 3 registered borrowers with Name, Contact, and Email columns. Records: anuvarshini s s, Shriram Kumar, Shruthi. Each row has Edit / Delete actions.

---

## 06 — Add Borrower Form
**File:** `06_add_browers_page.png`

Modal form to register a new borrower. Fields: Full Name, Contact Number, Email. Shown in empty/placeholder state over the Borrowers list.

---

## 07 — Borrow / Return Page
**File:** `07_transaction_borrow_return_page.png`

Split-panel page: left panel **Borrow a Book** (dropdowns for Available Book and Borrower + Borrow Book button), right panel **Return a Book** (dropdown for Active Transaction + Return Book button). Below both panels, the All Transactions table shows 2 records — *1984* borrowed by anuvarshini s s (status: **borrowed**) and *Meditations* returned by Shriram Kumar (status: **returned**).

---

## 08 — Search Page
**File:** `08_search_page.png`

Search Books page with three filter inputs: keyword (title/author/category), category filter, and author filter. Shown with category filtered to *Historical Fiction*, returning 1 result: *To Kill a Mockingbird* by Harper Lee (Available).

---

## 09 — Dashboard (Populated)
**File:** `09_dashboard_page.png`

Dashboard after full data entry. Stats: Total Books **5**, Available **4**, Borrowed **1**. Recent Transactions table shows *Meditations* returned by Shriram Kumar and *1984* currently borrowed by anuvarshini s s.

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
