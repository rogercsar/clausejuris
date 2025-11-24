export type UserPlan = 'common' | 'start' | 'pro' | 'office'

export interface User {
  id: string
  email: string
  name: string
  fullName: string
  oab?: string
  phone?: string
  plan: UserPlan
  avatar?: string
  document?: string
  isActive?: boolean
  createdAt: string
  updatedAt: string
  // Campos para colaboração
  role?: UserRole
  lastLogin?: string
  password?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  email: string
  password: string
  name: string
  fullName: string
  oab?: string
  phone?: string
  plan: UserPlan
}

export interface Contract {
  id: string
  type: ContractType
  clientId: string
  clientName: string
  startDate: string
  endDate?: string
  value: number
  status: ContractStatus
  attachments: string[]
  description?: string
  createdAt: string
  updatedAt: string
}

export type ContractType = 
  | 'rental' 
  | 'service' 
  | 'purchase_sale' 
  | 'partnership' 
  | 'employment' 
  | 'other'

export type ContractStatus = 'active' | 'ended' | 'terminated'

export interface Process {
  id: string
  type: ProcessType
  clientId: string
  clientName: string
  status: ProcessStatus
  startDate: string
  endDate?: string
  attachments: string[]
  description?: string
  court?: string
  caseNumber?: string
  againstWho?: string // Contra quem será o caso
  involved?: string // Envolvido no caso
  lawyer?: string // Advogado responsável
  createdAt: string
  updatedAt: string
}

export type ProcessType = 
  | 'civil' 
  | 'labor' 
  | 'criminal' 
  | 'family' 
  | 'administrative' 
  | 'other'

export type ProcessStatus = 'won' | 'lost' | 'in_progress' | 'pending'

export interface Client {
  id: string
  name: string
  email?: string
  phone?: string
  document: string
  type: 'person' | 'company'
  address?: string
  createdAt: string
  updatedAt: string
}

export type SupplierType = 'individual' | 'company'

export interface Supplier {
  id: string
  name: string
  email: string
  phone?: string
  address?: string
  document: string
  type: SupplierType
  createdAt: string
  updatedAt: string
}

export interface Law {
  id: string
  name: string
  type: string
  articles: LawArticle[]
  sourceUrl?: string
}

export interface LawArticle {
  id: string
  number: string
  title: string
  content: string
  lawId: string
}

export interface EditorSuggestion {
  id: string
  type: 'autocomplete' | 'correction' | 'snippet'
  text: string
  replacement?: string
  description?: string
  confidence: number
}

export interface CrossReference {
  entityId: string
  entityType: 'contract' | 'process'
  entityName: string
  relationType: 'same_client' | 'related_process' | 'related_contract'
  details: string
  riskLevel?: 'low' | 'medium' | 'high'
}

// Notification System Types
export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  entityId: string
  entityType: 'contract' | 'process'
  entityName: string
  priority: NotificationPriority
  isRead: boolean
  createdAt: string
  scheduledFor?: string
  metadata?: NotificationMetadata
}

export type NotificationType = 
  | 'contract_expiring'
  | 'contract_expired'
  | 'process_deadline'
  | 'process_urgent'
  | 'payment_due'
  | 'document_required'
  | 'court_hearing'
  | 'custom'

export type NotificationPriority = 'low' | 'medium' | 'high' | 'urgent'

export interface NotificationMetadata {
  daysUntilExpiry?: number
  amount?: number
  courtDate?: string
  documentType?: string
  customData?: Record<string, any>
}

export interface NotificationSettings {
  id: string
  userId: string
  emailNotifications: boolean
  browserNotifications: boolean
  contractExpiryDays: number[]
  processDeadlineDays: number[]
  paymentReminderDays: number[]
  courtHearingReminderDays: number[]
  quietHours: {
    enabled: boolean
    start: string // HH:mm format
    end: string // HH:mm format
  }
  notificationTypes: {
    [K in NotificationType]: boolean
  }
  createdAt: string
  updatedAt: string
}

export interface NotificationRule {
  id: string
  userId: string
  name: string
  description?: string
  entityType: 'contract' | 'process' | 'both'
  conditions: NotificationCondition[]
  actions: NotificationAction[]
  isActive: boolean
  createdAt: string
  updatedAt: string
}

export interface NotificationCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'greater_than' | 'less_than' | 'contains' | 'in' | 'not_in'
  value: any
  logicalOperator?: 'AND' | 'OR'
}

export interface NotificationAction {
  type: 'email' | 'browser' | 'sms' | 'webhook'
  template?: string
  recipients?: string[]
  webhookUrl?: string
  delay?: number // minutes
}

// Jurisprudence System Types
export interface Jurisprudence {
  id: string
  title: string
  court: string
  judge?: string
  date: string
  caseNumber: string
  summary: string
  fullText?: string
  keywords: string[]
  relatedLaws: string[]
  category: JurisprudenceCategory
  importance: JurisprudenceImportance
  precedentialValue: PrecedentialValue
  createdAt: string
  updatedAt: string
}

