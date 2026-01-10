import { useState, useCallback } from 'react';
import { RT, RTStatus } from '@/types/rt';

const STORAGE_KEY = 'rts-data';

const loadRTs = (): RT[] => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      return parsed.map((rt: RT) => ({
        ...rt,
        criadoEm: new Date(rt.criadoEm),
        retiradaEm: rt.retiradaEm ? new Date(rt.retiradaEm) : undefined,
        despachadaEm: rt.despachadaEm ? new Date(rt.despachadaEm) : undefined,
      }));
    }
  } catch (error) {
    console.error('Erro ao carregar RTs:', error);
  }
  return [];
};

const saveRTs = (rts: RT[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(rts));
};

export const useRTs = () => {
  const [rts, setRTs] = useState<RT[]>(loadRTs);

  const addRT = useCallback((rt: Omit<RT, 'id' | 'status' | 'criadoEm'>) => {
    const newRT: RT = {
      ...rt,
      id: crypto.randomUUID(),
      status: 'pendente',
      criadoEm: new Date(),
    };
    
    setRTs(prev => {
      const updated = [newRT, ...prev];
      saveRTs(updated);
      return updated;
    });
    
    return newRT;
  }, []);

  const updateStatus = useCallback((id: string, status: RTStatus) => {
    setRTs(prev => {
      const updated = prev.map(rt => {
        if (rt.id === id) {
          const updates: Partial<RT> = { status };
          if (status === 'retirada') {
            updates.retiradaEm = new Date();
          } else if (status === 'despachada') {
            updates.despachadaEm = new Date();
          }
          return { ...rt, ...updates };
        }
        return rt;
      });
      saveRTs(updated);
      return updated;
    });
  }, []);

  const searchRTs = useCallback((query: string): RT[] => {
    if (!query.trim()) return rts;
    
    const lowerQuery = query.toLowerCase();
    return rts.filter(rt => 
      rt.numero.toLowerCase().includes(lowerQuery) ||
      rt.origem.toLowerCase().includes(lowerQuery) ||
      rt.destino.toLowerCase().includes(lowerQuery) ||
      rt.programacao.toLowerCase().includes(lowerQuery) ||
      rt.peso.toString().includes(lowerQuery) ||
      rt.valor.toString().includes(lowerQuery) ||
      rt.status.toLowerCase().includes(lowerQuery)
    );
  }, [rts]);

  const deleteRT = useCallback((id: string) => {
    setRTs(prev => {
      const updated = prev.filter(rt => rt.id !== id);
      saveRTs(updated);
      return updated;
    });
  }, []);

  return {
    rts,
    addRT,
    updateStatus,
    searchRTs,
    deleteRT,
  };
};
