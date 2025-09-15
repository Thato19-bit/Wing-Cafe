
import React from 'react'
import { NavLink } from 'react-router-dom'
export default function Sidebar(){
  return (
    <aside className="sidebar">
      <div>
        <h2>Wings Cafe</h2>
        <p className="sidebar-sub">Fast Food For LUCT Students</p>
        <nav>
          <NavLink to="/">🏠 Dashboard</NavLink>
          <NavLink to="/products">📦 Products</NavLink>
          <NavLink to="/inventory">📋 Inventory</NavLink>
          <NavLink to="/sales">🧾 Sales</NavLink>
          <NavLink to="/customers">👥 Customers</NavLink>
          <NavLink to="/reporting">📊 Reporting</NavLink>
          <NavLink to="/contact">☎ Contact</NavLink>
          <NavLink to="/settings">⚙ Settings</NavLink>
        </nav>
      </div>
      <div className="sidebar-footer"><small>WingsCafe by Thato Mohlanka</small></div>
    </aside>
  )
}
