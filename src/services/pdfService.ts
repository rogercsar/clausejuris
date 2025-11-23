const PDF_READ_URL = import.meta.env.VITE_PDF_READ_URL as string | undefined

export async function readPdfFile(file: File): Promise<string> {
  if (!PDF_READ_URL) throw new Error('Endpoint de leitura de PDF não configurado (VITE_PDF_READ_URL)')
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(PDF_READ_URL, { method: 'POST', body: form })
  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`Falha na leitura do PDF: ${res.status} ${msg}`)
  }
  const data = await res.json().catch(async () => ({ text: await res.text() })) as any
  const text = typeof data === 'string' ? data : (data?.text || '')
  if (!text) throw new Error('Resposta sem texto')
  return text
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return '' }
}