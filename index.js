
const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
const DATA_FILE = path.join(__dirname, 'db.json');

app.use(cors());
app.use(bodyParser.json());

function readDB() {
  if (!fs.existsSync(DATA_FILE)) return { products: [], transactions: [], customers: [] };
  const raw = fs.readFileSync(DATA_FILE, 'utf8');
  return JSON.parse(raw);
}
function writeDB(data) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

// Products
app.get('/api/products', (req, res) => {
  const db = readDB();
  res.json(db.products || []);
});
app.post('/api/products', (req, res) => {
  const db = readDB();
  const p = req.body; p.id = Date.now().toString();
  db.products.push(p); writeDB(db); res.json(p);
});
app.put('/api/products/:id', (req, res) => {
  const db = readDB(); const id = req.params.id;
  const idx = db.products.findIndex(x=>x.id===id);
  if(idx===-1) return res.status(404).json({message:'Not found'});
  db.products[idx] = {...db.products[idx], ...req.body}; writeDB(db); res.json(db.products[idx]);
});
app.delete('/api/products/:id', (req, res) => {
  const db = readDB(); db.products = db.products.filter(p=>p.id!==req.params.id); writeDB(db); res.json({message:'Deleted'});
});

// Transactions
app.get('/api/transactions', (req, res) => { const db = readDB(); res.json(db.transactions || []); });
app.post('/api/transactions', (req, res) => {
  const db = readDB(); const tx = req.body; tx.id = Date.now().toString(); tx.date = new Date().toISOString();
  db.transactions.push(tx);
  const pIdx = db.products.findIndex(p=>p.id===tx.productId);
  if(pIdx!==-1){
    if(tx.type === 'add') db.products[pIdx].quantity += tx.qty;
    else db.products[pIdx].quantity -= tx.qty;
    if(db.products[pIdx].quantity < 0) db.products[pIdx].quantity = 0;
  }
  writeDB(db); res.json(tx);
});

// Customers
app.get('/api/customers', (req, res) => { const db = readDB(); res.json(db.customers || []); });
app.post('/api/customers', (req, res) => { const db = readDB(); const c = req.body; c.id = Date.now().toString(); db.customers.push(c); writeDB(db); res.json(c); });
app.put('/api/customers/:id', (req, res) => {
  const db = readDB(); const id = req.params.id;
  const idx = db.customers.findIndex(c=>c.id===id);
  if(idx===-1) return res.status(404).json({message:'Not found'});
  db.customers[idx] = {...db.customers[idx], ...req.body}; writeDB(db); res.json(db.customers[idx]);
});
app.delete('/api/customers/:id', (req, res) => { const db = readDB(); db.customers = db.customers.filter(c=>c.id!==req.params.id); writeDB(db); res.json({message:'Deleted'}); });

// Sales summary, export
app.get('/api/sales-summary', (req, res) => {
  const db = readDB();
  const sales = db.transactions.filter(t=>t.type==='sale');
  const totalSalesAmount = sales.reduce((acc,s)=>{
    const product = db.products.find(p=>p.id===s.productId); const price = product?product.price:0; return acc + (price * s.qty);
  },0);
  const days = {};
  for(let i=6;i>=0;i--){ const d=new Date(); d.setDate(d.getDate()-i); days[d.toISOString().slice(0,10)] = 0; }
  sales.forEach(s=>{ const day=s.date.slice(0,10); if(days.hasOwnProperty(day)){ const product = db.products.find(p=>p.id===s.productId); const price = product?product.price:0; days[day] += price * s.qty; } });
  res.json({ totalSalesAmount, daily: days, totalSalesCount: sales.length });
});

app.get('/api/export/sales', (req, res) => {
  const db = readDB(); const sales = db.transactions.filter(t=>t.type==='sale');
  const lines = ['date,customerId,productId,qty,note'];
  sales.forEach(s=> lines.push([s.date, s.customerId||'', s.productId, s.qty, (s.note||'').replace(/,/g,'')].join(',')));
  res.setHeader('Content-Type','text/csv'); res.send(lines.join('\n'));
});

app.get('/api/health', (req, res) => res.json({ok:true}));

const PORT = process.env.PORT || 5000;
app.listen(PORT, ()=> console.log('Server running on', PORT));
