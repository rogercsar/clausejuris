import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { FolderOpen, ChevronRight, Home, FolderPlus } from 'lucide-react'
import { listClientFolders, createClientFolder, getFolderPath, type StoredFolder } from '@/services/storageService'

type FolderSelectModalProps = {
  isOpen: boolean
  onClose: () => void
  clientId: string
  selectedFolderId?: string
  onSelect: (folderId: string | undefined) => void
}

export function FolderSelectModal({ isOpen, onClose, clientId, selectedFolderId: _selectedFolderId, onSelect }: FolderSelectModalProps) {
  const [folders, setFolders] = useState<StoredFolder[]>([])
  const [currentParentId, setCurrentParentId] = useState<string | undefined>(undefined)
  const [creating, setCreating] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const refresh = (parentId?: string) => {
    try {
      const list = listClientFolders(clientId, parentId)
      setFolders(list)
    } catch {
      setFolders([])
    }
  }

  useEffect(() => {
    if (isOpen && clientId) {
      // Inicia na raiz ao abrir
      setCurrentParentId(undefined)
      refresh(undefined)
    }
  }, [isOpen, clientId])

  const currentPath = useMemo(() => {
    if (!currentParentId) return [] as StoredFolder[]
    return getFolderPath(clientId, currentParentId)
  }, [clientId, currentParentId])

  const handleCreate = async () => {
    if (!newFolderName.trim()) return
    setSubmitting(true)
    try {
      createClientFolder(clientId, newFolderName.trim(), currentParentId)
      setNewFolderName('')
      setCreating(false)
      refresh(currentParentId)
    } finally {
      setSubmitting(false)
    }
  }

  const handleEnterFolder = (folder: StoredFolder) => {
    setCurrentParentId(folder.id)
    refresh(folder.id)
  }

  const handleSelectHere = () => {
    onSelect(currentParentId || undefined)
    onClose()
  }

  const handleSelectFolder = (folderId: string) => {
    onSelect(folderId)
    onClose()
  }

  const handleGoTo = (folderId?: string) => {
    setCurrentParentId(folderId)
    refresh(folderId)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[640px] w-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Selecionar pasta</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1 text-sm text-secondary-700">
            <button className="inline-flex items-center gap-1 hover:underline" onClick={() => handleGoTo(undefined)}>
              <Home className="w-4 h-4" /> Pasta Principal
            </button>
            {currentPath.map((f) => (
              <div key={f.id} className="flex items-center gap-1">
                <ChevronRight className="w-4 h-4 text-secondary-400" />
                <button className="hover:underline" onClick={() => handleGoTo(f.id)}>{f.name}</button>
              </div>
            ))}
          </div>

          {/* Lista de subpastas */}
          <div className="space-y-2">
            <div className="text-sm text-secondary-600">{currentParentId ? 'Subpastas' : 'Pastas na raiz'}</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center justify-between p-2 border rounded hover:bg-secondary-50">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleEnterFolder(folder)}>Abrir</Button>
                    <Button variant="primary" size="sm" onClick={() => handleSelectFolder(folder.id)}>Selecionar</Button>
                  </div>
                </div>
              ))}
              {folders.length === 0 && (
                <div className="text-sm text-secondary-500 p-2">Nenhuma pasta aqui.</div>
              )}
            </div>
          </div>

          {/* Criar nova pasta */}
          {!creating ? (
            <Button variant="outline" onClick={() => setCreating(true)}>
              <FolderPlus className="w-4 h-4 mr-2" /> Nova pasta
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Input
                placeholder="Nome da nova pasta"
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
              />
              <Button onClick={handleCreate} disabled={!newFolderName.trim() || submitting}>Criar</Button>
              <Button variant="ghost" onClick={() => { setCreating(false); setNewFolderName('') }}>Cancelar</Button>
            </div>
          )}

          {/* Ações */}
          <div className="flex justify-between gap-2">
            <Button variant="ghost" onClick={onClose}>Cancelar</Button>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => { onSelect(undefined); onClose() }}>Selecionar Pasta Principal</Button>
              <Button variant="primary" onClick={handleSelectHere}>
                {currentParentId ? 'Selecionar esta pasta' : 'Selecionar Pasta Principal'}
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}