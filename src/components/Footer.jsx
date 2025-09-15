
import React from 'react'

export default function Footer(){
  const socials = [
    {k:'twitter',u:'https://twitter.com'},
    {k:'facebook',u:'https://facebook.com'},
    {k:'instagram',u:'https://instagram.com'},
  ]
  return (
      <footer className="app-footer">
        <footer style={{marginTop:18,padding:12,display:'flex',justifyContent:'space-between',alignItems:'center',background:'#19d9dfff',color:'white',borderRadius:8}}>
          <div className="socials">
        <a href="mailto:mohlankathato@gmail.com">📧 mohlankathato@gmail.com</a> | <a href="https://wa.me/26657878877" target="_blank" rel="noreferrer">💬 +266 5787 8877</a> 
        </div>
          <div style={{display:'flex',gap:12,alignItems:'center'}}>
            <a href="https://facebook.com" target="_blank" rel="noreferrer" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:6}}><span>📘</span><span>Facebook</span></a>
            <a href="https://instagram.com" target="_blank" rel="noreferrer" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:6}}><span>📸</span><span>Instagram</span></a>
            <a href="https://x.com" target="_blank" rel="noreferrer" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:6}}><span>✖️</span><span>(Twitter)</span></a>
            <a href="https://linkedin.com" target="_blank" rel="noreferrer" style={{color:'white',textDecoration:'none',display:'flex',alignItems:'center',gap:6}}><span>🔗</span><span>LinkedIn</span></a>
            <div className="footer-left">
      
      <strong>Wings Cafe</strong>
      <p className="motto">Fresh. Fast. Friendly. Serving Basotho with heart.</p>
    
    </div>
          </div>
        </footer>


    </footer>
  )
}
