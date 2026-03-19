import { useState, useEffect } from 'react'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import AIAssistant from './screens/AIAssistant'
import Caregiver from './screens/Caregiver'
import Nav from './components/Nav'

export default function App() {
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState('dashboard')
  const [darkMode, setDarkMode] = useState(false)

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light')
  }, [darkMode])

  if (!user) return <Login onLogin={setUser} darkMode={darkMode} setDarkMode={setDarkMode} />

  return (
    <div className="app-shell">
      <button
        className="theme-toggle"
        onClick={() => setDarkMode(!darkMode)}
        style={{ position: 'fixed', top: 16, right: 16, zIndex: 200 }}
      >
        {darkMode ? '☀️ Light' : '🌙 Dark'}
      </button>

      {screen === 'dashboard' && <Dashboard user={user} />}
      {screen === 'ai' && <AIAssistant user={user} />}
      {screen === 'caregiver' && <Caregiver user={user} />}
      <Nav screen={screen} setScreen={setScreen} />
    </div>
  )
}
