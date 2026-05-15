# Library Management System (LMS)

A full-stack Library Management System built with React (frontend) and FastAPI (backend), backed by SQLite. Supports complete book and borrower management, borrow/return transactions, and multi-field search.

---

## Features

- **Book Management** — Add, view, edit, and delete books with availability tracking
- **Borrower Management** — Register, update, and remove borrower records
- **Borrow & Return** — Issue books to borrowers and process returns with date tracking
- **Dashboard** — Live stats (total books, available, borrowed) with recent transaction history
- **Search & Filter** — Search books by title, author, or category with combined filters

---

## Technology Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18, React Router, Axios, Vite |
| Backend   | FastAPI, SQLAlchemy, Pydantic     |
| Database  | SQLite                            |
| Server    | Uvicorn (ASGI)                    |

---

## Project Structure

```
library-management-system/
├── frontend/               # React application
│   ├── src/
│   │   ├── pages/          # Dashboard, Books, Borrowers, Transactions, Search
│   │   ├── App.jsx         # Root component with routing
│   │   ├── api.js          # Axios API client
│   │   └── main.jsx        # React entry point
│   ├── index.html
│   ├── package.json
│   └── vite.config.js
│
├── backend/                # FastAPI application
│   ├── main.py             # API routes
│   ├── models.py           # SQLAlchemy ORM models
│   ├── schemas.py          # Pydantic validation schemas
│   ├── crud.py             # Database operations
│   ├── database.py         # DB connection and session
│   ├── library.db          # SQLite database file
│   └── requirements.txt    # Python dependencies
│
├── database/               # Database schema scripts
│   └── schema.sql
│
├── docs/                   # API documentation
│   └── API_DOCUMENTATION.md
│
├── screenshots/            # Application screenshots
│
├── README.md
├── requirements.txt        # Backend dependencies (root copy)
└── .gitignore
```

---

## Setup Instructions

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### Backend Setup

```bash
# Navigate to backend folder
cd backend

# Create and activate virtual environment
python -m venv .myenv

# Windows
.myenv\Scripts\activate

# macOS/Linux
source .myenv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn main:app --reload
```

Backend runs at: `http://localhost:8000`

Interactive API docs: `http://localhost:8000/docs`

---

### Frontend Setup

```bash
# Navigate to frontend folder
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: `http://localhost:5173`

---

### Database Setup

The SQLite database (`backend/library.db`) is created automatically when the backend starts for the first time. No manual setup is required.

To recreate the schema manually, run the SQL script:

```bash
sqlite3 backend/library.db < database/schema.sql
```

---

## API Endpoints

| Method | Endpoint              | Description                  |
|--------|-----------------------|------------------------------|
| GET    | `/books`              | List all books               |
| GET    | `/books/{id}`         | Get a single book            |
| POST   | `/books`              | Add a new book               |
| PUT    | `/books/{id}`         | Update a book                |
| DELETE | `/books/{id}`         | Delete a book                |
| GET    | `/borrowers`          | List all borrowers           |
| POST   | `/borrowers`          | Register a borrower          |
| PUT    | `/borrowers/{id}`     | Update a borrower            |
| DELETE | `/borrowers/{id}`     | Delete a borrower            |
| GET    | `/transactions`       | List all transactions        |
| POST   | `/borrow`             | Borrow a book                |
| POST   | `/return`             | Return a book                |
| GET    | `/search`             | Search books (title/author/category) |
| GET    | `/stats`              | Dashboard statistics         |

Full request/response examples are in [docs/API_DOCUMENTATION.md](docs/API_DOCUMENTATION.md).

---

## Screenshots

Screenshots are available in the [screenshots/](screenshots/) folder, including:

- Dashboard view
- Books management (list, add, edit, delete)
- Borrowers management
- Borrow & Return transactions
- Search and filter results
- API testing via Postman

---

## Database Schema

See [database/schema.sql](database/schema.sql) for the full schema.

| Table        | Columns                                                        |
|--------------|----------------------------------------------------------------|
| books        | id, title, author, category, isbn, is_available               |
| borrowers    | id, name, contact_number, email                               |
| transactions | id, book_id, borrower_id, borrow_date, return_date, status    |
