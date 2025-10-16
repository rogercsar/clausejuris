import { Link, useNavigate } from 'react-router-dom'
import { Menu, X, User, LogOut, Settings } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Logo } from '@/components/ui/Logo'
import { NotificationBadge } from '@/components/notifications/NotificationBadge'
import { useAuth } from '@/hooks/useAuth'
import { useState } from 'react'

export function Header() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <header className="bg-white shadow-sm border-b border-secondary-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/">
            <Logo size="md" showText={true} />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/contracts"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Contratos
            </Link>
            <Link
              to="/processes"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Processos
            </Link>
            <Link
              to="/clients"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Clientes
            </Link>
            <Link
              to="/suppliers"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Fornecedores
            </Link>
            <Link
              to="/editor"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Editor
            </Link>
            <Link
              to="/laws"
              className="text-secondary-600 hover:text-secondary-900 transition-colors"
            >
              Leis
            </Link>
          </nav>

          {/* User Menu */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <>
                <NotificationBadge />
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary-600" />
                  </div>
                  <div className="text-sm">
                    <p className="font-medium text-secondary-900">{user.name}</p>
                    <p className="text-secondary-500">
                      {user.plan === 'pro' ? 'Plano Pró' : 'Plano Comum'}
                    </p>
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/profile')}
                >
                  <Settings className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-secondary-200 py-4">
            <nav className="flex flex-col space-y-4">
              <Link
                to="/contracts"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Contratos
              </Link>
              <Link
                to="/processes"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Processos
              </Link>
              <Link
                to="/clients"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Clientes
              </Link>
              <Link
                to="/suppliers"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Fornecedores
              </Link>
              <Link
                to="/editor"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Editor
              </Link>
              <Link
                to="/laws"
                className="text-secondary-600 hover:text-secondary-900 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Leis
              </Link>
              {user && (
                <>
                  <div className="border-t border-secondary-200 pt-4">
                    <div className="flex items-center space-x-2 mb-4">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <User className="w-4 h-4 text-primary-600" />
                      </div>
                      <div className="text-sm">
                        <p className="font-medium text-secondary-900">{user.name}</p>
                        <p className="text-secondary-500">
                          {user.plan === 'pro' ? 'Plano Pró' : 'Plano Comum'}
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        navigate('/profile')
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <Settings className="w-4 h-4 mr-2" />
                      Perfil
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        handleLogout()
                        setIsMenuOpen(false)
                      }}
                      className="w-full justify-start"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sair
                    </Button>
                  </div>
                </>
              )}
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
