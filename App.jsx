import { useState } from 'react'
import Login from './screens/Login'
import Dashboard from './screens/Dashboard'
import AIAssistant from './screens/AIAssistant'
import Caregiver from './screens/Caregiver'
import Nav from './components/Nav'

export default function App() {
  const [user, setUser] = useState(null)
  const [screen, setScreen] = useState('dashboard')

  if (!user) return <Login onLogin={setUser} />

  return (
    <div className="app-shell">
      {screen === 'dashboard' && <Dashboard user={user} />}
      {screen === 'ai' && <AIAssistant user={user} />}
      {screen === 'caregiver' && <Caregiver user={user} />}
      <Nav screen={screen} setScreen={setScreen} />
    </div>
  )
}