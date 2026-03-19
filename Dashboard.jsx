import { useState, useEffect } from 'react'
const requestNotificationPermission = async () => {
  if ('Notification' in window) {
    await Notification.requestPermission()
  }
}

const sendReminder = (medName) => {
  if ('Notification' in window && Notification.permission === 'granted') {
    new Notification('💊 MediCompanion Reminder', {
      body: `Time to take ${medName}!`,
      icon: '/favicon.ico'
    })
    // Play beep sound
    const ctx = new AudioContext()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)
    osc.frequency.value = 880
    gain.gain.value = 0.3
    osc.start()
    osc.stop(ctx.currentTime + 0.3)
  }
}
import { db } from '../firebase'
import { collection, onSnapshot, doc, updateDoc } from 'firebase/firestore'

const FALLBACK_MEDS = [
  { id: '1', name: 'Metformin 500mg', time: '8:00 AM', purpose: 'Diabetes', status: 'pending' },
  { id: '2', name: 'Amlodipine 5mg', time: '8:00 AM', purpose: 'Blood Pressure', status: 'taken' },
  { id: '3', name: 'Aspirin 75mg', time: '1:00 PM', purpose: 'Heart', status: 'pending' },
  { id: '4', name: 'Atorvastatin 10mg', time: '9:00 PM', purpose: 'Cholesterol', status: 'pending' },
]

export default function Dashboard({ user }) {
  const [meds, setMeds] = useState(FALLBACK_MEDS)
  const [liveData, setLiveData] = useState(false)

  useEffect(() => {
    try {
      const unsub = onSnapshot(collection(db, 'medications'), (snapshot) => {
        if (!snapshot.empty) {
          const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }))
          setMeds(data)
          setLiveData(true)
        }
      })
      return () => unsub()
    } catch (e) {
      console.log('Using fallback data')
    }
  }, [])
  // Ask permission when dashboard loads
useEffect(() => {
  requestNotificationPermission()
}, [])

// Check every minute if any pending meds need reminder
useEffect(() => {
  const interval = setInterval(() => {
    const now = new Date()
    const currentHour = now.getHours()
    const currentMin = now.getMinutes()

    meds.forEach(med => {
      if (med.status !== 'pending') return

      // Parse med time e.g "8:00 AM"
      const timeStr = med.time || ''
      const match = timeStr.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!match) return

      let hour = parseInt(match[1])
      const min = parseInt(match[2])
      const period = match[3].toUpperCase()

      if (period === 'PM' && hour !== 12) hour += 12
      if (period === 'AM' && hour === 12) hour = 0

      // Fire reminder exactly at the med time
      if (currentHour === hour && currentMin === min) {
        sendReminder(med.name)
      }
    })
  }, 60000) // checks every 60 seconds

  return () => clearInterval(interval)
}, [meds])

  const markTaken = async (id) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, status: 'taken' } : m))
    try { await updateDoc(doc(db, 'medications', id), { status: 'taken' }) } catch (e) {}
  }

  const markMissed = async (id) => {
    setMeds(prev => prev.map(m => m.id === id ? { ...m, status: 'missed' } : m))
    try { await updateDoc(doc(db, 'medications', id), { status: 'missed' }) } catch (e) {}
  }

  const taken = meds.filter(m => m.status === 'taken').length
  const total = meds.length

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--text-muted)', fontSize: 14 }}>Good morning,</p>
        <h1 style={{ fontSize: 24, fontWeight: 600 }}>{user.name} 👋</h1>
        {liveData && <span className="pill pill-green" style={{ marginTop: 6, display: 'inline-block' }}>🔴 Live from Firebase</span>}
      </div>

      <div className="card" style={{ background: 'var(--green)', border: 'none', color: 'white', marginBottom: 24 }}>
        <div style={{ fontSize: 14, opacity: 0.85, marginBottom: 8 }}>Today's Progress</div>
        <div style={{ fontSize: 32, fontWeight: 600 }}>{taken} / {total}</div>
        <div style={{ fontSize: 13, opacity: 0.85, marginBottom: 12 }}>doses taken</div>
        <div style={{ background: 'rgba(255,255,255,0.3)', borderRadius: 100, height: 8 }}>
          <div style={{ height: 8, borderRadius: 100, background: 'white', width: `${total > 0 ? (taken/total)*100 : 0}%`, transition: 'width 0.4s ease' }} />
        </div>
      </div>

      <div className="section-title">Today's Medications</div>

      {meds.map(med => (
        <div key={med.id} className="card" style={{
          borderLeft: `4px solid ${med.status === 'taken' ? 'var(--green)' : med.status === 'missed' ? 'var(--red)' : 'var(--amber)'}`,
          opacity: med.status === 'taken' ? 0.7 : 1
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 15 }}>{med.name}</div>
              <div style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>{med.purpose || 'Medication'} · {med.time || 'As scheduled'}</div>
            </div>
            <span className={`pill ${med.status === 'taken' ? 'pill-green' : med.status === 'missed' ? 'pill-red' : 'pill-amber'}`}>
              {med.status === 'taken' ? '✓ Taken' : med.status === 'missed' ? '✗ Missed' : 'Pending'}
            </span>
          </div>
          {med.status !== 'taken' && med.status !== 'missed' && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
              <button className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 12px' }} onClick={() => markTaken(med.id)}>✓ Mark Taken</button>
              <button className="btn btn-danger" style={{ fontSize: 13, padding: '8px 12px' }} onClick={() => markMissed(med.id)}>✗ Missed</button>
            </div>
          )}
        </div>
      ))}

      <div className="card" style={{ background: 'var(--amber-light)', border: '1px solid var(--amber)' }}>
        <div style={{ fontWeight: 600, fontSize: 14, color: 'var(--amber)' }}>⚠ Refill Reminder</div>
        <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>Metformin running low — 3 days left</div>
      </div>
    </div>
  )
}
