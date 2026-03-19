import { useState, useEffect } from 'react'

const INITIAL_ALERTS = [
  { id: 1, patient: 'Ramesh', medicine: 'Metformin 500mg', time: '8:00 AM', status: 'missed', missedAt: '8:35 AM', read: false },
  { id: 2, patient: 'Ramesh', medicine: 'Amlodipine 5mg', time: '8:00 AM', status: 'taken', takenAt: '8:10 AM', read: true },
]

const PATIENT_MEDS = [
  { name: 'Metformin 500mg', time: '8:00 AM', status: 'missed' },
  { name: 'Amlodipine 5mg', time: '8:00 AM', status: 'taken' },
  { name: 'Aspirin 75mg', time: '1:00 PM', status: 'pending' },
  { name: 'Atorvastatin 10mg', time: '9:00 PM', status: 'pending' },
]

export default function Caregiver({ user }) {
  const [alerts, setAlerts] = useState(INITIAL_ALERTS)
  const [showNewAlert, setShowNewAlert] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setAlerts(prev => [{ id: Date.now(), patient: 'Ramesh', medicine: 'Aspirin 75mg', time: '1:00 PM', status: 'missed', missedAt: 'Just now', read: false }, ...prev])
      setShowNewAlert(true)
      setTimeout(() => setShowNewAlert(false), 4000)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  const markRead = (id) => setAlerts(prev => prev.map(a => a.id === id ? { ...a, read: true } : a))
  const unread = alerts.filter(a => !a.read).length
  const taken = PATIENT_MEDS.filter(m => m.status === 'taken').length
  const missed = PATIENT_MEDS.filter(m => m.status === 'missed').length

  return (
    <div className="page">
      {showNewAlert && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 999, width: '90%', maxWidth: 380, boxShadow: '0 4px 20px rgba(226,75,74,0.4)' }}>
          🚨 Ramesh missed Aspirin 75mg (1:00 PM)
        </div>
      )}
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Caregiver View</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Monitoring: Ramesh (Patient)</p>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 24 }}>
        <div className="card" style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--green)' }}>{taken}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Taken</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--red)' }}>{missed}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Missed</div>
        </div>
        <div className="card" style={{ textAlign: 'center', padding: '12px 8px' }}>
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)' }}>{unread}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Alerts</div>
        </div>
      </div>
      <div className="section-title">Ramesh's medications today</div>
      {PATIENT_MEDS.map((med, i) => (
        <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{med.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{med.time}</div>
          </div>
          <span className={`pill ${med.status === 'taken' ? 'pill-green' : med.status === 'missed' ? 'pill-red' : 'pill-gray'}`}>
            {med.status === 'taken' ? '✓ Taken' : med.status === 'missed' ? '✗ Missed' : 'Pending'}
          </span>
        </div>
      ))}
      <div className="section-title" style={{ marginTop: 24 }}>
        Alerts {unread > 0 && <span className="pill pill-red" style={{ marginLeft: 8, fontSize: 11 }}>{unread} new</span>}
      </div>
      {alerts.map(alert => (
        <div key={alert.id} className="card" style={{ borderLeft: `4px solid ${alert.status === 'missed' ? 'var(--red)' : 'var(--green)'}`, opacity: alert.read ? 0.6 : 1, background: alert.read ? 'white' : alert.status === 'missed' ? 'var(--red-light)' : 'var(--green-light)' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{alert.status === 'missed' ? '🚨' : '✅'} {alert.medicine}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                {alert.status === 'missed' ? `Missed at ${alert.missedAt} (due ${alert.time})` : `Taken at ${alert.takenAt}`}
              </div>
            </div>
            {!alert.read && <button onClick={() => markRead(alert.id)} style={{ fontSize: 11, padding: '4px 10px', borderRadius: 20, border: 'none', background: 'white', cursor: 'pointer', color: 'var(--text-muted)' }}>Dismiss</button>}
          </div>
        </div>
      ))}
      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
        🔴 Live — updates automatically when dose is missed
      </div>
    </div>
  )
}