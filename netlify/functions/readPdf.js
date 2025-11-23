export async function handler(event) {
  if (event.httpMethod !== 'POST') return { statusCode: 405, body: 'method not allowed' }
  if (!event.body) return { statusCode: 400, body: 'no body' }

  const contentType = event.headers['content-type'] || event.headers['Content-Type'] || ''
  const boundary = contentType.split('boundary=')[1]
  if (!boundary) return { statusCode: 400, body: 'no boundary' }

  try {
    const isBase64 = event.isBase64Encoded
    const bodyBuf = Buffer.from(event.body, isBase64 ? 'base64' : 'utf8')
    const raw = bodyBuf.toString('binary')
    const parts = raw.split(`--${boundary}`)
    const filePart = parts.find(p => p.includes('name="file"'))
    if (!filePart) return { statusCode: 400, body: 'file not found' }

    const fileStart = filePart.indexOf('\r\n\r\n') + 4
    const fileEnd = filePart.lastIndexOf('\r\n')
    const fileBuffer = Buffer.from(filePart.slice(fileStart, fileEnd), 'binary')

    const pdfParse = await import('pdf-parse')
    const result = await pdfParse.default(fileBuffer)
    const text = (result && result.text) ? result.text : ''
    return { statusCode: 200, body: JSON.stringify({ text }) }
  } catch (e) {
    return { statusCode: 500, body: String(e && e.message || e) }
  }
}