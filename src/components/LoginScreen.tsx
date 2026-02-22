import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Agente } from '@/types/rt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { User, LogIn } from 'lucide-react';

interface LoginScreenProps {
  agentes: Agente[];
}

export const LoginScreen = ({ agentes }: LoginScreenProps) => {
  const { login } = useAuth();
  const [selectedAgente, setSelectedAgente] = useState<Agente | null>(null);

  const handleLogin = () => {
    if (selectedAgente) {
      login(selectedAgente);
    }
  };

  const agentesAtivos = agentes.filter(a => a.ativo);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
            <User className="w-6 h-6 text-blue-600" />
          </div>
          <CardTitle className="text-2xl">Sistema SBMIBZ</CardTitle>
          <p className="text-muted-foreground">Selecione seu agente para continuar</p>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <p className="text-sm font-medium">Agentes Disponíveis:</p>
            <div className="space-y-2 max-h-64 overflow-y-auto">
              {agentesAtivos.map((agente) => (
                <div
                  key={agente.id}
                  className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                    selectedAgente?.id === agente.id
                      ? 'border-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedAgente(agente)}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{agente.nome}</span>
                    <Badge variant="outline">Ativo</Badge>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Button 
            onClick={handleLogin}
            disabled={!selectedAgente}
            className="w-full"
          >
            <LogIn className="w-4 h-4 mr-2" />
            Entrar como {selectedAgente?.nome || '...'}
          </Button>

          {agentesAtivos.length === 0 && (
            <div className="text-center py-4">
              <p className="text-muted-foreground">
                Nenhum agente ativo encontrado. Entre em contato com o administrador.
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
