import { useState } from 'react'

const USERS = [
  { name: 'Ramesh', role: 'patient', pin: '1234' },
  { name: 'Priya', role: 'caregiver', pin: '5678' },
]

export default function Login({ onLogin, darkMode, setDarkMode }) {
  const [name, setName] = useState('')
  const [pin, setPin] = useState('')
  const [error, setError] = useState('')

  const handleLogin = () => {
    const found = USERS.find(u => u.name.toLowerCase() === name.toLowerCase() && u.pin === pin)
    if (found) { onLogin(found); setError('') }
    else setError('Name or PIN is incorrect. Try: Ramesh / 1234')
  }

  return (
    <div className="app-shell" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh' }}>

      {/* Theme toggle top right */}
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      <div style={{ padding: '32px 24px', width: '100%' }}>

        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 40 }}>
          <div style={{
            width: 64, height: 64, borderRadius: 18,
            background: 'var(--green)', display: 'flex',
            alignItems: 'center', justifyContent: 'center',
            margin: '0 auto 16px', fontSize: 28
          }}>💊</div>
          <h1 style={{ fontSize: 24, fontWeight: 600, color: 'var(--text)' }}>MediCompanion</h1>
          <p style={{ color: 'var(--text-muted)', marginTop: 6, fontSize: 14 }}>Your trusted medication partner</p>
        </div>

        {/* Form */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          <div>
            <div className="label">Your Name</div>
            <input className="input" placeholder="e.g. Ramesh" value={name} onChange={e => setName(e.target.value)} />
          </div>
          <div>
            <div className="label">PIN</div>
            <input className="input" type="password" placeholder="4-digit PIN" maxLength={4} value={pin}
              onChange={e => setPin(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleLogin()} />
          </div>

          {error && (
            <div style={{ background: 'var(--red-light)', color: 'var(--red)', padding: '10px 14px', borderRadius: 8, fontSize: 13 }}>
              {error}
            </div>
          )}

          <button className="btn btn-primary" onClick={handleLogin} style={{ marginTop: 8 }}>
            Sign In
          </button>
        </div>

        {/* Demo hint */}
        <div style={{ marginTop: 24, padding: '12px 14px', background: 'var(--green-light)', borderRadius: 10 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--green-dark)', marginBottom: 4 }}>Demo accounts</div>
          <div style={{ fontSize: 12, color: 'var(--green-dark)' }}>Patient → Ramesh / 1234</div>
          <div style={{ fontSize: 12, color: 'var(--green-dark)' }}>Caregiver → Priya / 5678</div>
        </div>

      </div>
    </div>
  )
}
