import React from 'react';
import { Agente } from '@/types/rt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, LogOut, Zap, Settings } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

interface ConfiguracoesHeaderProps {
  currentAgente: Agente | null;
  versionInfo: {
    version: string;
    major: string;
    timestamp: string;
    buildNumber: number;
    formatted: string;
    description: string;
    createdAt: string;
  };
}

export const ConfiguracoesHeader = ({ currentAgente, versionInfo }: ConfiguracoesHeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-4">
        <Link to="/">
          <Button variant="outline" size="sm">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
        </Link>
        
        {currentAgente && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-muted-foreground">Agente:</span>
            <Badge variant="outline">{currentAgente.nome}</Badge>
          </div>
        )}
        
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Versão:</span>
          <Badge variant="secondary">{versionInfo.formatted}</Badge>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.location.reload()}
          >
            <Zap className="h-4 w-4 mr-2" />
            Atualizar
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
        
        <Link to="/configuracoes">
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4 mr-2" />
            Configurações
          </Button>
        </Link>
      </div>
    </div>
  );
};
