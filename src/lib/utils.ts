import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value)
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  }).format(new Date(date))
}

export function formatDateTime(date: string | Date): string {
  return new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(date))
}

export function getContractTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    rental: 'Locação',
    service: 'Prestação de Serviços',
    purchase_sale: 'Compra e Venda',
    partnership: 'Sociedade',
    employment: 'Trabalhista',
    other: 'Outro',
  }
  return labels[type] || type
}

export function getProcessTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    civil: 'Civil',
    labor: 'Trabalhista',
    criminal: 'Criminal',
    family: 'Família',
    administrative: 'Administrativo',
    other: 'Outro',
  }
  return labels[type] || type
}

export function getContractStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    active: 'Ativo',
    ended: 'Encerrado',
    terminated: 'Rescindido',
  }
  return labels[status] || status
}

export function getProcessStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    won: 'Ganho',
    lost: 'Perdido',
    in_progress: 'Em Andamento',
    pending: 'Pendente',
  }
  return labels[status] || status
}

export function getStatusColor(status: string, type: 'contract' | 'process'): string {
  if (type === 'contract') {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'ended':
        return 'bg-gray-100 text-gray-800'
      case 'terminated':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  } else {
    switch (status) {
      case 'won':
        return 'bg-green-100 text-green-800'
      case 'lost':
        return 'bg-red-100 text-red-800'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }
}

