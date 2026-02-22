import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Agente } from '@/types/rt';

interface AuthContextType {
  currentAgente: Agente | null;
  login: (agente: Agente) => void;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [currentAgente, setCurrentAgente] = useState<Agente | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Carregar agente salvo do localStorage na montagem
  useEffect(() => {
    try {
      const savedAgente = localStorage.getItem('agente_selecionado');
      if (savedAgente) {
        const agente = JSON.parse(savedAgente);
        setCurrentAgente(agente);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Erro ao carregar agente salvo:', error);
      localStorage.removeItem('agente_selecionado');
    }
  }, []);

  const login = (agente: Agente) => {
    setCurrentAgente(agente);
    setIsAuthenticated(true);
    localStorage.setItem('agente_selecionado', JSON.stringify(agente));
  };

  const logout = () => {
    setCurrentAgente(null);
    setIsAuthenticated(false);
    localStorage.removeItem('agente_selecionado');
  };

  return (
    <AuthContext.Provider value={{
      currentAgente,
      login,
      logout,
      isAuthenticated
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
