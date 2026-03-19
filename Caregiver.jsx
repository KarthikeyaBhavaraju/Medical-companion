import { useState, useEffect } from 'react'
import { db } from '../firebase'
import { collection, onSnapshot } from 'firebase/firestore'

const FALLBACK_MEDS = [
  { id: '1', name: 'Metformin 500mg', time: '8:00 AM', status: 'missed' },
  { id: '2', name: 'Amlodipine 5mg', time: '8:00 AM', status: 'taken' },
  { id: '3', name: 'Aspirin 75mg', time: '1:00 PM', status: 'pending' },
  { id: '4', name: 'Atorvastatin 10mg', time: '9:00 PM', status: 'pending' },
]

export default function Caregiver({ user }) {
  const [meds, setMeds] = useState(FALLBACK_MEDS)
  const [showNewAlert, setShowNewAlert] = useState(false)
  const [newAlertMed, setNewAlertMed] = useState('')
  const [liveData, setLiveData] = useState(false)
  const prevMeds = useState(FALLBACK_MEDS)[0]

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'medications'), (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          // Check if any newly missed
          data.forEach(med => {
            const prev = prevMeds.find(m => m.id === med.id)
            if (med.status === 'missed' && prev && prev.status !== 'missed') {
              setNewAlertMed(med.name)
              setShowNewAlert(true)
              setTimeout(() => setShowNewAlert(false), 4000)
            }
          })
          setMeds(data)
          setLiveData(true)
        }
      })
      return () => unsub()
    } catch (e) {
      // Use fallback + simulate alert after 8s
      const timer = setTimeout(() => {
        setNewAlertMed('Aspirin 75mg')
        setShowNewAlert(true)
        setTimeout(() => setShowNewAlert(false), 4000)
      }, 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  const taken = meds.filter(m => m.status === 'taken').length
  const missed = meds.filter(m => m.status === 'missed').length
  const pending = meds.filter(m => m.status === 'pending').length

  return (
    <div className="page">
      {showNewAlert && (
        <div style={{ position: 'fixed', top: 20, left: '50%', transform: 'translateX(-50%)', background: 'var(--red)', color: 'white', padding: '14px 20px', borderRadius: 12, fontWeight: 600, fontSize: 14, zIndex: 999, width: '90%', maxWidth: 380, boxShadow: '0 4px 20px rgba(226,75,74,0.4)' }}>
          🚨 Ramesh missed {newAlertMed}!
        </div>
      )}

      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>Caregiver View</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Monitoring: Ramesh (Patient)</p>
        {liveData && <span className="pill pill-green" style={{ marginTop: 6, display: 'inline-block' }}>🔴 Live from Firebase</span>}
      </div>

      {/* Stats */}
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
          <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--amber)' }}>{pending}</div>
          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Pending</div>
        </div>
      </div>

      <div className="section-title">Ramesh's medications today</div>
      {meds.map((med, i) => (
        <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderLeft: `4px solid ${med.status === 'taken' ? 'var(--green)' : med.status === 'missed' ? 'var(--red)' : 'var(--amber)'}` }}>
          <div>
            <div style={{ fontWeight: 500, fontSize: 14 }}>{med.name}</div>
            <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{med.time}</div>
          </div>
          <span className={`pill ${med.status === 'taken' ? 'pill-green' : med.status === 'missed' ? 'pill-red' : 'pill-amber'}`}>
            {med.status === 'taken' ? '✓ Taken' : med.status === 'missed' ? '✗ Missed' : 'Pending'}
          </span>
        </div>
      ))}

      <div style={{ fontSize: 12, color: 'var(--text-muted)', textAlign: 'center', marginTop: 16 }}>
        🔴 Updates automatically when patient marks a dose
      </div>
    </div>
  )
}
