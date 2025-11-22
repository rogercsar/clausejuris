import { describe, it, expect } from 'vitest'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import { render, screen } from '@testing-library/react'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { useAuthStore } from '@/store/auth'

function TestPage() {
  return <div>Conteúdo Protegido</div>
}

describe('ProtectedRoute', () => {
  it('redireciona não autenticado para /login', () => {
    useAuthStore.getState().logout()
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<div>Login</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.queryByText('Conteúdo Protegido')).toBeNull()
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('permite acesso quando autenticado', () => {
    useAuthStore.getState().login({
      id: 'u1', email: 'u@x.com', name: 'User', fullName: 'User Test', plan: 'common', createdAt: '', updatedAt: ''
    } as any, 'token')
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute>
              <TestPage />
            </ProtectedRoute>
          } />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.getByText('Conteúdo Protegido')).toBeInTheDocument()
  })

  it('bloqueia quando papel não permitido', () => {
    useAuthStore.getState().login({
      id: 'u2', email: 'u@x.com', name: 'User', fullName: 'User Test', plan: 'common', createdAt: '', updatedAt: '', role: 'junior_lawyer'
    } as any, 'token')
    render(
      <MemoryRouter initialEntries={["/"]}>
        <Routes>
          <Route path="/" element={
            <ProtectedRoute allowedRoles={["admin"]}>
              <TestPage />
            </ProtectedRoute>
          } />
          <Route path="/" element={<div>Dashboard</div>} />
        </Routes>
      </MemoryRouter>
    )
    expect(screen.queryByText('Conteúdo Protegido')).toBeNull()
  })
})