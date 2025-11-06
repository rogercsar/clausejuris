import React, { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { CheckCircle } from 'lucide-react';

// Mock da função que cria a preferência no backend
const createPreference = async (plan: 'common' | 'pro') => {
  const response = await fetch('/api/subscription/create-preference', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ plan }),
  });

  if (!response.ok) {
    throw new Error('Erro ao criar preferência de pagamento');
  }

  const data = await response.json();
  return data;
};

const SubscriptionPage = () => {
  const mutation = useMutation({
    mutationFn: createPreference,
    onSuccess: (data) => {
      // Redireciona o usuário para o checkout do Mercado Pago
      window.location.href = data.init_point;
    },
    onError: (error) => {
      // Exibir uma notificação de erro
      console.error('Erro ao processar pagamento:', error);
      alert('Não foi possível iniciar o processo de pagamento. Tente novamente.');
    },
  });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center">Nossos Planos</h1>
      <p className="text-center text-lg text-gray-600 mb-10">
        Escolha o plano que melhor se adapta às suas necessidades e comece a transformar sua gestão jurídica.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Plano Comum */}
        <Card className={`flex flex-col ${mutation.variables === 'common' ? 'border-primary' : ''}`}>
          <CardHeader>
            <CardTitle>Plano Comum</CardTitle>
            <CardDescription>Para advogados autônomos e pequenos escritórios.</CardDescription>
            <div className="text-3xl font-bold my-4">
              R$ 30 <span className="text-lg font-normal">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Gestão de Contratos (Básico)</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Gestão de Processos</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Editor Jurídico Padrão</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Suporte por Email</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => mutation.mutateAsync('common')}
              disabled={mutation.isLoading && mutation.variables === 'common'}
            >
              {mutation.isLoading && mutation.variables === 'common' ? 'Processando...' : 'Assinar Agora'}
            </Button>
          </CardFooter>
        </Card>

        {/* Plano Pró */}
        <Card className={`flex flex-col ${mutation.variables === 'pro' ? 'border-primary' : ''}`}>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Plano Pró</CardTitle>
              <Badge variant="default">Recomendado</Badge>
            </div>
            <CardDescription>Para escritórios que buscam máxima eficiência e tecnologia.</CardDescription>
            <div className="text-3xl font-bold my-4">
              R$ 80 <span className="text-lg font-normal">/mês</span>
            </div>
          </CardHeader>
          <CardContent className="flex-grow">
            <ul className="space-y-3">
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Todas as funcionalidades do Plano Comum</li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> <strong>Editor Jurídico com IA</strong></li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> <strong>Análise de Documentos com IA</strong></li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> <strong>Vade Mecum Inteligente</strong></li>
              <li className="flex items-center"><CheckCircle className="h-5 w-5 text-green-500 mr-2" /> Suporte Prioritário</li>
            </ul>
          </CardContent>
          <CardFooter>
            <Button
              className="w-full"
              onClick={() => mutation.mutateAsync('pro')}
              disabled={mutation.isLoading && mutation.variables === 'pro'}
            >
              {mutation.isLoading && mutation.variables === 'pro' ? 'Processando...' : 'Assinar Agora'}
            </Button>
          </CardFooter>
        </Card>
      </div>

      {mutation.isError && (
        <div className="text-center text-red-500 mt-6">
          <p>Ocorreu um erro ao tentar processar sua assinatura. Por favor, tente novamente.</p>
        </div>
      )}
    </div>
  );
};

export default SubscriptionPage;
