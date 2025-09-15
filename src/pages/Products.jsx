import React, { useEffect, useState } from 'react'

function Modal({ children, onClose, title }) {
  if (!title && !children) return null
  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <strong>{title}</strong>
          <button onClick={onClose}>✖</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

function ProductForm({ onSave, edit, onCancel }) {
  const [form, setForm] = useState(edit || { name: '', description: '', category: '', price: 0, quantity: 0 })

  useEffect(() => {
    setForm(edit || { name: '', description: '', category: '', price: 0, quantity: 0 })
  }, [edit])

  const handle = (e) => {
    setForm({ ...form, [e.target.name]: e.target.type === 'number' ? Number(e.target.value) : e.target.value })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(form)
  }

  return (
    <form onSubmit={handleSubmit} className="product-form">
      <input name="name" placeholder="Name" value={form.name} onChange={handle} required />
      <input name="description" placeholder="Description" value={form.description} onChange={handle} />
      <input name="category" placeholder="Category" value={form.category} onChange={handle} />
      <input name="price" type="number" step="0.01" placeholder="Price" value={form.price} onChange={handle} />
      <input name="quantity" type="number" placeholder="Quantity" value={form.quantity} onChange={handle} />
      <div style={{ marginTop: 8 }}>
        <button type="submit">Save</button>
        {onCancel && <button type="button" onClick={onCancel}>Cancel</button>}
      </div>
    </form>
  )
}

export default function Products() {
  const [products, setProducts] = useState([])
  const [editing, setEditing] = useState(null)
  const [showEdit, setShowEdit] = useState(false)
  const [sellFor, setSellFor] = useState(null)
  const [query, setQuery] = useState('')

  function load() {
    fetch('http://localhost:5000/api/products')
      .then((r) => r.json())
      .then(setProducts)
  }

  useEffect(() => {
    load()
  }, [])

  const save = (p) => {
    if (p.id) {
      fetch('http://localhost:5000/api/products/' + p.id, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      }).then(() => {
        setEditing(null)
        setShowEdit(false)
        load()
      })
    } else {
      fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(p),
      }).then(() => {
        setShowEdit(false)
        load()
      })
    }
  }

  const remove = (id) => {
    if (!confirm('Delete product?')) return
    fetch('http://localhost:5000/api/products/' + id, { method: 'DELETE' }).then(() => load())
  }

  const openSell = (p) => setSellFor({ product: p, qty: 1 })

  const doSell = () => {
    if (!sellFor || !sellFor.product) return
    const payload = { type: 'sale', productId: sellFor.product.id, qty: Number(sellFor.qty), note: 'sale' }
    fetch('http://localhost:5000/api/transactions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    }).then(() => {
      setSellFor(null)
      load()
      alert('Sold')
    })
  }

  const exportCSV = () => {
    const csv = ['name,category,price,quantity', ...products.map((p) => `${p.name},${p.category},${p.price},${p.quantity}`)].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = 'products.csv'
    a.click()
  }

  const filtered = products.filter(
    (p) =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.category.toLowerCase().includes(query.toLowerCase()) ||
      p.description.toLowerCase().includes(query.toLowerCase())
  )

  return (
    <div>
      <h2>Products</h2>

      <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
        <input placeholder="Search products..." value={query} onChange={(e) => setQuery(e.target.value)} />
        <button
          onClick={() => {
            setEditing(null)
            setShowEdit(true)
          }}
        >
          ➕ Add Product
        </button>
        <button onClick={exportCSV}>⬇️ Export CSV</button>
      </div>

      {showEdit && (
        <Modal title={editing ? 'Edit Product' : 'Add Product'} onClose={() => setShowEdit(false)}>
          <ProductForm onSave={save} edit={editing} onCancel={() => setShowEdit(false)} />
        </Modal>
      )}

      {sellFor && (
        <Modal title={`Sell — ${sellFor.product.name}`} onClose={() => setSellFor(null)}>
          <div>
            <div>Available: {sellFor.product.quantity}</div>
            <input
              type="number"
              value={sellFor.qty}
              onChange={(e) => setSellFor({ ...sellFor, qty: Number(e.target.value) })}
            />
            <div style={{ marginTop: 8 }}>
              <button onClick={doSell}>Confirm Sell</button>
            </div>
          </div>
        </Modal>
      )}

      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Category</th>
            <th>Price</th>
            <th>Qty</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className={p.quantity <= 5 ? 'low-stock' : ''}>
              <td>{p.name}</td>
              <td>{p.category}</td>
              <td>{p.price}</td>
              <td>{p.quantity}</td>
              <td>
                <button
                  onClick={() => {
                    setEditing(p)
                    setShowEdit(true)
                  }}
                >
                  Edit
                </button>
                <button onClick={() => openSell(p)}>Sell</button>
                <button onClick={() => remove(p.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
