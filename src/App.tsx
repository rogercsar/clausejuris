import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Layout } from '@/components/layout/Layout'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'
import { Login } from '@/pages/auth/Login'
import { Register } from '@/pages/auth/Register'
import { Dashboard } from '@/pages/Dashboard'
import { ContractsList } from '@/pages/contracts/ContractsList'
import { ContractForm } from '@/pages/contracts/ContractForm'
import { ContractDetails } from '@/pages/contracts/ContractDetails'
import { ProcessesList } from '@/pages/processes/ProcessesList'
import { ProcessForm } from '@/pages/processes/ProcessForm'
import { ProcessDetails } from '@/pages/processes/ProcessDetails'
import { ClientsList } from '@/pages/clients/ClientsList'
import { ClientForm } from '@/pages/clients/ClientForm'
import { ClientDetails } from '@/pages/clients/ClientDetails'
import { ClientFiles } from '@/pages/clients/ClientFiles'
import { SuppliersList } from '@/pages/suppliers/SuppliersList'
import { SupplierForm } from '@/pages/suppliers/SupplierForm'
import { SupplierDetails } from '@/pages/suppliers/SupplierDetails'
import { LegalEditor } from '@/pages/editor/LegalEditor'
import { LawsLibrary } from '@/pages/laws/LawsLibrary'
import { Profile } from '@/pages/profile/Profile'

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="min-h-screen bg-secondary-50">
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected Routes */}
            <Route path="/" element={
              <ProtectedRoute>
                <Layout>
                  <Dashboard />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/contracts" element={
              <ProtectedRoute>
                <Layout>
                  <ContractsList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/contracts/new" element={
              <ProtectedRoute>
                <Layout>
                  <ContractForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/contracts/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ContractDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/contracts/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <ContractForm isEdit />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/processes" element={
              <ProtectedRoute>
                <Layout>
                  <ProcessesList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/processes/new" element={
              <ProtectedRoute>
                <Layout>
                  <ProcessForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/processes/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ProcessDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/processes/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <ProcessForm isEdit />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients" element={
              <ProtectedRoute>
                <Layout>
                  <ClientsList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients/new" element={
              <ProtectedRoute>
                <Layout>
                  <ClientForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients/:id" element={
              <ProtectedRoute>
                <Layout>
                  <ClientDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <ClientForm isEdit />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/clients/:id/files" element={
              <ProtectedRoute>
                <Layout>
                  <ClientFiles />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/suppliers" element={
              <ProtectedRoute>
                <Layout>
                  <SuppliersList />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/suppliers/new" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierForm />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/suppliers/:id" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierDetails />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/suppliers/:id/edit" element={
              <ProtectedRoute>
                <Layout>
                  <SupplierForm isEdit />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/editor" element={
              <ProtectedRoute>
                <Layout>
                  <LegalEditor />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/laws" element={
              <ProtectedRoute>
                <Layout>
                  <LawsLibrary />
                </Layout>
              </ProtectedRoute>
            } />
            
            <Route path="/profile" element={
              <ProtectedRoute>
                <Layout>
                  <Profile />
                </Layout>
              </ProtectedRoute>
            } />
            
            {/* Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </div>
      </Router>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
