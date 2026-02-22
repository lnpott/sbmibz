import { ReactNode } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { LoginScreen } from '@/components/LoginScreen';
import { useRTData } from '@/hooks/useRTData';

interface ProtectedRouteProps {
  children: ReactNode;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isAuthenticated } = useAuth();
  
  // Só carrega agentes quando NÃO estiver autenticado (para a tela de login)
  const { agentes } = useRTData();

  if (!isAuthenticated) {
    return <LoginScreen agentes={agentes} />;
  }

  return <>{children}</>;
};
