import { useEffect, useState } from 'react'
import { getStats } from '../api'

export default function Dashboard() {
  const [stats, setStats] = useState(null)
  const [error, setError] = useState('')

  useEffect(() => {
    getStats()
      .then(res => setStats(res.data))
      .catch(() => setError('Failed to load stats. Is the backend running?'))
  }, [])

  if (error) return <p style={{ color: 'red' }}>{error}</p>
  if (!stats) return <p>Loading...</p>

  return (
    <div>
      <div className="page-header">
        <h1>Dashboard</h1>
      </div>

      <div className="stat-grid">
        <div className="stat-card">
          <div className="label">Total Books</div>
          <div className="value">{stats.total_books}</div>
        </div>
        <div className="stat-card available">
          <div className="label">Available</div>
          <div className="value">{stats.available_books}</div>
        </div>
        <div className="stat-card borrowed">
          <div className="label">Borrowed</div>
          <div className="value">{stats.borrowed_books}</div>
        </div>
      </div>

      <div className="table-card">
        <div className="table-card-header">Recent Transactions</div>
        {stats.recent_transactions.length === 0 ? (
          <p className="empty">No transactions yet.</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Book</th>
                <th>Borrower</th>
                <th>Borrow Date</th>
                <th>Return Date</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {stats.recent_transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.book_title}</td>
                  <td>{t.borrower_name}</td>
                  <td>{t.borrow_date}</td>
                  <td>{t.return_date || '—'}</td>
                  <td>
                    <span className={`badge ${t.status === 'returned' ? 'badge-green' : 'badge-orange'}`}>
                      {t.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
