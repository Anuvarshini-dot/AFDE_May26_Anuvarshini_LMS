import { BrowserRouter, Routes, Route, NavLink } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Books from './pages/Books'
import Borrowers from './pages/Borrowers'
import Transactions from './pages/Transactions'
import Search from './pages/Search'

export default function App() {
  return (
    <BrowserRouter>
      <div className="layout">
        <aside className="sidebar">
          <div className="sidebar-title">📚 LibraryMS</div>
          <nav>
            <NavLink to="/" end>🏠 Dashboard</NavLink>
            <NavLink to="/books">📖 Books</NavLink>
            <NavLink to="/borrowers">👤 Borrowers</NavLink>
            <NavLink to="/transactions">🔄 Borrow / Return</NavLink>
            <NavLink to="/search">🔍 Search</NavLink>
          </nav>
        </aside>
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/books" element={<Books />} />
            <Route path="/borrowers" element={<Borrowers />} />
            <Route path="/transactions" element={<Transactions />} />
            <Route path="/search" element={<Search />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  )
}
