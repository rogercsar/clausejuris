import { useEffect, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { listClientFolders, createClientFolder, type StoredFolder } from '@/services/storageService'

type FolderSelectModalProps = {
  isOpen: boolean
  onClose: () => void
  clientId: string
  selectedFolderId?: string
  onSelect: (folderId: string | undefined) => void
}

export function FolderSelectModal({ isOpen, onClose, clientId, selectedFolderId, onSelect }: FolderSelectModalProps) {
  const [folders, setFolders] = useState<StoredFolder[]>([])
  const [currentSelection, setCurrentSelection] = useState<string | ''>(selectedFolderId || '')
  const [creating, setCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const refresh = () => {
    try {
      const root = listClientFolders(clientId)
      setFolders(root)
    } catch {
      setFolders([])
    }
  }

  useEffect(() => {
    if (isOpen && clientId) {
      setCurrentSelection(selectedFolderId || '')
      refresh()
    }
  }, [isOpen, clientId, selectedFolderId])

  const handleCreate = async () => {
    if (!newFolderName.trim()) return
    setSubmitting(true)
    try {
      createClientFolder(clientId, newFolderName.trim())
      setNewFolderName('')
      setCreating(false)
      refresh()
    } finally {
      setSubmitting(false)
    }
  }

  const handleConfirm = () => {
    onSelect(currentSelection || undefined)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[600px] w-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar pasta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="radio"
                name="folder"
                checked={currentSelection === ''}
                onChange={() => setCurrentSelection('')}
              />
              Pasta principal
            </label>
            {folders.map((f) => (
              <label key={f.id} className="flex items-center gap-2 text-sm">
                <input
                  type="radio"
                  name="folder"
                  checked={currentSelection === f.id}
                  onChange={() => setCurrentSelection(f.id)}
                />
                {f.name}
              </label>
            ))}
          </div>

          {!creating ? (
            <Button variant="outline" onClick={() => setCreating(true)}>Criar nova pasta</Button>
          ) : (
            <div className="flex gap-2">
              <Input
                placeholder="Nome da pasta"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button onClick={handleCreate} disabled={!newFolderName.trim() || submitting}>Criar</Button>
              <Button variant="ghost" onClick={() => { setCreating(false); setNewFolderName('') }}>Cancelar</Button>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-secondary-200 flex items-center justify-end gap-2">
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button onClick={handleConfirm}>Selecionar</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}


