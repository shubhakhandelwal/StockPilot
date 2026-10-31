import { useEffect, useState } from 'react'
import './App.css'

const API = 'http://127.0.0.1:8000'

function App() {
  const [logged, setLogged] = useState(false)
  const [user, setUser] = useState('')
  const [pass, setPass] = useState('')
  const [error, setError] = useState('')
  const [page, setPage] = useState('Dashboard')

  const [products, setProducts] = useState([])
  const [alerts, setAlerts] = useState([])
  const [history, setHistory] = useState([])

  const [name, setName] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [reorder, setReorder] = useState('')
  const [product, setProduct] = useState('')
  const [type, setType] = useState('IN')
  const [amount, setAmount] = useState('')
  const [message, setMessage] = useState('')

  async function api(path, method = 'GET', data = null) {
    const res = await fetch(API + path, {
      method,
      headers: { 'Content-Type': 'application/json' },
      ...(data && { body: JSON.stringify(data) })
    })
    const result = await res.json()
    if (!res.ok) throw new Error(result.detail || 'Request failed')
    return result
  }

  async function load() {
    try {
      const [p, a, h] = await Promise.all([
        api('/products'), api('/alerts'), api('/movements')
      ])
      setProducts(p)
      setAlerts(a)
      setHistory(h)
    } catch (e) {
      setMessage(e.message)
    }
  }

  useEffect(() => {
    if (logged) load()
  }, [logged])

  function signIn(e) {
    e.preventDefault()
    if (user.trim().toLowerCase() === 'admin' && pass.trim() === 'stock123') {
      setLogged(true)
      setError('')
    } else {
      setError('Invalid username or password')
    }
  }

  async function addProduct(e) {
    e.preventDefault()
    try {
      await api('/products', 'POST', {
        name, category, quantity: +quantity, reorder: +reorder
      })
      setName('')
      setCategory('')
      setQuantity('')
      setReorder('')
      setMessage('Product added successfully!')
      load()
    } catch (e) {
      setMessage(e.message)
    }
  }

  async function moveStock(e) {
    e.preventDefault()
    try {
      await api('/movement', 'POST', {
        product, type, quantity: +amount
      })
      setAmount('')
      setMessage('Stock movement updated!')
      load()
    } catch (e) {
      setMessage(e.message)
    }
  }

  if (!logged) return (
    <div className="login">
      <form onSubmit={signIn}>
        <div className="logo">📦</div>
        <h1>StockPilot</h1>
        <p>Smart Inventory Management</p>
        <input placeholder="Username" value={user}
          onChange={e => setUser(e.target.value)} required />
        <input type="password" placeholder="Password" value={pass}
          onChange={e => setPass(e.target.value)} required />
        {error && <p className="error">{error}</p>}
        <button>Log In</button>
      </form>
    </div>
  )

  const menu = [
    ['Dashboard', 'grid'],
    ['Current Stock', 'package'],
    ['Add Product', 'plus-circle'],
    ['Product Movement', 'repeat']
  ]

  return (
    <div className="layout">
      <aside>
        <h2>📦 StockPilot</h2>
        <p className="menu-title">MENU</p>

        {menu.map(([item, icon]) => (
          <button key={item}
            className={page === item ? 'active' : ''}
            onClick={() => { setPage(item); setMessage('') }}>
            <span>{{
              grid: '▦', package: '▣',
              'plus-circle': '＋', repeat: '↻'
            }[icon]}</span>
            {item}
          </button>
        ))}

        <button className="logout" onClick={() => setLogged(false)}>
          <span>↪</span> Logout
        </button>
      </aside>

      <main>
        <header>
          <div>
            <h1>{page === 'Dashboard' ? 'Welcome back 👋' : page}</h1>
            <p>Manage your inventory with StockPilot</p>
          </div>
          <div className="profile">A</div>
        </header>

        {message && <p className="message">{message}</p>}

        {page === 'Dashboard' && <>
          <div className="stats">
            <div className="stat pink">
              <span>📦</span><p>Total Products</p>
              <h2>{products.length}</h2>
            </div>
            <div className="stat orange">
              <span>⚠️</span><p>Low Stock</p>
              <h2>{alerts.length}</h2>
            </div>
            <div className="stat purple">
              <span>▣</span><p>Total Units</p>
              <h2>{products.reduce((s, p) => s + p.quantity, 0)}</h2>
            </div>
            <div className="stat blue">
              <span>↻</span><p>Movements</p>
              <h2>{history.length}</h2>
            </div>
          </div>

          <section>
            <h2>Quick Actions</h2>
            <div className="quick-actions">
              {['Current Stock', 'Add Product', 'Product Movement'].map(item =>
                <button key={item} onClick={() => { setPage(item); setMessage('') }}>
                  {item} →
                </button>
              )}
            </div>
          </section>

          <section>
            <h2>⚠️ Low Stock Alerts</h2>
            {alerts.length ? alerts.map(p =>
              <div className="activity" key={p.id}>
                <strong>{p.name}</strong>
                <span>{p.quantity} units left</span>
                <span className="low">Low Stock</span>
              </div>
            ) : <p>All products have sufficient stock!</p>}
          </section>

          <section>
            <h2>Recent Activity</h2>
            {history.slice(0, 5).map(h =>
              <div className="activity" key={h.id}>
                <strong>{h.product}</strong>
                <span>{h.quantity} units</span>
                <span className={h.type === 'IN' ? 'good' : 'low'}>{h.type}</span>
              </div>
            )}
            {!history.length && <p>No recent movements.</p>}
          </section>
        </>}

        {page === 'Current Stock' && <section>
          <h2>Inventory Overview</h2>
          <table>
            <thead><tr><th>Product</th><th>Category</th><th>Quantity</th><th>Reorder Level</th><th>Status</th></tr></thead>
            <tbody>
              {products.map(p => <tr key={p.id}>
                <td>{p.name}</td><td>{p.category}</td>
                <td>{p.quantity}</td><td>{p.reorder}</td>
                <td className={p.quantity <= p.reorder ? 'low' : 'good'}>
                  {p.quantity <= p.reorder ? 'Low Stock' : 'In Stock'}
                </td>
              </tr>)}
            </tbody>
          </table>
          {!products.length && <p>No products added yet.</p>}
        </section>}

        {page === 'Add Product' && <section className="form-box">
          <h2>Add New Product</h2>
          <form onSubmit={addProduct}>
            <label>Product Name</label>
            <input placeholder="Enter product name" value={name}
              onChange={e => setName(e.target.value)} required />
            <label>Category</label>
            <input placeholder="Enter category" value={category}
              onChange={e => setCategory(e.target.value)} required />
            <label>Current Quantity</label>
            <input type="number" min="0" placeholder="Enter quantity"
              value={quantity} onChange={e => setQuantity(e.target.value)} required />
            <label>Reorder Level</label>
            <input type="number" min="0" placeholder="Enter reorder level"
              value={reorder} onChange={e => setReorder(e.target.value)} required />
            <button>Add Product</button>
          </form>
          <h3>Recently Added</h3>
          {products.slice(-5).reverse().map(p =>
            <div className="activity" key={p.id}>
              <strong>{p.name}</strong><span>{p.quantity} units</span>
            </div>
          )}
        </section>}

        {page === 'Product Movement' && <section className="form-box">
          <h2>Record Stock Movement</h2>
          <form onSubmit={moveStock}>
            <label>Select Product</label>
            <select value={product} onChange={e => setProduct(e.target.value)} required>
              <option value="">Choose product</option>
              {products.map(p => <option key={p.id}>{p.name}</option>)}
            </select>
            <label>Movement Type</label>
            <select value={type} onChange={e => setType(e.target.value)}>
              <option value="IN">Stock IN</option>
              <option value="OUT">Stock OUT</option>
            </select>
            <label>Quantity</label>
            <input type="number" min="1" placeholder="Enter quantity"
              value={amount} onChange={e => setAmount(e.target.value)} required />
            <button>Save Movement</button>
          </form>
          <h3>Movement History</h3>
          {history.map(h =>
            <div className="activity" key={h.id}>
              <strong>{h.product}</strong>
              <span>{h.quantity} units</span>
              <span className={h.type === 'IN' ? 'good' : 'low'}>{h.type}</span>
            </div>
          )}
          {!history.length && <p>No movements recorded yet.</p>}
        </section>}
      </main>
    </div>
  )
}

export default App