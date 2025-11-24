import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { ErrorBoundary } from '@/components/layout/ErrorBoundary'

const Login = React.lazy(() => import('@/pages/auth/Login').then(m => ({ default: m.Login })))
const Register = React.lazy(() => import('@/pages/auth/Register').then(m => ({ default: m.Register })))
const Dashboard = React.lazy(() => import('@/pages/Dashboard').then(m => ({ default: m.Dashboard })))
const ContractsList = React.lazy(() => import('@/pages/contracts/ContractsList').then(m => ({ default: m.ContractsList })))
const ContractForm = React.lazy(() => import('@/pages/contracts/ContractForm').then(m => ({ default: m.ContractForm })))
const ContractDetails = React.lazy(() => import('@/pages/contracts/ContractDetails').then(m => ({ default: m.ContractDetails })))
const ProcessesList = React.lazy(() => import('@/pages/processes/ProcessesList').then(m => ({ default: m.ProcessesList })))
const ProcessForm = React.lazy(() => import('@/pages/processes/ProcessForm').then(m => ({ default: m.ProcessForm })))
const ProcessDetails = React.lazy(() => import('@/pages/processes/ProcessDetails').then(m => ({ default: m.ProcessDetails })))
const ClientsList = React.lazy(() => import('@/pages/clients/ClientsList').then(m => ({ default: m.ClientsList })))
const ClientForm = React.lazy(() => import('@/pages/clients/ClientForm').then(m => ({ default: m.ClientForm })))
const ClientDetails = React.lazy(() => import('@/pages/clients/ClientDetails').then(m => ({ default: m.ClientDetails })))
const ClientFiles = React.lazy(() => import('@/pages/clients/ClientFiles').then(m => ({ default: m.ClientFiles })))
const SuppliersList = React.lazy(() => import('@/pages/suppliers/SuppliersList').then(m => ({ default: m.SuppliersList })))
const SupplierForm = React.lazy(() => import('@/pages/suppliers/SupplierForm').then(m => ({ default: m.SupplierForm })))
const SupplierDetails = React.lazy(() => import('@/pages/suppliers/SupplierDetails').then(m => ({ default: m.SupplierDetails })))
const LegalEditor = React.lazy(() => import('@/pages/editor/LegalEditor').then(m => ({ default: m.LegalEditor })))
const LawsLibrary = React.lazy(() => import('@/pages/laws/LawsLibrary').then(m => ({ default: m.LawsLibrary })))
const Profile = React.lazy(() => import('@/pages/profile/Profile').then(m => ({ default: m.Profile })))
const AdminDashboard = React.lazy(() => import('@/pages/admin/AdminDashboard').then(m => ({ default: m.AdminDashboard })))

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Suspense fallback={<div className="p-8 text-center text-secondary-600">Carregando...</div>}>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route
                path="/"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern','client'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <Dashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ContractsList />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/new"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ContractForm />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ContractDetails />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/contracts/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ContractForm isEdit />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/processes"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ProcessesList />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/processes/new"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ProcessForm />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/processes/:id"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ProcessDetails />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/processes/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ProcessForm isEdit />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ClientsList />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/new"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ClientForm />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/:id"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern','client'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ClientDetails />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ClientForm isEdit />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/clients/:id/files"
                element={
                  <ProtectedRoute allowedRoles={[
                    'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern','client'
                  ]}>
                    <ErrorBoundary>
                      <Layout>
                        <ClientFiles />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <SuppliersList />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/new"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <SupplierForm />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/:id"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <SupplierDetails />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/suppliers/:id/edit"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <SupplierForm isEdit />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <AdminDashboard />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/editor"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin','senior_lawyer','junior_lawyer','paralegal' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <LegalEditor />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/laws"
                element={
                  <ProtectedRoute allowedRoles={[ 'admin','senior_lawyer','junior_lawyer','paralegal','assistant','intern' ]}>
                    <ErrorBoundary>
                      <Layout>
                        <LawsLibrary />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <ErrorBoundary>
                      <Layout>
                        <Profile />
                      </Layout>
                    </ErrorBoundary>
                  </ProtectedRoute>
                }
              />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Suspense>
        </div>
      </Router>
      {import.meta.env.DEV && <ReactQueryDevtools initialIsOpen={false} />}
    </QueryClientProvider>
  )
}

export default App
