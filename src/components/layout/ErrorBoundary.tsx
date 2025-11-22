import React from 'react'
import { Button } from '@/components/ui/Button'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
}

export class ErrorBoundary extends React.Component<React.PropsWithChildren, ErrorBoundaryState> {
  state: ErrorBoundaryState = { hasError: false }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(_error: Error) {}

  handleReload = () => {
    this.setState({ hasError: false, error: undefined })
    window.location.reload()
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="max-w-2xl mx-auto p-8">
          <div className="bg-white border border-secondary-200 rounded-lg p-6 text-center">
            <h2 className="text-xl font-semibold text-secondary-900 mb-2">Algo deu errado</h2>
            <p className="text-secondary-600 mb-4">Tente recarregar a página ou voltar ao início.</p>
            {import.meta.env.DEV && this.state.error && (
              <div className="text-sm text-red-700 bg-red-50 border border-red-200 rounded-md p-3 mb-4">
                {String(this.state.error.message || this.state.error)}
              </div>
            )}
            <div className="flex items-center justify-center gap-3">
              <Button onClick={this.handleReload}>Recarregar</Button>
              <Button variant="secondary" onClick={() => (window.location.href = '/')}>Ir para Dashboard</Button>
            </div>
          </div>
        </div>
      )
    }
    return this.props.children
  }
}