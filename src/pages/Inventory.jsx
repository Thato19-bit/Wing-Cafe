
import React, { useEffect, useState } from 'react'
export default function Inventory(){
  const [products,setProducts]=useState([]); const [tx,setTx]=useState({productId:'',qty:0,type:'add',note:''}); const [query,setQuery]=useState('')
  function load(){ fetch('http://localhost:5000/api/products').then(r=>r.json()).then(setProducts) }
  useEffect(()=>load(),[])
  const submit = ()=>{ if(!tx.productId) return alert('Select product'); fetch('http://localhost:5000/api/transactions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(tx)}).then(()=>{setTx({productId:'',qty:0,type:'add',note:''});load()}) }
  const filtered = products.filter(p=> p.name.toLowerCase().includes(query.toLowerCase()) || p.category.toLowerCase().includes(query.toLowerCase()))
  return (<div><h2>Inventory</h2><div style={{display:'flex',gap:8,alignItems:'center'}}><input placeholder="Search inventory..." value={query} onChange={e=>setQuery(e.target.value)} /><select value={tx.productId} onChange={e=>setTx({...tx,productId:e.target.value})}><option value="">-- Select product --</option>{products.map(p=> <option key={p.id} value={p.id}>{p.name} ({p.quantity})</option>)}</select><input type="number" value={tx.qty} onChange={e=>setTx({...tx,qty:Number(e.target.value)})} /><select value={tx.type} onChange={e=>setTx({...tx,type:e.target.value})}><option value="add">Add stock</option><option value="deduct">Deduct stock</option><option value="sale">Sale</option></select><input placeholder="Note" value={tx.note} onChange={e=>setTx({...tx,note:e.target.value})} /><button onClick={submit}>Apply</button></div><table className="table"><thead><tr><th>Name</th><th>Qty</th><th>Category</th></tr></thead><tbody>{filtered.map(p=> <tr key={p.id}><td>{p.name}</td><td>{p.quantity}</td><td>{p.category}</td></tr>)}</tbody></table></div>)
}
