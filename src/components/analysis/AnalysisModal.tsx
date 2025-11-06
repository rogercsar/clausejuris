import React from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { X, Zap } from 'lucide-react';

interface AnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  analysisResult: {
    summary: string;
    risks: { level: string; description: string }[];
    suggestions: string[];
  } | null;
}

export const AnalysisModal = ({ isOpen, onClose, analysisResult }: AnalysisModalProps) => {
  if (!isOpen || !analysisResult) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-6 w-6 text-primary" />
              <CardTitle>Análise de IA</CardTitle>
            </div>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <h3 className="font-semibold mb-2">Resumo</h3>
            <p className="text-sm text-gray-600">{analysisResult.summary}</p>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Riscos Identificados</h3>
            <ul className="space-y-2">
              {analysisResult.risks.map((risk, index) => (
                <li key={index} className="flex items-start">
                  <span className={`text-xs font-semibold uppercase mr-2 ${risk.level === 'high' ? 'text-red-500' : 'text-yellow-500'}`}>
                    {risk.level}
                  </span>
                  <p className="text-sm text-gray-600">{risk.description}</p>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Sugestões</h3>
            <ul className="space-y-2 list-disc list-inside">
              {analysisResult.suggestions.map((suggestion, index) => (
                <li key={index} className="text-sm text-gray-600">{suggestion}</li>
              ))}
            </ul>
          </div>

          <div className="text-center pt-4">
            <Button onClick={onClose}>Fechar</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
