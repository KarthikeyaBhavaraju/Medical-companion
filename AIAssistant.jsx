import { useState } from 'react'

const ANTHROPIC_API_KEY = 'sk-ant-api03---'

export default function AIAssistant({ user }) {
  const [medicines, setMedicines] = useState('Metformin 500mg, Amlodipine 5mg, Aspirin 75mg')
  const [conditions, setConditions] = useState('Diabetes, Hypertension')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)
  const [approved, setApproved] = useState(false)
  const [error, setError] = useState('')

  const getSchedule = async () => {
    setLoading(true); setResult(null); setApproved(false); setError('')

    try {
      const response = await fetch('/anthropic/v1/messages', {
        method: 'POST',
        headers: {
          headers: {
  'Content-Type': 'application/json',
  'x-api-key': ANTHROPIC_API_KEY,
  'anthropic-version': '2023-06-01',
},
          
        },
        body: JSON.stringify({
          model: 'claude-haiku-4-5-20251001',
          max_tokens: 1000,
          system: `You are a medication safety assistant for elderly patients.
Given a list of medicines and conditions, create a safe daily schedule.
Flag any interactions. NEVER diagnose. Always show reasoning.
Return ONLY valid JSON in this exact format, no extra text:
{
  "schedule": [
    {"medicine": "name", "time": "8:00 AM", "instruction": "take with food"}
  ],
  "warnings": [
    {"medicines_involved": ["med1", "med2"], "severity": "caution", "reason": "reason here", "action": "what to do"}
  ],
  "reasoning": "brief explanation of the schedule"
}`,
          messages: [{
            role: 'user',
            content: `Medicines: ${medicines}\nConditions: ${conditions}\n\nCreate a safe medication schedule.`
          }]
        })
      })

      const data = await response.json()
      const text = data.content[0].text
      const clean = text.replace(/```json|```/g, '').trim()
      const parsed = JSON.parse(clean)
      setResult(parsed)

    } catch (err) {
      setError('Could not connect to AI. Showing demo response instead.')
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
    }

    setLoading(false)
  }

  const severityColor = (s) => s === 'danger' ? 'var(--red)' : s === 'caution' ? 'var(--amber)' : 'var(--green)'
  const severityBg = (s) => s === 'danger' ? 'var(--red-light)' : s === 'caution' ? 'var(--amber-light)' : 'var(--green-light)'

  return (
    <div className="page">
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 22, fontWeight: 600 }}>AI Schedule Builder</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 4 }}>Real AI powered by Claude</p>
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
          {loading ? '⏳ Claude is thinking...' : '✨ Generate with Claude AI'}
        </button>
      </div>

      {error && (
        <div style={{ background: 'var(--amber-light)', color: '#854F0B', padding: '10px 14px', borderRadius: 8, fontSize: 13, marginBottom: 12 }}>
          {error}
        </div>
      )}

      {result && !approved && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span style={{ fontSize: 16 }}>🤖</span>
            <span style={{ fontWeight: 600 }}>Claude's Suggested Schedule</span>
            <span className="pill pill-amber" style={{ marginLeft: 'auto' }}>Pending approval</span>
          </div>

          <div className="label">Suggested timing</div>
          {result.schedule?.map((item, i) => (
            <div key={i} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{item.medicine}</div>
                <div style={{ color: 'var(--text-muted)', fontSize: 12, marginTop: 2 }}>{item.instruction}</div>
              </div>
              <span className="pill pill-gray">{item.time}</span>
            </div>
          ))}

          {result.warnings?.length > 0 && (
            <>
              <div className="label" style={{ marginTop: 16 }}>Interaction check</div>
              {result.warnings.map((w, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, marginBottom: 8, background: severityBg(w.severity), borderLeft: `4px solid ${severityColor(w.severity)}` }}>
                  <div style={{ fontWeight: 600, fontSize: 13, color: severityColor(w.severity) }}>
                    {w.severity === 'danger' ? '⛔ DANGER' : w.severity === 'caution' ? '⚠️ CAUTION' : 'ℹ️ INFO'} — {w.medicines_involved?.join(' + ')}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 4 }}>{w.reason}</div>
                  <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>{w.action}</div>
                </div>
              ))}
            </>
          )}

          <div style={{ padding: '12px 14px', background: '#f9fafb', borderRadius: 10, marginBottom: 12 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-muted)', marginBottom: 4 }}>Claude's Reasoning</div>
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
          <div style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 6 }}>Approved and saved successfully.</div>
          <button className="btn btn-secondary" style={{ marginTop: 20 }} onClick={() => { setResult(null); setApproved(false) }}>
            Build another schedule
          </button>
        </div>
      )}
    </div>
  )
}
