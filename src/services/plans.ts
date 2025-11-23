import type { UserPlan } from '@/types'

export type PlanLimits = {
  aiDocsPerMonth?: number
  activeCases?: number
  features: {
    ai: boolean
    advancedEditor: boolean
    smartTemplates: boolean
    teams: boolean
    permissions: boolean
    workflow: boolean
    sharedFolders: boolean
  }
}

export function getPlanLimits(plan: UserPlan): PlanLimits {
  switch (plan) {
    case 'start':
      return {
        aiDocsPerMonth: 10,
        activeCases: 5,
        features: {
          ai: true,
          advancedEditor: false,
          smartTemplates: false,
          teams: false,
          permissions: false,
          workflow: false,
          sharedFolders: false,
        },
      }
    case 'pro':
      return {
        features: {
          ai: true,
          advancedEditor: true,
          smartTemplates: true,
          teams: false,
          permissions: false,
          workflow: false,
          sharedFolders: false,
        },
      }
    case 'office':
      return {
        features: {
          ai: true,
          advancedEditor: true,
          smartTemplates: true,
          teams: true,
          permissions: true,
          workflow: true,
          sharedFolders: true,
        },
      }
    default:
      return {
        features: {
          ai: false,
          advancedEditor: false,
          smartTemplates: false,
          teams: false,
          permissions: false,
          workflow: false,
          sharedFolders: false,
        },
      }
  }
}