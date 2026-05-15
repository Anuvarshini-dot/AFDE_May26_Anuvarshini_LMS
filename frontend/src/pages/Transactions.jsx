import { useEffect, useState } from 'react'
import { getBooks, getBorrowers, getTransactions, borrowBook, returnBook } from '../api'

export default function Transactions() {
  const [books, setBooks] = useState([])
  const [borrowers, setBorrowers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [borrowForm, setBorrowForm] = useState({ book_id: '', borrower_id: '' })
  const [borrowErrors, setBorrowErrors] = useState({})
  const [returnTxnId, setReturnTxnId] = useState('')
  const [returnError, setReturnError] = useState('')
  const [apiError, setApiError] = useState('')

  const load = () => {
    Promise.all([getBooks(), getBorrowers(), getTransactions()])
      .then(([b, br, t]) => {
        setBooks(b.data)
        setBorrowers(br.data)
        setTransactions(t.data.slice().reverse())
      })
      .catch(() => setApiError('Failed to load data.'))
  }

  useEffect(() => { load() }, [])

  const availableBooks = books.filter(b => b.is_available)
  const activeTxns = transactions.filter(t => t.status === 'borrowed')

  const validateBorrow = () => {
    const e = {}
    if (!borrowForm.book_id) e.book_id = 'Select a book'
    if (!borrowForm.borrower_id) e.borrower_id = 'Select a borrower'
    return e
  }

  const handleBorrow = async (e) => {
    e.preventDefault()
    const errs = validateBorrow()
    if (Object.keys(errs).length) { setBorrowErrors(errs); return }
    try {
      await borrowBook({ book_id: Number(borrowForm.book_id), borrower_id: Number(borrowForm.borrower_id) })
      setBorrowForm({ book_id: '', borrower_id: '' })
      setBorrowErrors({})
      load()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Borrow failed.')
    }
  }

  const handleReturn = async (e) => {
    e.preventDefault()
    if (!returnTxnId) { setReturnError('Select a transaction'); return }
    try {
      await returnBook({ transaction_id: Number(returnTxnId) })
      setReturnTxnId('')
      setReturnError('')
      load()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Return failed.')
    }
  }

  return (
    <div>
      <div className="page-header">
        <h1>🔄 Borrow / Return</h1>
      </div>

      {apiError && <p style={{ color: 'red', marginBottom: 12 }}>{apiError}</p>}

      <div className="txn-grid">
        {/* Borrow Form */}
        <div className="txn-card">
          <h2>📤 Borrow a Book</h2>
          <form onSubmit={handleBorrow}>
            <div className="form-group">
              <label>Available Book</label>
              <select value={borrowForm.book_id} onChange={e => setBorrowForm({ ...borrowForm, book_id: e.target.value })}>
                <option value="">-- Select Book --</option>
                {availableBooks.map(b => <option key={b.id} value={b.id}>{b.title} ({b.author})</option>)}
              </select>
              {borrowErrors.book_id && <div className="error">{borrowErrors.book_id}</div>}
            </div>
            <div className="form-group">
              <label>Borrower</label>
              <select value={borrowForm.borrower_id} onChange={e => setBorrowForm({ ...borrowForm, borrower_id: e.target.value })}>
                <option value="">-- Select Borrower --</option>
                {borrowers.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              {borrowErrors.borrower_id && <div className="error">{borrowErrors.borrower_id}</div>}
            </div>
            <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>Borrow Book</button>
          </form>
        </div>

        {/* Return Form */}
        <div className="txn-card">
          <h2>↩️ Return a Book</h2>
          <form onSubmit={handleReturn}>
            <div className="form-group">
              <label>Active Transaction</label>
              <select value={returnTxnId} onChange={e => setReturnTxnId(e.target.value)}>
                <option value="">-- Select Transaction --</option>
                {activeTxns.map(t => (
                  <option key={t.id} value={t.id}>
                    #{t.id} — {t.book_title || t.book?.title || 'Unknown'} → {t.borrower_name || t.borrower?.name || 'Unknown'}
                  </option>
                ))}
              </select>
              {returnError && <div className="error">{returnError}</div>}
            </div>
            <button type="submit" className="btn btn-success" style={{ width: '100%' }}>Return Book</button>
          </form>
        </div>
      </div>

      {/* All Transactions */}
      <div className="table-card">
        <div className="table-card-header">📋 All Transactions</div>
        {transactions.length === 0 ? (
          <p className="empty">📭 No transactions yet.</p>
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
              {transactions.map(t => (
                <tr key={t.id}>
                  <td>{t.id}</td>
                  <td>{t.book_title || t.book?.title || 'Deleted Book'}</td>
                  <td>{t.borrower_name || t.borrower?.name || 'Deleted Borrower'}</td>
                  <td>{t.borrow_date}</td>
                  <td>{t.return_date || '—'}</td>
                  <td>
                    <span className={`badge ${t.status === 'returned' ? 'badge-green' : 'badge-orange'}`}>
                      {t.status === 'returned' ? '✅ returned' : '📤 borrowed'}
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
