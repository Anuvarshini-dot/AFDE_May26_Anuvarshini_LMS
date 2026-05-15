import { useEffect, useState } from 'react'
import { getBorrowers, createBorrower, updateBorrower, deleteBorrower } from '../api'

const EMPTY_FORM = { name: '', contact_number: '', email: '' }

export default function Borrowers() {
  const [borrowers, setBorrowers] = useState([])
  const [showModal, setShowModal] = useState(false)
  const [editing, setEditing] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [apiError, setApiError] = useState('')

  const load = () => getBorrowers().then(res => setBorrowers(res.data)).catch(() => setApiError('Failed to load borrowers.'))

  useEffect(() => { load() }, [])

  const validate = () => {
    const e = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (!form.contact_number.trim()) e.contact_number = 'Contact number is required'
    if (!form.email.trim()) e.email = 'Email is required'
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email'
    return e
  }

  const openAdd = () => { setForm(EMPTY_FORM); setEditing(null); setErrors({}); setShowModal(true) }
  const openEdit = (b) => { setForm({ name: b.name, contact_number: b.contact_number, email: b.email }); setEditing(b.id); setErrors({}); setShowModal(true) }
  const closeModal = () => setShowModal(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    try {
      if (editing) await updateBorrower(editing, form)
      else await createBorrower(form)
      closeModal()
      load()
    } catch (err) {
      setApiError(err.response?.data?.detail || 'Something went wrong.')
    }
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this borrower?')) return
    await deleteBorrower(id)
    load()
  }

  return (
    <div>
      <div className="page-header">
        <h1>Borrowers</h1>
        <button className="btn btn-primary" onClick={openAdd}>+ Add Borrower</button>
      </div>

      {apiError && <p style={{ color: 'red', marginBottom: 12 }}>{apiError}</p>}

      <div className="table-card">
        {borrowers.length === 0 ? (
          <p className="empty">No borrowers yet. Add your first borrower!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Contact</th>
                <th>Email</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {borrowers.map(b => (
                <tr key={b.id}>
                  <td>{b.id}</td>
                  <td>{b.name}</td>
                  <td>{b.contact_number}</td>
                  <td>{b.email}</td>
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
            <h2>{editing ? 'Edit Borrower' : 'Add Borrower'}</h2>
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label>Name</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Full name" />
                {errors.name && <div className="error">{errors.name}</div>}
              </div>
              <div className="form-group">
                <label>Contact Number</label>
                <input value={form.contact_number} onChange={e => setForm({ ...form, contact_number: e.target.value })} placeholder="Phone number" />
                {errors.contact_number && <div className="error">{errors.contact_number}</div>}
              </div>
              <div className="form-group">
                <label>Email</label>
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="email@example.com" />
                {errors.email && <div className="error">{errors.email}</div>}
              </div>
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
