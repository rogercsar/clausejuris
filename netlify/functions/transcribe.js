// Netlify Function: Transcribe audio using Deepgram Listen API
// Requires env var DEEPGRAM_API_KEY configured in Netlify site settings

export async function handler(event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'method not allowed' }
  }
  if (!process.env.DEEPGRAM_API_KEY) {
    return { statusCode: 500, body: 'missing DEEPGRAM_API_KEY' }
  }
  if (!event.body) {
    return { statusCode: 400, body: 'no body' }
  }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || ''
  const boundary = contentType.split('boundary=')[1]
  if (!boundary) {
    return { statusCode: 400, body: 'no boundary' }
  }

  const isBase64 = event.isBase64Encoded
  const bodyBuf = Buffer.from(event.body, isBase64 ? 'base64' : 'utf8')
  const raw = bodyBuf.toString('binary')
  const parts = raw.split(`--${boundary}`)
  const filePart = parts.find(p => p.includes('name="file"'))
  if (!filePart) {
    return { statusCode: 400, body: 'file not found' }
  }

  // Try to detect content-type from the part headers
  let detectedContentType = 'application/octet-stream'
  const headerMatch = filePart.match(/Content-Type:\s([^\r\n]+)/)
  if (headerMatch && headerMatch[1]) {
    detectedContentType = headerMatch[1].trim()
  }

  const fileStart = filePart.indexOf('\r\n\r\n') + 4
  const fileEnd = filePart.lastIndexOf('\r\n')
  const fileBuffer = Buffer.from(filePart.slice(fileStart, fileEnd), 'binary')

  try {
    const url = `https://api.deepgram.com/v1/listen?model=nova-2&language=pt-BR&smart_format=true`
    const resp = await fetch(url, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.DEEPGRAM_API_KEY}`,
        'Content-Type': detectedContentType,
        'Accept': 'application/json'
      },
      body: fileBuffer
    })
    const text = await resp.text()
    if (!resp.ok) {
      return { statusCode: resp.status, body: text }
    }
    let data
    try { data = JSON.parse(text) } catch { data = {} }
    // Extract transcript from Deepgram response
    const alt = (((data || {}).results || {}).channels || [])[0]?.alternatives?.[0]
    const transcript = alt?.transcript || ''
    return { statusCode: 200, body: JSON.stringify({ text: transcript }) }
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message || e) }
  }
}