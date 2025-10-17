import { useEffect, useMemo, useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/Dialog'
import { Button } from '@/components/ui/Button'
import { Home, ChevronRight, FolderOpen, FileText } from 'lucide-react'
import { listClientFolders, listClientFiles, getFolderPath, type StoredFolder, type StoredFile } from '@/services/storageService'

type ClientFileOpenModalProps = {
  isOpen: boolean
  onClose: () => void
  clientId: string
  initialFolderId?: string
  onOpen: (file: StoredFile) => void
}

export function ClientFileOpenModal({ isOpen, onClose, clientId, initialFolderId, onOpen }: ClientFileOpenModalProps) {
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [folders, setFolders] = useState<StoredFolder[]>([])
  const [files, setFiles] = useState<StoredFile[]>([])

  const refresh = (folderId?: string) => {
    try {
      const subfolders = listClientFolders(clientId, folderId)
      const folderFiles = listClientFiles(clientId, folderId)
      setFolders(subfolders)
      setFiles(folderFiles)
    } catch {
      setFolders([])
      setFiles([])
    }
  }

  useEffect(() => {
    if (isOpen && clientId) {
      const startFolder = initialFolderId || undefined
      setCurrentFolderId(startFolder)
      refresh(startFolder)
    }
  }, [isOpen, clientId, initialFolderId])

  const currentPath = useMemo(() => {
    if (!currentFolderId) return [] as StoredFolder[]
    return getFolderPath(clientId, currentFolderId)
  }, [clientId, currentFolderId])

  const handleOpenFile = (file: StoredFile) => {
    onOpen(file)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-[720px] w-full overflow-y-auto overflow-x-hidden">
        <DialogHeader>
          <DialogTitle>Abrir documento salvo</DialogTitle>
        </DialogHeader>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 text-sm text-secondary-700 mb-3">
          <button className="inline-flex items-center gap-1 hover:underline" onClick={() => { setCurrentFolderId(undefined); refresh(undefined) }}>
            <Home className="w-4 h-4" /> Pasta Principal
          </button>
          {currentPath.map((f) => (
            <div key={f.id} className="flex items-center gap-1">
              <ChevronRight className="w-4 h-4 text-secondary-400" />
              <button className="hover:underline" onClick={() => { setCurrentFolderId(f.id); refresh(f.id) }}>{f.name}</button>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pastas */}
          <div className="border rounded p-3">
            <div className="text-sm font-medium mb-2">{currentFolderId ? 'Subpastas' : 'Pastas na raiz'}</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {folders.map((folder) => (
                <div key={folder.id} className="flex items-center justify-between p-2 border rounded hover:bg-secondary-50">
                  <div className="flex items-center gap-2">
                    <FolderOpen className="w-4 h-4 text-blue-600" />
                    <span className="font-medium">{folder.name}</span>
                  </div>
                  <Button size="sm" variant="outline" onClick={() => { setCurrentFolderId(folder.id); refresh(folder.id) }}>Abrir</Button>
                </div>
              ))}
              {folders.length === 0 && (
                <div className="text-sm text-secondary-500 p-2">Nenhuma pasta.</div>
              )}
            </div>
          </div>

          {/* Arquivos */}
          <div className="border rounded p-3">
            <div className="text-sm font-medium mb-2">Arquivos</div>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {files.map((file) => (
                <div key={file.id} className="flex items-center justify-between p-2 border rounded hover:bg-secondary-50">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-gray-700" />
                    <div>
                      <div className="font-medium text-sm">{file.name}</div>
                      <div className="text-xs text-secondary-500">{new Date(file.updatedAt).toLocaleString('pt-BR')}</div>
                    </div>
                  </div>
                  <Button size="sm" variant="primary" onClick={() => handleOpenFile(file)}>Abrir</Button>
                </div>
              ))}
              {files.length === 0 && (
                <div className="text-sm text-secondary-500 p-2">Nenhum arquivo nesta pasta.</div>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}