import { NavLink, Outlet } from 'react-router-dom'
import { cn } from '@/lib/utils'

const adminNav = [
  { to: '/admin', label: 'Dashboard' },
  { to: '/admin/users', label: 'Usuários' },
  { to: '/admin/finance', label: 'Financeiro' },
  { to: '/admin/reports', label: 'Relatórios' },
  { to: '/admin/laws', label: 'Leis' },
  { to: '/admin/features', label: 'Funcionalidades' },
]

export function AdminLayout() {
  return (
    <div className="min-h-screen bg-secondary-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="border-b border-secondary-200 mb-8">
          <nav className="flex flex-wrap gap-4 text-sm font-medium text-secondary-600">
            {adminNav.map(item => (
              <NavLink
                key={item.to}
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    'pb-3 border-b-2 border-transparent hover:border-secondary-300 hover:text-secondary-900 transition-colors',
                    isActive && 'border-primary-500 text-primary-600'
                  )
                }
                end={item.to === '/admin'}
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
        <Outlet />
      </div>
    </div>
  )
}

export default AdminLayout

