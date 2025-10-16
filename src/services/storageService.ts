export type StoredFile = {
  id: string
  name: string
  mimeType: string
  size: number
  createdAt: string
  updatedAt: string
  content: string // base64 or text
  folderId?: string // Reference to parent folder
}

export type StoredFolder = {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  parentId?: string // For nested folders
}

export type ClientFolder = {
  clientId: string
  clientName: string
  files: StoredFile[]
  folders: StoredFolder[]
}

const STORAGE_KEY = 'clause_client_folders'

function loadAll(): ClientFolder[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    const folders = raw ? JSON.parse(raw) : []
    
    // Migrate existing folders that don't have the folders property
    folders.forEach((folder: ClientFolder) => {
      if (!folder.folders) {
        folder.folders = []
      }
    })
    
    return folders
  } catch {
    return []
  }
}

function saveAll(folders: ClientFolder[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(folders))
}

export function ensureClientFolder(clientId: string, clientName: string): ClientFolder {
  const all = loadAll()
  const existing = all.find(f => f.clientId === clientId)
  if (existing) return existing
  const folder: ClientFolder = { clientId, clientName, files: [], folders: [] }
  all.push(folder)
  saveAll(all)
  return folder
}

export function listClientFiles(clientId: string, folderId?: string): StoredFile[] {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return []
  
  if (folderId) {
    return folder.files.filter(f => f.folderId === folderId)
  }
  return folder.files.filter(f => !f.folderId) // Root level files
}

export function listClientFolders(clientId: string, parentId?: string): StoredFolder[] {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return []
  
  // Ensure folders array exists
  if (!folder.folders) {
    folder.folders = []
  }
  
  if (parentId) {
    return folder.folders.filter(f => f.parentId === parentId)
  }
  return folder.folders.filter(f => !f.parentId) // Root level folders
}

export function saveClientFile(clientId: string, clientName: string, file: Omit<StoredFile, 'id' | 'createdAt' | 'updatedAt' | 'size'> & { content: string }, folderId?: string): StoredFile {
  const all = loadAll()
  let folder = all.find(f => f.clientId === clientId)
  if (!folder) {
    folder = { clientId, clientName, files: [], folders: [] }
    all.push(folder)
  }
  const now = new Date().toISOString()
  const contentBytes = new TextEncoder().encode(file.content)
  const stored: StoredFile = {
    id: `${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: file.name,
    mimeType: file.mimeType,
    size: contentBytes.byteLength,
    createdAt: now,
    updatedAt: now,
    content: file.content,
    folderId: folderId
  }
  folder.files.unshift(stored)
  saveAll(all)
  return stored
}

export function renameClientFile(clientId: string, fileId: string, newName: string): void {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return
  const f = folder.files.find(x => x.id === fileId)
  if (!f) return
  f.name = newName
  f.updatedAt = new Date().toISOString()
  saveAll(all)
}

export function deleteClientFile(clientId: string, fileId: string): void {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return
  folder.files = folder.files.filter(f => f.id !== fileId)
  saveAll(all)
}

// Folder management functions
export function createClientFolder(clientId: string, folderName: string, parentId?: string): StoredFolder {
  const all = loadAll()
  let folder = all.find(f => f.clientId === clientId)
  if (!folder) {
    folder = { clientId, clientName: '', files: [], folders: [] }
    all.push(folder)
  }
  
  // Ensure folders array exists
  if (!folder.folders) {
    folder.folders = []
  }
  
  const now = new Date().toISOString()
  const newFolder: StoredFolder = {
    id: `folder-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    name: folderName,
    createdAt: now,
    updatedAt: now,
    parentId: parentId
  }
  
  folder.folders.push(newFolder)
  saveAll(all)
  return newFolder
}

export function renameClientFolder(clientId: string, folderId: string, newName: string): void {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return
  
  // Ensure folders array exists
  if (!folder.folders) {
    folder.folders = []
  }
  
  const f = folder.folders.find(x => x.id === folderId)
  if (!f) return
  f.name = newName
  f.updatedAt = new Date().toISOString()
  saveAll(all)
}

export function deleteClientFolder(clientId: string, folderId: string): void {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return
  
  // Ensure folders array exists
  if (!folder.folders) {
    folder.folders = []
  }
  
  // Delete all files in this folder
  folder.files = folder.files.filter(f => f.folderId !== folderId)
  
  // Delete all subfolders recursively
  const deleteSubfolders = (parentId: string) => {
    const subfolders = folder.folders.filter(f => f.parentId === parentId)
    subfolders.forEach(subfolder => {
      // Delete files in subfolder
      folder.files = folder.files.filter(f => f.folderId !== subfolder.id)
      // Delete subfolders recursively
      deleteSubfolders(subfolder.id)
    })
  }
  
  deleteSubfolders(folderId)
  
  // Delete the folder itself
  folder.folders = folder.folders.filter(f => f.id !== folderId)
  saveAll(all)
}

export function getFolderPath(clientId: string, folderId: string): StoredFolder[] {
  const all = loadAll()
  const folder = all.find(f => f.clientId === clientId)
  if (!folder) return []
  
  // Ensure folders array exists
  if (!folder.folders) {
    folder.folders = []
  }
  
  const path: StoredFolder[] = []
  let currentId = folderId
  
  while (currentId) {
    const currentFolder = folder.folders.find(f => f.id === currentId)
    if (!currentFolder) break
    path.unshift(currentFolder)
    currentId = currentFolder.parentId || ''
  }
  
  return path
}



