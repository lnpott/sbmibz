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
    formatted: string;
  };
  onIncrementVersion: () => void;
}

export const ConfiguracoesHeader = ({
  currentAgente,
  versionInfo,
  onIncrementVersion
}: ConfiguracoesHeaderProps) => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
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
        
        <div className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          <h1 className="text-2xl font-bold">Configurações</h1>
        </div>
      </div>

      <div className="flex items-center gap-4">
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
            onClick={onIncrementVersion}
            title="Incrementar versão manualmente"
          >
            <Zap className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="destructive" size="sm" onClick={handleLogout}>
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </div>
    </div>
  );
};