export type JurisprudenceCategory = 
  | 'civil'
  | 'criminal'
  | 'labor'
  | 'family'
  | 'administrative'
  | 'constitutional'
  | 'commercial'
  | 'tax'
  | 'consumer'
  | 'environmental'

export type JurisprudenceImportance = 'low' | 'medium' | 'high' | 'landmark'

export type PrecedentialValue = 'binding' | 'persuasive' | 'informative'

export interface JurisprudenceTimeline {
  id: string
  jurisprudenceId: string
  eventType: TimelineEventType
  title: string
  description: string
  date: string
  court: string
  relatedProcessId?: string
  relatedContractId?: string
  metadata?: Record<string, any>
}

export type TimelineEventType = 
  | 'decision'
  | 'appeal'
  | 'review'
  | 'precedent_set'
  | 'law_change'
  | 'court_ruling'
  | 'settlement'

// Tasks and Deadlines System Types
export interface Task {
  id: string
  title: string
  description?: string
  type: TaskType
  priority: TaskPriority
  status: TaskStatus
  processId?: string
  contractId?: string
  assignedTo?: string
  createdBy: string
  dueDate: string
  completedAt?: string
  reminderDays: number[]
  tags: string[]
  attachments: string[]
  createdAt: string
  updatedAt: string
}

export type TaskType = 
  | 'deadline'
  | 'hearing'
  | 'document_preparation'
  | 'filing'
  | 'response'
  | 'appeal'
  | 'meeting'
  | 'research'
  | 'review'
  | 'custom'

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent'

export type TaskStatus = 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'overdue'

export interface Deadline {
  id: string
  title: string
  description?: string
  type: DeadlineType
  processId?: string
  contractId?: string
  dueDate: string
  isCompleted: boolean
  completedAt?: string
  reminderDays: number[]
  autoGenerated: boolean
  createdAt: string
  updatedAt: string
}

export type DeadlineType = 
  | 'defense'
  | 'contesting'
  | 'appeal'
  | 'hearing'
  | 'document_submission'
  | 'payment'
  | 'contract_renewal'
  | 'custom'

export interface CalendarEvent {
  id: string
  title: string
  description?: string
  type: CalendarEventType
  startDate: string
  endDate?: string
  allDay: boolean
  location?: string
  attendees?: string[]
  processId?: string
  contractId?: string
  taskId?: string
  deadlineId?: string
  reminderMinutes: number[]
  createdAt: string
  updatedAt: string
}

export type CalendarEventType = 
  | 'hearing'
  | 'meeting'
  | 'deadline'
  | 'task'
  | 'court_session'
  | 'client_meeting'
  | 'internal_meeting'
  | 'custom'

// Team Collaboration System Types

export type UserRole = 
  | 'admin'
  | 'senior_lawyer'
  | 'junior_lawyer'
  | 'intern'
  | 'assistant'
  | 'paralegal'
  | 'client'

export interface Team {
  id: string
  name: string
  description?: string
  members: TeamMember[]
  createdAt: string
  updatedAt: string
}

export interface TeamMember {
  id: string
  userId: string
  teamId: string
  role: TeamRole
  permissions: Permission[]
  joinedAt: string
  isActive: boolean
}

export type TeamRole = 
  | 'owner'
  | 'manager'
  | 'senior'
  | 'member'
  | 'viewer'

export interface Permission {
  id: string
  name: string
  description: string
  resource: PermissionResource
  action: PermissionAction
  conditions?: PermissionCondition[]
}

export type PermissionResource = 
  | 'process'
  | 'contract'
  | 'document'
  | 'task'
  | 'calendar'
  | 'client'
  | 'team'
  | 'user'
  | 'report'

export type PermissionAction = 
  | 'create'
  | 'read'
  | 'update'
  | 'delete'
  | 'share'
  | 'export'
  | 'print'
  | 'comment'
  | 'assign'

export interface PermissionCondition {
  field: string
  operator: 'equals' | 'not_equals' | 'in' | 'not_in'
  value: any
}

export interface CollaborationSession {
  id: string
  entityType: 'process' | 'contract'
  entityId: string
  userId: string
  userName: string
  userRole: UserRole
  action: CollaborationAction
  timestamp: string
  details?: Record<string, any>
}

export type CollaborationAction = 
  | 'viewing'
  | 'editing'
  | 'commenting'
  | 'sharing'
  | 'downloading'
  | 'printing'

export interface Comment {
  id: string
  entityType: 'process' | 'contract' | 'document' | 'task'
  entityId: string
  userId: string
  userName: string
  userRole: UserRole
  content: string
  parentId?: string
  isResolved: boolean
  createdAt: string
  updatedAt: string
}

export interface ActivityLog {
  id: string
  entityType: 'process' | 'contract' | 'document' | 'task' | 'user'
  entityId: string
  userId: string
  userName: string
  action: string
  description: string
  metadata?: Record<string, any>
  timestamp: string
}
