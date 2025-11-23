export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'method not allowed' }
  if (!process.env.GEMINI_API_KEY) return { statusCode: 500, body: 'missing GEMINI_API_KEY' }
  let payload
  try { payload = JSON.parse(event.body || '{}') } catch { payload = {} }
  const { text = '', context = '', topics = [], history = '' } = payload
  const prompt = buildPrompt({ text, context, topics, history })
  try {
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY
    const r = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ contents: [{ parts: [{ text: prompt }]}] })
    })
    const j = await r.json()
    if (!r.ok) return { statusCode: r.status, body: JSON.stringify(j) }
    const t = j?.candidates?.[0]?.content?.parts?.[0]?.text || ''
    const parsed = safeJson(t)
    const suggestions = Array.isArray(parsed?.suggestions) ? parsed.suggestions : []
    const draft = typeof parsed?.draft === 'string' ? parsed.draft : ''
    return { statusCode: 200, body: JSON.stringify({ suggestions, draft }) }
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message || e) }
  }
}

function buildPrompt({ text, context, topics, history }) {
  const tp = Array.isArray(topics) ? topics.join(', ') : ''
  const base = (text || '').slice(-1200)
  return [
    'Você é um assistente jurídico. Gere sugestões e um rascunho sucinto.',
    'Responda em JSON no formato:',
    '{"suggestions":[{"id":"s1","type":"snippet|autocomplete|correction","text":"...","replacement":"...","description":"...","confidence":0.8}],"draft":"..."}',
    'Histórico recente da banca (resumo):', (history || '').slice(0, 2000),
    'Contexto:', base,
    'Tipo:', context,
    'Tópicos:', tp
  ].join('\n')
}

function safeJson(s) {
  try { return JSON.parse(s) } catch { return {} }
}