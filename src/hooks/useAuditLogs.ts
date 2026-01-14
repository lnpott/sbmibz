import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { AuditLog, AcaoAudit } from '@/types/audit';
import { Json } from '@/integrations/supabase/types';

export const useAuditLogs = () => {
  const queryClient = useQueryClient();

  const { data: logs = [], isLoading } = useQuery({
    queryKey: ['audit_logs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('audit_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(500);
      
      if (error) throw error;
      return data as AuditLog[];
    },
  });

  const addLogMutation = useMutation({
    mutationFn: async (log: {
      tabela: string;
      registro_id: string;
      acao: AcaoAudit;
      dados_anteriores?: Record<string, unknown>;
      dados_novos?: Record<string, unknown>;
      descricao?: string;
      usuario?: string;
    }) => {
      const { data, error } = await supabase
        .from('audit_logs')
        .insert({
          tabela: log.tabela,
          registro_id: log.registro_id,
          acao: log.acao,
          dados_anteriores: log.dados_anteriores as Json,
          dados_novos: log.dados_novos as Json,
          descricao: log.descricao,
          usuario: log.usuario,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data as AuditLog;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['audit_logs'] });
    },
  });

  return {
    logs,
    isLoading,
    addLog: addLogMutation.mutateAsync,
  };
};
