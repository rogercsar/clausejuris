import { render, screen, fireEvent } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { LawsLibrary } from '@/pages/laws/LawsLibrary';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

const queryClient = new QueryClient();

describe('LawsLibrary', () => {
  it('deve acionar a busca com IA ao pressionar Enter', async () => {
    // Mock da resposta da API de IA
    server.use(
      http.post('/api/ai/vademecum-query', (req) => {
        return HttpResponse.json({
          results: [
            { law: 'Código Civil', article: 'Art. 1.723', summary: 'Define a união estável...', relevance: 0.95 },
          ],
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <LawsLibrary />
      </QueryClientProvider>
    );

    const searchInput = screen.getByPlaceholderText('Pesquisar leis e artigos... (Pressione Enter para busca com IA)');
    fireEvent.change(searchInput, { target: { value: 'união estável' } });
    fireEvent.keyDown(searchInput, { key: 'Enter', code: 'Enter' });

    await screen.findByText('Resultados da Busca com IA');
    expect(screen.getByText('Código Civil - Art. 1.723')).toBeInTheDocument();
  });
});
