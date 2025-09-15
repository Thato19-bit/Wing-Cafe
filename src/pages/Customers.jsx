
import React, { useEffect, useState } from 'react'
export default function Customers(){
  const [list,setList]=useState([]); const [form,setForm]=useState({name:'',contact:''}); const [query,setQuery]=useState(''); const [editing,setEditing]=useState(null)
  function load(){ fetch('http://localhost:5000/api/customers').then(r=>r.json()).then(setList) }
  useEffect(()=>load(),[])
  const save = ()=>{ if(!form.name) return alert('Enter name'); if(form.id){ fetch('http://localhost:5000/api/customers/'+form.id,{method:'PUT',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}).then(()=>{setForm({name:'',contact:''});setEditing(null);load()}) } else { fetch('http://localhost:5000/api/customers',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(form)}).then(()=>{setForm({name:'',contact:''});load()}) } }
  const edit = c=>{ setEditing(c); setForm({id:c.id,name:c.name,contact:c.contact||''}) }
  const printReceipt = customerId => {
    fetch('http://localhost:5000/api/transactions').then(r=>r.json()).then(tx=>{
      const custTx = tx.filter(t=>t.customerId===customerId && t.type==='sale');
      const rows = custTx.map(t=>`<tr><td>${t.date}</td><td>${t.productId}</td><td>${t.qty}</td></tr>`).join('');
      const win = window.open('','_blank');
      win.document.write('<html><head><title>Receipt</title><style>body{font-family:Arial}table{width:100%;border-collapse:collapse}td,th{border:1px solid #ccc;padding:6px}</style></head><body>');
      win.document.write('<h3>Wings Cafe - Receipt</h3>');
      win.document.write('<table><thead><tr><th>Date</th><th>Product ID</th><th>Qty</th></tr></thead><tbody>'+rows+'</tbody></table>');
      win.document.write('</body></html>'); win.document.close(); win.print();
    })
  }
  const filtered = list.filter(c=> c.name.toLowerCase().includes(query.toLowerCase()) || (c.contact||'').includes(query))
  return (<div><h2>Customers</h2><div style={{display:'flex',gap:8,alignItems:'center'}}><input placeholder="Search customers..." value={query} onChange={e=>setQuery(e.target.value)} /><div style={{marginLeft:10}}><input placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /><input placeholder="Contact" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} /><button onClick={save}>{editing? 'Save':'Add'}</button>{editing && <button onClick={()=>{setForm({name:'',contact:''});setEditing(null)}}>Cancel</button>}</div></div><table className="table"><thead><tr><th>Name</th><th>Contact</th><th>Actions</th></tr></thead><tbody>{filtered.map(c=>(<tr key={c.id}><td>{c.name}</td><td>{c.contact}</td><td><button onClick={()=>edit(c)}>✏️ Edit</button> <button onClick={()=>printReceipt(c.id)}>🖨️ Print Receipt</button> <a target="_blank" rel="noreferrer" href={`https://wa.me/26657878877?text=${encodeURIComponent('Hello '+c.name+', this is Wings Cafe. How can we help you?')}`}>💬 WhatsApp</a></td></tr>))}</tbody></table></div>)
}
