import { useState } from 'react'
import { searchBooks } from '../api'

export default function Search() {
  const [q, setQ] = useState('')
  const [category, setCategory] = useState('')
  const [author, setAuthor] = useState('')
  const [results, setResults] = useState([])
  const [searched, setSearched] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleSearch = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await searchBooks({ q: q || undefined, category: category || undefined, author: author || undefined })
      setResults(res.data)
      setSearched(true)
    } finally {
      setLoading(false)
    }
  }

  const handleClear = () => {
    setQ(''); setCategory(''); setAuthor('')
    setResults([]); setSearched(false)
  }

  return (
    <div>
      <div className="page-header">
        <h1>🔍 Search Books</h1>
      </div>

      <form className="search-bar" onSubmit={handleSearch}>
        <input
          value={q}
          onChange={e => setQ(e.target.value)}
          placeholder="Search by title, author, or category..."
        />
        <input
          value={category}
          onChange={e => setCategory(e.target.value)}
          placeholder="Filter by category"
        />
        <input
          value={author}
          onChange={e => setAuthor(e.target.value)}
          placeholder="Filter by author"
        />
        <button type="submit" className="btn btn-primary" disabled={loading}>
          {loading ? '⏳ Searching...' : '🔍 Search'}
        </button>
        {searched && (
          <button type="button" className="btn btn-cancel" onClick={handleClear}>Clear</button>
        )}
      </form>

      {searched && (
        <div className="table-card">
          <div className="table-card-header">
            🔎 {results.length} result{results.length !== 1 ? 's' : ''} found
          </div>
          {results.length === 0 ? (
            <p className="empty">No books matched your search.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>#</th>
                  <th>Title</th>
                  <th>Author</th>
                  <th>Category</th>
                  <th>ISBN</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {results.map(b => (
                  <tr key={b.id}>
                    <td>{b.id}</td>
                    <td>{b.title}</td>
                    <td>{b.author}</td>
                    <td>{b.category}</td>
                    <td>{b.isbn}</td>
                    <td>
                      <span className={`badge ${b.is_available ? 'badge-green' : 'badge-orange'}`}>
                        {b.is_available ? '✅ Available' : '📤 Borrowed'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  )
}
