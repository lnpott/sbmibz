import { useAuth } from '@/contexts/AuthContext';
import { Agente } from '@/types/rt';

export const useCurrentAgente = (agentesDisponiveis: Agente[]): Agente | null => {
  const { currentAgente, isAuthenticated } = useAuth();
  
  // Se não estiver autenticado ou não houver agente, retorna null
  if (!isAuthenticated || !currentAgente) {
    return null;
  }

  // Verifica se o agente atual ainda existe na lista de agentes disponíveis
  const agenteValido = agentesDisponiveis.find(a => a.id === currentAgente.id);
  
  // Se o agente não existir mais ou estiver inativo, faz logout
  if (!agenteValido || !agenteValido.ativo) {
    // Isso será tratado pelo componente que usa o hook
    return null;
  }

  return agenteValido;
};
