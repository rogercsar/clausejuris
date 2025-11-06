import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { ContractDetails } from '@/pages/contracts/ContractDetails';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

const queryClient = new QueryClient();
import { vi } from 'vitest';

// Mock do useAuth
vi.mock('@/hooks/useAuth', () => ({
  useAuth: () => ({
    user: { plan: 'pro' },
  }),
}));

// Mock do useContracts
vi.mock('@/hooks/useContracts', () => ({
  useContracts: () => ({
    data: [{ id: '1', clientName: 'Test Client', description: 'Test Description', attachments: [] }],
  }),
}));

describe('ContractDetails', () => {
  it('deve exibir o modal de análise de IA ao clicar no botão', async () => {
    // Mock da resposta da API de análise
    server.use(
      http.post('/api/ai/analyze-document', (req) => {
        return HttpResponse.json({
          summary: 'Resumo do contrato',
          risks: [{ level: 'high', description: 'Risco alto' }],
          suggestions: ['Sugestão 1'],
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <MemoryRouter initialEntries={['/contracts/1']}>
          <Routes>
            <Route path="/contracts/:id" element={<ContractDetails />} />
          </Routes>
        </MemoryRouter>
      </QueryClientProvider>
    );

    // Aguarda o carregamento dos detalhes do contrato
    await screen.findByText('Informações do Contrato');

    const analyzeButton = screen.getByText('Analisar com IA');
    fireEvent.click(analyzeButton);

    await screen.findByText('Análise de IA');
    expect(screen.getByText('Resumo do contrato')).toBeInTheDocument();
    expect(screen.getByText('Risco alto')).toBeInTheDocument();
    expect(screen.getByText('Sugestão 1')).toBeInTheDocument();
  });
});
