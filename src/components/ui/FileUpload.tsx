import React, { useRef, useState } from 'react'
import { Upload, X, File, Image, FileText } from 'lucide-react'
import { Button } from './Button'
import { cn } from '@/lib/utils'

interface FileUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: (file: File) => void
  accept?: string
  multiple?: boolean
  maxSize?: number // in MB
  className?: string
  disabled?: boolean
  placeholder?: string
  existingFiles?: string[]
}

export function FileUpload({
  onFileSelect,
  onFileRemove,
  accept = '*/*',
  multiple = false,
  maxSize = 10,
  className,
  disabled = false,
  placeholder = 'Clique para selecionar arquivos',
  existingFiles = [],
}: FileUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [dragActive, setDragActive] = useState(false)
  const [error, setError] = useState<string>('')

  const handleFileSelect = (files: FileList | null) => {
    if (!files) return

    const fileArray = Array.from(files)
    
    // Validate file size
    const oversizedFiles = fileArray.filter(file => file.size > maxSize * 1024 * 1024)
    if (oversizedFiles.length > 0) {
      setError(`Arquivos muito grandes. Tamanho máximo: ${maxSize}MB`)
      return
    }

    // Validate file type
    if (accept !== '*/*') {
      const acceptedTypes = accept.split(',').map(type => type.trim())
      const invalidFiles = fileArray.filter(file => {
        return !acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return file.name.toLowerCase().endsWith(type.toLowerCase())
          }
          return file.type.match(type.replace('*', '.*'))
        })
      })
      
      if (invalidFiles.length > 0) {
        setError(`Tipo de arquivo não permitido. Tipos aceitos: ${accept}`)
        return
      }
    }

    setError('')
    
    if (multiple) {
      fileArray.forEach(file => onFileSelect(file))
    } else {
      onFileSelect(fileArray[0])
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true)
    } else if (e.type === 'dragleave') {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    
    if (disabled) return
    
    const files = e.dataTransfer.files
    handleFileSelect(files)
  }

  const handleClick = () => {
    if (disabled) return
    fileInputRef.current?.click()
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(extension || '')) {
      return <Image className="w-4 h-4" />
    }
    
    if (['pdf'].includes(extension || '')) {
      return <FileText className="w-4 h-4" />
    }
    
    return <File className="w-4 h-4" />
  }


  return (
    <div className={cn('space-y-4', className)}>
      {/* Upload Area */}
      <div
        className={cn(
          'border-2 border-dashed rounded-lg p-6 text-center transition-colors cursor-pointer',
          dragActive
            ? 'border-primary-500 bg-primary-50'
            : 'border-secondary-300 hover:border-secondary-400',
          disabled && 'opacity-50 cursor-not-allowed'
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={handleClick}
      >
        <Upload className="w-8 h-8 mx-auto mb-2 text-secondary-400" />
        <p className="text-sm text-secondary-600 mb-1">
          {placeholder}
        </p>
        <p className="text-xs text-secondary-500">
          Arraste e solte arquivos aqui ou clique para selecionar
        </p>
        <p className="text-xs text-secondary-400 mt-1">
          Tamanho máximo: {maxSize}MB
        </p>
      </div>

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
        disabled={disabled}
      />

      {/* Error Message */}
      {error && (
        <div className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-2">
          {error}
        </div>
      )}

      {/* Existing Files */}
      {existingFiles.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium text-secondary-700">Arquivos anexados:</h4>
          <div className="space-y-1">
            {existingFiles.map((file, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-2 bg-secondary-50 rounded-md"
              >
                <div className="flex items-center gap-2">
                  {getFileIcon(file)}
                  <span className="text-sm text-secondary-700">{file}</span>
                </div>
                {onFileRemove && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onFileRemove(file as any)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

