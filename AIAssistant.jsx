import { useState } from 'react'

export default function AIAssistant({ user }) {
  const [medicines, setMedicines] = useState('Metformin 500mg, Amlodipine 5mg, Aspirin 75mg')
  const [conditions, setConditions] = useState('Diabetes, Hypertension')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [approved, setApproved] = useState(false)

  const getSchedule = async () => {
    setLoading(true); setResult(null); setApproved(false)
    await new Promise(r => setTimeout(r, 1500))
    setResult({
      schedule: [
        { medicine: 'Metformin 500mg', time: '8:00 AM', instruction: 'Take with breakfast' },
        { medicine: 'Amlodipine 5mg', time: '8:00 AM', instruction: 'Take with water' },
        { medicine: 'Aspirin 75mg', time: '1:00 PM', instruction: 'Take after lunch' },
      ],
      warnings: [
        { medicines_involved: ['Aspirin', 'Amlodipine'], severity: 'caution', reason: 'May slightly affect blood pressure control.', action: 'Monitor BP regularly.' }
      ],
      reasoning: 'Medications spaced to avoid interactions. Metformin and Amlodipine are safe together in the morning.'
    })
    setLoading(false)
  }

  const severityColor = (s) => s === 'danger' ? 'var(--red)' : s === 'caution' ? 'var(--amber)' : 'var(--green)'
  const severityBg = (s) => s === 'danger' ? 'var(--red-light)' : s === 'caution' ? 'var(--amber-light)' : 'var(--green-light)'

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>AI Schedule Builder</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Tell us your medicines and we'll build a safe schedule</p>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, marginBottom: 20 }}>
        <div>
          <div className="label">Medicines (comma separated)</div>
          <textarea className="input" value={medicines} onChange={e => setMedicines(e.target.value)} />
        </div>
        <div>
          <div className="label">Conditions</div>
          <input className="input" value={conditions} onChange={e => setConditions(e.target.value)} />
        </div>
        <button className="btn btn-primary" onClick={getSchedule} disabled={loading}>
          {loading ? '⏳ AI is building your schedule...' : '✨ Generate Schedule'}
        </button>
      </div>

      {result && !approved && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontWeight: 600 }}>AI Suggested Schedule</span>
            <span className="pill pill-amber" style={{ marginLeft: 'auto' }}>Pending approval</span>
          </div>
          <div className="label">Suggested timing</div>
          {result.schedule.map((item, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.medicine}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{item.instruction}</div>
              </div>
              <span className="pill pill-gray">{item.time}</span>
            </div>
          ))}
          <div className="label" style={{ marginTop: 16 }}>Interaction check</div>
          {result.warnings.map((w, i) => (
            <div key={i} style={{ padding: '12px 14px', borderRadius: 10, marginBottom: 8, background: severityBg(w.severity), borderLeft: `4px solid ${severityColor(w.severity)}` }}>
              <div style={{ fontWeight: 600, fontSize: 13, color: severityColor(w.severity) }}>
                ⚠️ CAUTION — {w.medicines_involved.join(' + ')}
              </div>
              <div style={{ fontSize: 13, marginTop: 4 }}>{w.reason}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{w.action}</div>
            </div>
          ))}
          <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>AI Reasoning</div>
            <div style={{ fontSize: 13 }}>{result.reasoning}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--text-muted)', padding: '10px 14px', background: '#f9fafb', borderRadius: 8, marginBottom: 16 }}>
            ⚠️ AI-assisted only. Always consult your doctor or pharmacist.
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <button className="btn btn-outline" onClick={() => setResult(null)} style={{ flex: 1, fontSize: 14 }}>✏️ Edit</button>
            <button className="btn btn-primary" onClick={() => setApproved(true)} style={{ flex: 2, fontSize: 14 }}>✅ Approve & Save</button>
          </div>
        </div>
      )}

      {approved && (
        <div style={{ textAlign: 'center', padding: '32px 0' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>✅</div>
          <div style={{ fontWeight: 600, fontSize: 18 }}>Schedule Saved!</div>
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Your schedule has been approved and saved.</div>
          <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => { setResult(null); setApproved(false) }}>Build another schedule</button>
        </div>
      )}
    </div>
  )
}