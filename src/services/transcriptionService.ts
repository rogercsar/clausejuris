const TRANSCRIBE_URL = import.meta.env.VITE_TRANSCRIBE_URL as string | undefined

export async function transcribeFile(file: File): Promise<string> {
  if (!TRANSCRIBE_URL) {
    throw new Error('Endpoint de transcrição não configurado (VITE_TRANSCRIBE_URL)')
  }
  const form = new FormData()
  form.append('file', file)
  const res = await fetch(TRANSCRIBE_URL, {
    method: 'POST',
    body: form,
  })
  if (!res.ok) {
    const msg = await safeText(res)
    throw new Error(`Falha na transcrição: ${res.status} ${msg}`)
  }
  const data = await res.json().catch(async () => ({ text: await res.text() })) as any
  const text = typeof data === 'string' ? data : (data?.text || '')
  if (!text) throw new Error('Resposta sem texto')
  return text
}

async function safeText(res: Response) {
  try { return await res.text() } catch { return '' }
}