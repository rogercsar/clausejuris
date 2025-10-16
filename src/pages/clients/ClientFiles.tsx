import { useParams, Link } from 'react-router-dom'
import { ArrowLeft, Download, Trash2, FileText, Calendar, User, FolderOpen, FolderPlus, ChevronRight, Home } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useClient } from '@/hooks/useClients'
import { formatDate } from '@/lib/utils'
import { 
  listClientFiles, 
  deleteClientFile, 
  listClientFolders, 
  createClientFolder, 
  deleteClientFolder,
  getFolderPath,
  type StoredFolder 
} from '@/services/storageService'
import { useState, useEffect } from 'react'

export function ClientFiles() {
  const { id } = useParams<{ id: string }>()
  const { data: client, isLoading, error } = useClient(id!)
  const [clientFiles, setClientFiles] = useState<any[]>([])
  const [clientFolders, setClientFolders] = useState<StoredFolder[]>([])
  const [filesLoading, setFilesLoading] = useState(false)
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined)
  const [showCreateFolder, setShowCreateFolder] = useState(false)
  const [newFolderName, setNewFolderName] = useState('')

  useEffect(() => {
    if (client?.id) {
      setFilesLoading(true)
      try {
        const files = listClientFiles(client.id, currentFolderId)
        const folders = listClientFolders(client.id, currentFolderId)
        setClientFiles(files)
        setClientFolders(folders)
      } catch (error) {
        console.error('Erro ao carregar arquivos do cliente:', error)
        setClientFiles([])
        setClientFolders([])
      } finally {
        setFilesLoading(false)
      }
    }
  }, [client?.id, currentFolderId])

  const handleDeleteFile = (fileId: string) => {
    if (!client?.id) return
    
    if (confirm('Tem certeza que deseja excluir este arquivo?')) {
      try {
        deleteClientFile(client.id, fileId)
        setClientFiles(prev => prev.filter(f => f.id !== fileId))
      } catch (error) {
        console.error('Erro ao excluir arquivo:', error)
        alert('Erro ao excluir arquivo')
      }
    }
  }

  const handleDownloadFile = (file: any) => {
    try {
      const blob = new Blob([file.content], { type: file.mimeType })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = file.name
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar arquivo:', error)
      alert('Erro ao baixar arquivo')
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleCreateFolder = () => {
    if (!client?.id || !newFolderName.trim()) return
    
    try {
      createClientFolder(client.id, newFolderName.trim(), currentFolderId)
      setNewFolderName('')
      setShowCreateFolder(false)
      // Refresh the list
      const files = listClientFiles(client.id, currentFolderId)
      const folders = listClientFolders(client.id, currentFolderId)
      setClientFiles(files)
      setClientFolders(folders)
    } catch (error) {
      console.error('Erro ao criar pasta:', error)
      alert('Erro ao criar pasta')
    }
  }

  const handleDeleteFolder = (folderId: string) => {
    if (!client?.id) return
    
    if (confirm('Tem certeza que deseja excluir esta pasta e todos os seus conteúdos?')) {
      try {
        deleteClientFolder(client.id, folderId)
        // Refresh the list
        const files = listClientFiles(client.id, currentFolderId)
        const folders = listClientFolders(client.id, currentFolderId)
        setClientFiles(files)
        setClientFolders(folders)
      } catch (error) {
        console.error('Erro ao excluir pasta:', error)
        alert('Erro ao excluir pasta')
      }
    }
  }

  const handleFolderClick = (folderId: string) => {
    setCurrentFolderId(folderId)
  }


  const getBreadcrumbPath = () => {
    if (!client?.id) return []
    
    const path = getFolderPath(client.id, currentFolderId || '')
    return path
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-secondary-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-secondary-200 rounded w-1/2 mb-6"></div>
          <div className="space-y-4">
            <div className="h-32 bg-secondary-200 rounded"></div>
            <div className="h-32 bg-secondary-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  if (error || !client) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-center">
            <User className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
            <h3 className="text-lg font-medium text-secondary-900 mb-2">
              Cliente não encontrado
            </h3>
            <p className="text-secondary-600 mb-6">
              O cliente que você está procurando não existe ou foi removido.
            </p>
            <Link to="/clients">
              <Button>
                Ver todos os clientes
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="space-y-4">
        {/* Top Row - Back button and title */}
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl sm:text-2xl font-bold text-secondary-900 flex items-center gap-2">
              <FolderOpen className="w-5 h-5 sm:w-6 sm:h-6" />
              <span className="truncate">Pasta do Cliente</span>
            </h1>
            <p className="text-sm sm:text-base text-secondary-600 truncate">{client.name}</p>
          </div>
        </div>

        {/* Action Buttons - Responsive layout */}
        <div className="flex flex-wrap items-center gap-2">
          <Button 
            onClick={() => setShowCreateFolder(true)} 
            variant="outline"
            size="sm"
            className="flex-shrink-0"
          >
            <FolderPlus className="w-4 h-4 mr-1 sm:mr-2" />
            <span className="hidden sm:inline">Nova Pasta</span>
            <span className="sm:hidden">Nova</span>
          </Button>
          <Link to={`/editor?clientId=${client.id}&folderId=${currentFolderId || ''}`}>
            <Button size="sm" className="flex-shrink-0">
              <FileText className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Novo Documento</span>
              <span className="sm:hidden">Novo</span>
            </Button>
          </Link>
          <Link to={`/clients/${client.id}`}>
            <Button variant="outline" size="sm" className="flex-shrink-0">
              <User className="w-4 h-4 mr-1 sm:mr-2" />
              <span className="hidden sm:inline">Ver Cliente</span>
              <span className="sm:hidden">Cliente</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Breadcrumb Navigation */}
      {currentFolderId && (
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-sm">
              <button
                onClick={() => setCurrentFolderId(undefined)}
                className="flex items-center gap-1 text-blue-600 hover:text-blue-700"
              >
                <Home className="w-4 h-4" />
                Pasta Principal
              </button>
              {getBreadcrumbPath().map((folder) => (
                <div key={folder.id} className="flex items-center gap-2">
                  <ChevronRight className="w-4 h-4 text-gray-400" />
                  <button
                    onClick={() => setCurrentFolderId(folder.id)}
                    className="text-blue-600 hover:text-blue-700"
                  >
                    {folder.name}
                  </button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create Folder Modal */}
      {showCreateFolder && (
        <Card>
          <CardContent className="p-4">
            <div className="space-y-4">
              <h3 className="font-medium">Criar Nova Pasta</h3>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  placeholder="Nome da pasta (ex: Processo 1234567-89.2024.1.01.0001)"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleCreateFolder()}
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={handleCreateFolder} 
                    disabled={!newFolderName.trim()}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    Criar
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowCreateFolder(false)}
                    size="sm"
                    className="flex-1 sm:flex-none"
                  >
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Files and Folders List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            {currentFolderId ? 'Conteúdo da Pasta' : 'Arquivos e Pastas'}
          </CardTitle>
          <CardDescription>
            {filesLoading ? 'Carregando...' : `${clientFiles.length} arquivo(s) e ${clientFolders.length} pasta(s)`}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {clientFiles.length === 0 && clientFolders.length === 0 ? (
            <div className="text-center py-12">
              <FolderOpen className="w-16 h-16 mx-auto mb-4 text-secondary-300" />
              <h3 className="text-lg font-medium text-secondary-900 mb-2">
                {currentFolderId ? 'Pasta vazia' : 'Pasta vazia'}
              </h3>
              <p className="text-secondary-600 mb-6">
                {currentFolderId 
                  ? 'Esta pasta não contém arquivos ou subpastas.'
                  : 'Nenhum arquivo ou pasta foi criado para este cliente ainda.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                <Button onClick={() => setShowCreateFolder(true)} variant="outline">
                  <FolderPlus className="w-4 h-4 mr-2" />
                  Criar Pasta
                </Button>
                <Link to={`/editor?clientId=${client.id}&folderId=${currentFolderId || ''}`}>
                  <Button>
                    <FileText className="w-4 h-4 mr-2" />
                    Criar Documento
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              {/* Folders */}
              {clientFolders.map((folder) => (
                <div key={folder.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-yellow-100 rounded-lg flex-shrink-0">
                      <FolderOpen className="w-5 h-5 text-yellow-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">{folder.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-secondary-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(folder.createdAt)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          Pasta
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleFolderClick(folder.id)}
                      className="flex-1 sm:flex-none"
                    >
                      Abrir
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}

              {/* Files */}
              {clientFiles.map((file) => (
                <div key={file.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border border-secondary-200 rounded-lg hover:bg-secondary-50 transition-colors gap-3">
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className="p-2 bg-blue-100 rounded-lg flex-shrink-0">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-medium text-secondary-900 truncate">{file.name}</h4>
                      <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-sm text-secondary-500 mt-1">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3" />
                          {formatDate(file.createdAt)}
                        </span>
                        <span>{formatFileSize(file.size)}</span>
                        <Badge variant="outline" className="text-xs">
                          {file.mimeType}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDownloadFile(file)}
                      className="flex-1 sm:flex-none"
                    >
                      <Download className="w-4 h-4 mr-1" />
                      Baixar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50 flex-1 sm:flex-none"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
