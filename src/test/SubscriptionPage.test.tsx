import { render, screen, fireEvent, within, act } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';
import { server } from '@/mocks/server';
import { http, HttpResponse } from 'msw';

const queryClient = new QueryClient();

describe('SubscriptionPage', () => {
  beforeAll(() => {
    // Mock da URL base para o jsdom
    global.window.location.href = 'http://localhost:3000';
  });

  it('deve renderizar os planos Comum e Pró', () => {
    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionPage />
      </QueryClientProvider>
    );

    expect(screen.getByText('Plano Comum')).toBeInTheDocument();
    expect(screen.getByText('Plano Pró')).toBeInTheDocument();
  });

  it('deve iniciar o fluxo de pagamento ao selecionar um plano', async () => {
    // Mock do window.location.href
    const location = window.location;
    delete (window as any).location;
    window.location = { ...location, href: '' };

    // Mock da resposta da API de pagamento
    server.use(
      http.post('/api/subscription/create-preference', (req) => {
        return HttpResponse.json({
          init_point: 'https://mercadopago.com.br/checkout/v1/redirect?pref_id=mock_pref_pro',
        });
      })
    );

    render(
      <QueryClientProvider client={queryClient}>
        <SubscriptionPage />
      </QueryClientProvider>
    );

    // Simula a seleção do Plano Pró
    const proPlanCard = screen.getByText('Plano Pró').closest('.border');
    if (!proPlanCard) throw new Error('Card do Plano Pró não encontrado');
    const proPlanButton = within(proPlanCard).getByText('Assinar Agora');

    await act(async () => {
      await fireEvent.click(proPlanButton);
    });

    // Verifica se o redirecionamento para o Mercado Pago foi chamado
    expect(await screen.findByText('Processando...')).toBeInTheDocument();
    expect(window.location.href).toBe('https://mercadopago.com.br/checkout/v1/redirect?pref_id=mock_pref_pro');

    // Restaura o window.location
    window.location = location;
  });
});
