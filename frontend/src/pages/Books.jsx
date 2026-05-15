import { useEffect, useState } from 'react'
import { getBooks, createBook, updateBook, deleteBook } from '../api'

const EMPTY_FORM = { title: '', author: '', category: '', isbn: '' }

export default function Books() {
  const [books, setBooks] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)

  const load = () => getBooks().then(res => setBooks(res.data)).catch(() => setApiError('Failed to load books.'))

  useEffect(() => { load() }, [])

  const validate = () => {
    const e = {}
    if (!form.title.trim()) e.title = 'Title is required'
    if (!form.author.trim()) e.author = 'Author is required'
    if (!form.category.trim()) e.category = 'Category is required'
    if (!form.isbn.trim()) e.isbn = 'ISBN is required'
    return e
  }

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setErrors({}); setShowModal(true) }
  const openEdit = (book) => { setForm({ title: book.title, author: book.author, category: book.category, isbn: book.isbn }); setEditing(book.id); setErrors({}); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      if (editing) await updateBook(editing, form)
      else await createBook(form)
      closeModal()
      load()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this book?')) return
    try {
      await deleteBook(id)
      load()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Failed to delete book.')
    }
  }

  const displayed = showAvailableOnly ? books.filter(b => b.is_available) : books

  return (
    <div>
      <div className="page-header">
        <h1>📖 Books</h1>
        <div style={{ display: 'flex', gap: 14, alignItems: 'center' }}>
          <label className="toggle-switch">
            <input type="checkbox" checked={showAvailableOnly} onChange={e => setShowAvailableOnly(e.target.checked)} />
            <span className="toggle-slider"></span>
            <span className="toggle-label">📗 Available Only</span>
          </label>
          <button className="btn btn-primary" onClick={openAdd}>➕ Add Book</button>
        </div>
      </div>

      {apiError && <p style={{ color: '#dc2626', marginBottom: 12 }}>{apiError}</p>}

      <div className="table-card">
        {displayed.length === 0 ? (
          <p className="empty">{showAvailableOnly ? 'No available books right now.' : 'No books found. Add your first book!'}</p>
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
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {displayed.map(b => (
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
                  <td>
                    <div className="actions">
                      <button className="btn btn-sm btn-primary" onClick={() => openEdit(b)}>Edit</button>
                      <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>{editing ? 'Edit Book' : 'Add Book'}</h2>
            <form onSubmit={handleSubmit}>
              {['title', 'author', 'category', 'isbn'].map(field => (
                <div className="form-group" key={field}>
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    value={form[field]}
                    onChange={e => setForm({ ...form, [field]: e.target.value })}
                    placeholder={`Enter ${field}`}
                  />
                  {errors[field] && <div className="error">{errors[field]}</div>}
                </div>
              ))}
              <div className="form-actions">
                <button type="button" className="btn btn-cancel" onClick={closeModal}>Cancel</button>
                <button type="submit" className="btn btn-primary">{editing ? 'Update' : 'Add'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
