import { Printer } from 'lucide-react'
import { Button } from './Button'

interface PrintButtonProps {
  onPrint?: () => void
  className?: string
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive'
  size?: 'sm' | 'md' | 'lg'
  disabled?: boolean
}

export function PrintButton({ 
  onPrint, 
  className, 
  variant = 'outline',
  size = 'md',
  disabled = false 
}: PrintButtonProps) {
  const handlePrint = () => {
    if (onPrint) {
      onPrint()
    } else {
      window.print()
    }
  }

  return (
    <Button
      variant={variant}
      size={size}
      onClick={handlePrint}
      disabled={disabled}
      className={className}
    >
      <Printer className="w-4 h-4 mr-2" />
      Imprimir
    </Button>
  )
}

