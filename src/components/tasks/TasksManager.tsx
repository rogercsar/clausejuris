import { useState } from 'react'
import { CheckSquare, Square, Clock, AlertTriangle, Plus, Calendar } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Card, CardContent } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { 
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog'
import { 
  mockTasks,
  getTaskStats,
  completeTask
} from '@/data/tasks'
import type { Task, TaskStatus, TaskPriority, TaskType } from '@/types'
import { TasksCalendarModal } from './TasksCalendar'

interface TasksManagerProps {
  isOpen: boolean
  onClose: () => void
  processId?: string
  contractId?: string
}

export function TasksManagerModal({ isOpen, onClose, processId, contractId }: TasksManagerProps) {
  const [tasks, setTasks] = useState<Task[]>(mockTasks)
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('')
  const [filterPriority, setFilterPriority] = useState<TaskPriority | ''>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [showCalendar, setShowCalendar] = useState(false)
  // const [showTaskForm, setShowTaskForm] = useState(false)

  const stats = getTaskStats()

  // Filter tasks
  let filteredTasks = tasks

  if (processId) {
    filteredTasks = filteredTasks.filter(task => task.processId === processId)
  }

  if (contractId) {
    filteredTasks = filteredTasks.filter(task => task.contractId === contractId)
  }

  if (filterStatus) {
    filteredTasks = filteredTasks.filter(task => task.status === filterStatus)
  }

  if (filterPriority) {
    filteredTasks = filteredTasks.filter(task => task.priority === filterPriority)
  }

  if (searchQuery) {
    filteredTasks = filteredTasks.filter(task =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.tags.some((tag: string) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    )
  }

  const handleTaskComplete = (taskId: string) => {
    const updatedTask = completeTask(taskId)
    if (updatedTask) {
      setTasks(prev => prev.map(task => 
        task.id === taskId ? updatedTask : task
      ))
    }
  }

  // const handleTaskUpdate = (taskId: string, updates: Partial<Task>) => {
  //   const updatedTask = updateTask(taskId, updates)
  //   if (updatedTask) {
  //     setTasks(prev => prev.map(task => 
  //       task.id === taskId ? updatedTask : task
  //     ))
  //   }
  // }

  const getPriorityColor = (priority: TaskPriority) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'high':
        return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getStatusColor = (status: TaskStatus) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-200'
      case 'in_progress':
        return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'overdue':
        return 'bg-red-100 text-red-800 border-red-200'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'cancelled':
        return 'bg-gray-100 text-gray-800 border-gray-200'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: TaskType) => {
    switch (type) {
      case 'deadline':
        return <Clock className="w-4 h-4 text-red-500" />
      case 'hearing':
        return <AlertTriangle className="w-4 h-4 text-orange-500" />
      case 'document_preparation':
        return <CheckSquare className="w-4 h-4 text-blue-500" />
      case 'meeting':
        return <Calendar className="w-4 h-4 text-green-500" />
      default:
        return <CheckSquare className="w-4 h-4 text-gray-500" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR')
  }

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date() && !tasks.find(t => t.dueDate === dueDate)?.completedAt
  }

  const statusOptions = [
    { value: '', label: 'Todos os status' },
    { value: 'pending', label: 'Pendente' },
    { value: 'in_progress', label: 'Em Andamento' },
    { value: 'completed', label: 'Concluída' },
    { value: 'overdue', label: 'Atrasada' },
    { value: 'cancelled', label: 'Cancelada' }
  ]

  const priorityOptions = [
    { value: '', label: 'Todas as prioridades' },
    { value: 'low', label: 'Baixa' },
    { value: 'medium', label: 'Média' },
    { value: 'high', label: 'Alta' },
    { value: 'urgent', label: 'Urgente' }
  ]

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckSquare className="w-5 h-5" />
            Gerenciador de Tarefas
          </DialogTitle>
          <DialogDescription>
            Organize e acompanhe suas tarefas e prazos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex-1 relative">
                <Input
                  placeholder="Pesquisar tarefas..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as TaskStatus)}
                className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
              >
                {statusOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              
              <select
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value as TaskPriority)}
                className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
              >
                {priorityOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => setShowCalendar(true)}>
                <Calendar className="w-4 h-4 mr-2" />
                Calendário
              </Button>
              <Button size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Nova Tarefa
              </Button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
                <div className="text-sm text-secondary-600">Total</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
                <div className="text-sm text-secondary-600">Concluídas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">{stats.upcoming}</div>
                <div className="text-sm text-secondary-600">Próximas</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-secondary-600">Atrasadas</div>
              </CardContent>
            </Card>
          </div>

          {/* Tasks List */}
          <div className="space-y-3 max-h-[50vh] overflow-y-auto">
            {filteredTasks.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center">
                  <CheckSquare className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-gray-500">Nenhuma tarefa encontrada</p>
                </CardContent>
              </Card>
            ) : (
              filteredTasks.map((task) => (
                <Card 
                  key={task.id} 
                  className={`transition-colors ${
                    task.status === 'completed' ? 'bg-green-50 border-green-200' : 
                    task.status === 'overdue' ? 'bg-red-50 border-red-200' :
                    'hover:bg-secondary-50'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <button
                        onClick={() => handleTaskComplete(task.id)}
                        className="mt-1 text-secondary-400 hover:text-primary-600"
                      >
                        {task.status === 'completed' ? (
                          <CheckSquare className="w-5 h-5 text-green-600" />
                        ) : (
                          <Square className="w-5 h-5" />
                        )}
                      </button>
                      
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h4 className={`font-medium ${
                              task.status === 'completed' ? 'line-through text-gray-500' : 'text-gray-900'
                            }`}>
                              {task.title}
                            </h4>
                            {task.description && (
                              <p className="text-sm text-gray-600 mt-1">{task.description}</p>
                            )}
                            <div className="flex items-center gap-2 mt-2">
                              <span className="text-xs text-gray-500">
                                {formatDate(task.dueDate)}
                              </span>
                              {isOverdue(task.dueDate) && task.status !== 'completed' && (
                                <Badge className="bg-red-100 text-red-800 border-red-200 text-xs">
                                  Atrasada
                                </Badge>
                              )}
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Badge className={getPriorityColor(task.priority)}>
                              {task.priority}
                            </Badge>
                            <Badge className={getStatusColor(task.status)}>
                              {task.status}
                            </Badge>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-2 mt-3">
                          {getTypeIcon(task.type)}
                          <span className="text-xs text-gray-500 capitalize">
                            {task.type.replace('_', ' ')}
                          </span>
                          {task.tags.length > 0 && (
                            <>
                              <span className="text-xs text-gray-400">•</span>
                              <div className="flex gap-1">
                                {task.tags.slice(0, 3).map((tag: string) => (
                                  <Badge key={tag} variant="outline" className="text-xs">
                                    {tag}
                                  </Badge>
                                ))}
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>

        {/* Calendar Modal */}
        <TasksCalendarModal
          isOpen={showCalendar}
          onClose={() => setShowCalendar(false)}
        />
      </DialogContent>
    </Dialog>
  )
}
