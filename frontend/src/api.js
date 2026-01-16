const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export async function analyze(payload) {
  const res = await fetch(`${API_BASE}/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || 'API error')
  }
  return res.json()
}
