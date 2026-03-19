import { useState } from 'react'

const INITIAL_MEDS = [
  { id: 1, name: 'Metformin 500mg', time: '8:00 AM', purpose: 'Diabetes', status: 'pending' },
  { id: 2, name: 'Amlodipine 5mg', time: '8:00 AM', purpose: 'Blood Pressure', status: 'taken' },
  { id: 3, name: 'Aspirin 75mg', time: '1:00 PM', purpose: 'Heart', status: 'pending' },
  { id: 4, name: 'Atorvastatin 10mg', time: '9:00 PM', purpose: 'Cholesterol', status: 'pending' },
]

export default function Dashboard({ user }) {
  const [meds, setMeds] = useState(INITIAL_MEDS)

  const markTaken = (id) => setMeds(prev => prev.map(m => m.id === id ? { ...m, status: 'taken' } : m))
  const markMissed = (id) => setMeds(prev => prev.map(m => m.id === id ? { ...m, status: 'missed' } : m))

  const taken = meds.filter(m => m.status === 'taken').length
  const total = meds.length

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Good morning,</p>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>{user.name} 👋</h1>
      </div>
      <div className="card" style={{ background: 'var(--green)', border: 'none', color: 'white', marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Today's Progress</div>
        <div style={{ fontSize: 32, fontWeight: 600 }}>{taken} / {total}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>doses taken</div>
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 100, height: 8 }}>
          <div style={{ height: 8, borderRadius: 100, background: 'white', width: `${(taken / total) * 100}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>
      <div className="section-title">Today's Medications</div>
      {meds.map(med => (
        <div key={med.id} className="card" style={{ borderLeft: `4px solid ${med.status === 'taken' ? 'var(--green)' : med.status === 'missed' ? 'var(--red)' : 'var(--amber)'}`, opacity: med.status === 'taken' ? 0.7 : 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{med.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{med.purpose} · {med.time}</div>
            </div>
            <span className={`pill ${med.status === 'taken' ? 'pill-green' : med.status === 'missed' ? 'pill-red' : 'pill-amber'}`}>
              {med.status === 'taken' ? '✓ Taken' : med.status === 'missed' ? '✗ Missed' : 'Pending'}
            </span>
          </div>
          {med.status === 'pending' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 12px' }} onClick={() => markTaken(med.id)}>✓ Mark Taken</button>
              <button className="btn btn-danger" style={{ fontSize: 13, padding: '8px 12px' }} onClick={() => markMissed(med.id)}>✗ Missed</button>
            </div>
          )}
        </div>
      ))}
      <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid #FAC775' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: '#854F0B' }}>⚠ Refill Reminder</div>
        <div style={{ fontSize: 13, color: '#854F0B', marginTop: 4 }}>Metformin running low — 3 days left</div>
      </div>
    </div>
  )
}