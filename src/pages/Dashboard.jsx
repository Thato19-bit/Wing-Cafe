
import React, { useEffect, useState } from 'react'
export default function Dashboard(){
  const [stats,setStats]=useState({products:0,low:0,customers:0,salesAmount:0,daily:{}})
  useEffect(()=>{
    Promise.all([fetch('http://localhost:5000/api/products').then(r=>r.json()), fetch('http://localhost:5000/api/customers').then(r=>r.json()), fetch('http://localhost:5000/api/sales-summary').then(r=>r.json())]).then(([p,c,s])=>{
      setStats({products:p.length, low:p.filter(x=>x.quantity<=5).length, customers:c.length, salesAmount:s.totalSalesAmount||0, daily:s.daily||{}})
    })
  },[])
  const motives=['Provide fresh, affordable food and coffee','Support local producers and suppliers','Create a welcoming space for the community']
  const renderChart = ()=>{ const days=Object.keys(stats.daily); if(days.length===0) return <div style={{height:40}}>No data</div>; const vals=days.map(d=>stats.daily[d]); const max=Math.max(...vals,1); return <svg width="260" height="60" viewBox="0 0 260 60" preserveAspectRatio="none">{vals.map((v,i)=>{const x=(i*(260/days.length))+6; const h=(v/max)*48; const y=60-h-6; return <rect key={i} x={x} y={y} width={(260/days.length)-8} height={h} rx="3" ry="3" />})}</svg> }
  return (
    <div>
      <h2>Dashboard</h2>
      <div className="cards">
        <div className="card card-strong"><h3>📦 Total Products</h3><p className="big">{stats.products}</p><small>Inventory across categories</small></div>
        <div className="card card-alert"><h3>⚠️ Low Stock</h3><p className="big">{stats.low}</p><small>Products needing restock</small></div>
        <div className="card card-info"><h3>👥 Customers</h3><p className="big">{stats.customers}</p><small>Registered customers</small></div>
        <div className="card card-money"><h3>💰 Sales (total)</h3><p className="big">{stats.salesAmount.toFixed(2)}</p><small>Revenue from recorded sales</small></div>
      </div>
      <div className="dashboard-bottom" style={{display:'flex',gap:12,marginTop:12}}>
        <div style={{flex:1}}><h4>Last 7 days  sales</h4>{renderChart()}</div>
        <div style={{flex:1}}><h4>Wings Cafe Motives</h4><ul>{motives.map((m,i)=><li key={i}>• {m}</li>)}</ul></div>
      </div>
    </div>
  )
}
