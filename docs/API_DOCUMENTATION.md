# API Documentation — Library Management System

Base URL: `http://localhost:8000`

Interactive Swagger UI: `http://localhost:8000/docs`

---

## Books

### GET /books
Returns a list of all books.

**Response 200**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "isbn": "978-0743273565",
    "is_available": true
  }
]
```

---

### GET /books/{id}
Returns a single book by ID.

**Path Parameter:** `id` (integer)

**Response 200**
```json
{
  "id": 1,
  "title": "The Great Gatsby",
  "author": "F. Scott Fitzgerald",
  "category": "Fiction",
  "isbn": "978-0743273565",
  "is_available": true
}
```

**Response 404**
```json
{ "detail": "Book not found" }
```

---

### POST /books
Adds a new book.

**Request Body**
```json
{
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Technology",
  "isbn": "978-0132350884"
}
```

**Response 201**
```json
{
  "id": 2,
  "title": "Clean Code",
  "author": "Robert C. Martin",
  "category": "Technology",
  "isbn": "978-0132350884",
  "is_available": true
}
```

---

### PUT /books/{id}
Updates an existing book. All fields are optional.

**Request Body**
```json
{
  "title": "Clean Code (Updated)",
  "category": "Software Engineering"
}
```

**Response 200** — returns updated book object.

**Response 404**
```json
{ "detail": "Book not found" }
```

---

### DELETE /books/{id}
Deletes a book by ID.

**Response 200** — returns deleted book object.

**Response 404**
```json
{ "detail": "Book not found" }
```

---

## Borrowers

### GET /borrowers
Returns a list of all borrowers.

**Response 200**
```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "contact_number": "9876543210",
    "email": "alice@example.com"
  }
]
```

---

### POST /borrowers
Registers a new borrower.

**Request Body**
```json
{
  "name": "Bob Smith",
  "contact_number": "9123456780",
  "email": "bob@example.com"
}
```

**Response 201**
```json
{
  "id": 2,
  "name": "Bob Smith",
  "contact_number": "9123456780",
  "email": "bob@example.com"
}
```

---

### PUT /borrowers/{id}
Updates a borrower record.

**Request Body** (all fields optional)
```json
{
  "contact_number": "9000000000"
}
```

**Response 200** — returns updated borrower object.

**Response 404**
```json
{ "detail": "Borrower not found" }
```

---

### DELETE /borrowers/{id}
Deletes a borrower by ID.

**Response 200** — returns deleted borrower object.

**Response 404**
```json
{ "detail": "Borrower not found" }
```

---

## Transactions

### GET /transactions
Returns all borrow/return transaction records.

**Response 200**
```json
[
  {
    "id": 1,
    "book_id": 1,
    "borrower_id": 1,
    "borrow_date": "2026-05-15",
    "return_date": null,
    "status": "borrowed",
    "book": { "id": 1, "title": "The Great Gatsby", ... },
    "borrower": { "id": 1, "name": "Alice Johnson", ... }
  }
]
```

---

### POST /borrow
Issues a book to a borrower. Marks the book as unavailable.

**Request Body**
```json
{
  "book_id": 1,
  "borrower_id": 1
}
```

**Response 201**
```json
{
  "id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "borrow_date": "2026-05-15",
  "return_date": null,
  "status": "borrowed"
}
```

**Response 400**
```json
{ "detail": "Book not available or not found" }
```

---

### POST /return
Returns a borrowed book. Marks the book as available again.

**Request Body**
```json
{
  "transaction_id": 1
}
```

**Response 200**
```json
{
  "id": 1,
  "book_id": 1,
  "borrower_id": 1,
  "borrow_date": "2026-05-15",
  "return_date": "2026-05-20",
  "status": "returned"
}
```

**Response 400**
```json
{ "detail": "Transaction not found or already returned" }
```

---

## Search

### GET /search
Search books by title, author, or category. All parameters are optional and can be combined.

**Query Parameters**

| Parameter  | Type   | Description                        |
|------------|--------|------------------------------------|
| `q`        | string | Full-text search (title/author/category) |
| `category` | string | Filter by category                 |
| `author`   | string | Filter by author                   |

**Example Request**
```
GET /search?q=gatsby&category=Fiction
```

**Response 200**
```json
[
  {
    "id": 1,
    "title": "The Great Gatsby",
    "author": "F. Scott Fitzgerald",
    "category": "Fiction",
    "isbn": "978-0743273565",
    "is_available": true
  }
]
```

---

## Dashboard Stats

### GET /stats
Returns summary statistics for the dashboard.

**Response 200**
```json
{
  "total_books": 10,
  "available_books": 7,
  "borrowed_books": 3,
  "recent_transactions": [
    {
      "id": 1,
      "book_title": "The Great Gatsby",
      "borrower_name": "Alice Johnson",
      "borrow_date": "2026-05-15",
      "return_date": null,
      "status": "borrowed"
    }
  ]
}
```

---

## HTTP Status Codes Used

| Code | Meaning                        |
|------|--------------------------------|
| 200  | OK — request succeeded         |
| 201  | Created — resource created     |
| 400  | Bad Request — validation error |
| 404  | Not Found — resource missing   |
| 422  | Unprocessable Entity — invalid input schema |
