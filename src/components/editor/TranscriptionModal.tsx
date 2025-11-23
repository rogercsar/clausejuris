import { useState, useRef } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Upload, Mic, Video } from 'lucide-react'

interface TranscriptionModalProps {
  isOpen: boolean
  onClose: () => void
  onTranscribed: (text: string) => void
}

export function TranscriptionModal({ isOpen, onClose, onTranscribed }: TranscriptionModalProps) {
  const [file, setFile] = useState<File | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [liveTranscript, setLiveTranscript] = useState('')
  const recognitionRef = useRef<any>(null)
  const HAS_TRANSCRIBE = Boolean(import.meta.env.VITE_TRANSCRIBE_URL)

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    try {
      const text = await transcribeFile(file)
      onTranscribed(text)
    } catch (e: any) {
      const transcript = `Transcrição simulada de "${file.name}" em ${new Date().toLocaleString('pt-BR')}\n\n[${e?.message || 'Falha na transcrição'}]`
      onTranscribed(transcript)
    } finally {
      setIsLoading(false)
      onClose()
    }
  }

  const initRecognition = () => {
    const SR: any = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition
    if (!SR) return null
    const rec = new SR()
    rec.lang = 'pt-BR'
    rec.interimResults = true
    rec.continuous = true
    rec.onresult = (event: any) => {
      let text = ''
      for (let i = 0; i < event.results.length; i++) {
        text += event.results[i][0].transcript
        text += ' '
      }
      setLiveTranscript(text.trim())
    }
    rec.onerror = () => {
      setIsRecording(false)
    }
    recognitionRef.current = rec
    return rec
  }

  const startRecording = () => {
    if (isRecording) return
    const rec = recognitionRef.current || initRecognition()
    if (!rec) {
      alert('Seu navegador não suporta reconhecimento de voz. Tente o Chrome no desktop.')
      return
    }
    setLiveTranscript('')
    try {
      rec.start()
      setIsRecording(true)
    } catch {
      setIsRecording(false)
    }
  }

  const stopRecording = () => {
    if (!recognitionRef.current) return
    try {
      recognitionRef.current.stop()
    } finally {
      setIsRecording(false)
      if (liveTranscript.trim().length > 0) {
        onTranscribed(liveTranscript.trim())
      }
      setLiveTranscript('')
      onClose()
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] w-full p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Transcrever áudio/vídeo</DialogTitle>
          <DialogDescription>
            {HAS_TRANSCRIBE
              ? 'Envie um arquivo de áudio ou vídeo de audiência para gerar a transcrição'
              : 'Envie um arquivo de áudio ou vídeo de audiência para gerar a transcrição (simulado)'}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="p-4 sm:p-5 border border-secondary-200 rounded-lg bg-secondary-50">
            <div className="flex items-center gap-2 text-secondary-700 text-sm">
              <Mic className="w-4 h-4" /> <span>/</span> <Video className="w-4 h-4" />
              <span>Formatos comuns: mp3, wav, mp4, m4a</span>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Gravação por microfone</label>
            <div className="flex items-center gap-3">
              <Button variant={isRecording ? 'secondary' : 'outline'} onClick={isRecording ? stopRecording : startRecording}>
                <Mic className="w-4 h-4 mr-2" />
                {isRecording ? 'Parar' : 'Gravar e transcrever'}
              </Button>
              {isRecording && <span className="text-xs text-secondary-600">Gravando...</span>}
            </div>
            {liveTranscript && (
              <div className="mt-2 p-3 border border-secondary-200 rounded-md bg-white text-sm whitespace-pre-wrap">{liveTranscript}</div>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-secondary-700">Arquivo</label>
            <Input 
              type="file" 
              accept="audio/*,video/*" 
              onChange={(e) => setFile(e.target.files?.[0] || null)} 
              className="h-11"
            />
          </div>

          <div className="flex items-center justify-end gap-3 pt-2">
            <Button variant="outline" onClick={onClose}>Cancelar</Button>
            <Button onClick={handleUpload} isLoading={isLoading} disabled={!file}> 
              <Upload className="w-4 h-4 mr-2" />
              Transcrever
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}



import { transcribeFile } from '@/services/transcriptionService'




