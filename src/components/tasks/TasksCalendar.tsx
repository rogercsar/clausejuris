import { useState } from 'react'
import { Calendar, Clock, AlertTriangle, Plus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
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
  getCalendarEventsByDate, 
  getUpcomingTasks,
  getUpcomingDeadlines,
  getTaskStats
} from '@/data/tasks'
// import type { CalendarEvent, Task, Deadline } from '@/types'

interface TasksCalendarProps {
  isOpen: boolean
  onClose: () => void
}

export function TasksCalendarModal({ isOpen, onClose }: TasksCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [viewMode, setViewMode] = useState<'month' | 'week' | 'day'>('month')
  // const [showTaskForm, setShowTaskForm] = useState(false)
  const [filterType, setFilterType] = useState<'all' | 'tasks' | 'deadlines' | 'events'>('all')

  const today = new Date()
  const currentMonth = currentDate.getMonth()
  const currentYear = currentDate.getFullYear()

  // Get calendar data
  const upcomingTasks = getUpcomingTasks(30)
  const upcomingDeadlines = getUpcomingDeadlines(30)
  const stats = getTaskStats()

  // Generate calendar days
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1)
  const lastDayOfMonth = new Date(currentYear, currentMonth + 1, 0)
  const firstDayOfWeek = firstDayOfMonth.getDay()
  const daysInMonth = lastDayOfMonth.getDate()

  const calendarDays = []
  
  // Add empty cells for days before the first day of the month
  for (let i = 0; i < firstDayOfWeek; i++) {
    calendarDays.push(null)
  }
  
  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(new Date(currentYear, currentMonth, day))
  }

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0]
    const events = getCalendarEventsByDate(dateString)
    const tasks = upcomingTasks.filter(task => {
      const taskDate = new Date(task.dueDate)
      return taskDate.toDateString() === date.toDateString()
    })
    const deadlines = upcomingDeadlines.filter(deadline => {
      const deadlineDate = new Date(deadline.dueDate)
      return deadlineDate.toDateString() === date.toDateString()
    })

    return { events, tasks, deadlines }
  }

  const getDateEvents = (date: Date) => {
    const { events, tasks, deadlines } = getEventsForDate(date)
    
    switch (filterType) {
      case 'tasks':
        return tasks
      case 'deadlines':
        return deadlines
      case 'events':
        return events
      default:
        return [...events, ...tasks, ...deadlines]
    }
  }

  const isToday = (date: Date) => {
    return date.toDateString() === today.toDateString()
  }

  const isPastDate = (date: Date) => {
    return date < today && !isToday(date)
  }

  const navigateMonth = (direction: 'prev' | 'next') => {
    const newDate = new Date(currentDate)
    if (direction === 'prev') {
      newDate.setMonth(currentMonth - 1)
    } else {
      newDate.setMonth(currentMonth + 1)
    }
    setCurrentDate(newDate)
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getEventTypeIcon = (type: string) => {
    switch (type) {
      case 'hearing':
        return <AlertTriangle className="w-3 h-3 text-red-500" />
      case 'deadline':
        return <Clock className="w-3 h-3 text-orange-500" />
      case 'meeting':
        return <Calendar className="w-3 h-3 text-blue-500" />
      default:
        return <Calendar className="w-3 h-3 text-gray-500" />
    }
  }

  const getPriorityColor = (priority: string) => {
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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Calendário de Tarefas e Prazos
          </DialogTitle>
          <DialogDescription>
            Visualize e gerencie suas tarefas, prazos e eventos
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('prev')}
                >
                  ←
                </Button>
                <h3 className="text-lg font-semibold">
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => navigateMonth('next')}
                >
                  →
                </Button>
              </div>
              
              <div className="flex gap-2">
                <Button
                  variant={viewMode === 'month' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('month')}
                >
                  Mês
                </Button>
                <Button
                  variant={viewMode === 'week' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('week')}
                >
                  Semana
                </Button>
                <Button
                  variant={viewMode === 'day' ? 'primary' : 'outline'}
                  size="sm"
                  onClick={() => setViewMode('day')}
                >
                  Dia
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value as any)}
                className="px-3 py-2 border border-secondary-300 rounded-md text-sm"
              >
                <option value="all">Todos</option>
                <option value="tasks">Tarefas</option>
                <option value="deadlines">Prazos</option>
                <option value="events">Eventos</option>
              </select>
              
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
                <div className="text-sm text-secondary-600">Total de Tarefas</div>
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
                <div className="text-sm text-secondary-600">Próximas (7 dias)</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-secondary-600">Atrasadas</div>
              </CardContent>
            </Card>
          </div>

          {/* Calendar */}
          <Card>
            <CardContent className="p-4">
              {/* Calendar Header */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <div key={day} className="text-center text-sm font-medium text-secondary-600 py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-1">
                {calendarDays.map((date, index) => {
                  if (!date) {
                    return <div key={index} className="h-24"></div>
                  }

                  const events = getDateEvents(date)
                  const isCurrentDay = isToday(date)
                  const isPast = isPastDate(date)

                  return (
                    <div
                      key={index}
                      className={`h-24 border border-secondary-200 rounded-md p-1 cursor-pointer hover:bg-secondary-50 ${
                        isCurrentDay ? 'bg-blue-50 border-blue-300' : ''
                      } ${isPast ? 'bg-gray-50' : ''}`}
                      onClick={() => setSelectedDate(date)}
                    >
                      <div className={`text-sm font-medium mb-1 ${
                        isCurrentDay ? 'text-blue-600' : isPast ? 'text-gray-400' : 'text-secondary-900'
                      }`}>
                        {date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {events.slice(0, 3).map((event, eventIndex) => (
                          <div
                            key={eventIndex}
                            className="text-xs p-1 rounded bg-primary-100 text-primary-800 truncate"
                          >
                            {getEventTypeIcon('event')}
                            <span className="ml-1">
                              {(event as any).title}
                            </span>
                          </div>
                        ))}
                        {events.length > 3 && (
                          <div className="text-xs text-secondary-500">
                            +{events.length - 3} mais
                          </div>
                        )}
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Selected Date Details */}
        {selectedDate && (
          <div className="space-y-4">
            <h3 className="font-medium text-lg">
              {formatDate(selectedDate)}
            </h3>
            <div className="space-y-2">
              {getDateEvents(selectedDate).map((event, index) => (
                <Card key={index}>
                  <CardContent className="p-3">
                    <div className="flex items-start gap-3">
                      {getEventTypeIcon('event')}
                      <div className="flex-1">
                        <h4 className="font-medium text-sm">
                          {(event as any).title}
                        </h4>
                        <p className="text-xs text-secondary-600 mt-1">
                          {(event as any).description}
                        </p>
                        {'priority' in event && (
                          <Badge className={`text-xs mt-2 ${getPriorityColor(event.priority)}`}>
                            {event.priority}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="flex justify-end px-6 py-4 border-t border-gray-200 bg-gray-50">
          <Button variant="outline" onClick={onClose}>
            Fechar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
