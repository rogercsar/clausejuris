import { useState } from 'react'
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

  const handleUpload = async () => {
    if (!file) return
    setIsLoading(true)
    // Mock transcription latency
    await new Promise(r => setTimeout(r, 1200))
    // Mock transcription content
    const transcript = `Transcrição simulada de "${file.name}" em ${new Date().toLocaleString('pt-BR')}\n\n[Conteúdo da audiência transcrito aqui...]`
    onTranscribed(transcript)
    setIsLoading(false)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[720px] w-full p-6 sm:p-8 rounded-xl">
        <DialogHeader>
          <DialogTitle className="text-xl">Transcrever áudio/vídeo</DialogTitle>
          <DialogDescription>
            Envie um arquivo de áudio ou vídeo de audiência para gerar a transcrição (simulado)
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




