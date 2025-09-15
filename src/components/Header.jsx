
import React, { useEffect, useState } from 'react'
export default function Header(){
  const [theme, setTheme] = useState(localStorage.getItem('theme') || 'light')
  useEffect(()=>{ document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme) },[theme])
  return (
    <header className="header">
      <div className="header-left"><h1>Wings Cafe Inventory</h1><div className="header-sub">Manage products • inventory • sales</div></div>
      <div className="header-right">
        <label>Theme: <select value={theme} onChange={e=>setTheme(e.target.value)}><option value="light">Light</option><option value="dark">Dark</option><option value="teal">Teal</option></select></label>
      </div>
    </header>
  )
}
