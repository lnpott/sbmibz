import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RT, StatusRT, NaturezaRT, Coletor } from '@/types/rt';
import { toast } from 'sonner';

export const useRTs = () => {
  const queryClient = useQueryClient();

  const { data: rts = [], isLoading } = useQuery({
    queryKey: ['rts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rts')
        .select(`
          *,
          coletor:coletores(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as RT[];
    },
  });

  const { data: coletores = [] } = useQuery({
    queryKey: ['coletores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coletores')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Coletor[];
    },
  });

  const addRTMutation = useMutation({
    mutationFn: async (rt: {
      numero: string;
      natureza: NaturezaRT;
      origem: string;
      destino: string;
      programacao?: string;
      peso: number;
      valor: number;
    }) => {
      const { data, error } = await supabase
        .from('rts')
        .insert({
          numero: rt.numero,
          natureza: rt.natureza,
          origem: rt.origem,
          destino: rt.destino,
          programacao: rt.programacao || null,
          peso: rt.peso,
          valor: rt.valor,
        })
        .select()
        .single();
      
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT cadastrada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar RT: ${error.message}`);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      coletorId 
    }: { 
      id: string; 
      status: StatusRT; 
      coletorId?: string;
    }) => {
      const updates: Record<string, unknown> = { status };
      
      if (status === 'coletada') {
        updates.coletada_em = new Date().toISOString();
        if (coletorId) {
          updates.coletor_id = coletorId;
        }
      } else if (status === 'despachada') {
        updates.despachada_em = new Date().toISOString();
      }

      const { error } = await supabase
        .from('rts')
        .update(updates)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      const statusMessages: Record<StatusRT, string> = {
        pendente: 'RT marcada como pendente!',
        coletada: 'RT marcada como coletada!',
        despachada: 'RT marcada como despachada!',
      };
      toast.success(statusMessages[variables.status]);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
  });

  const addColetorMutation = useMutation({
    mutationFn: async (coletor: {
      nome: string;
      cpf: string;
      telefone?: string;
      email?: string;
    }) => {
      const { data, error } = await supabase
        .from('coletores')
        .insert(coletor)
        .select()
        .single();
      
      if (error) throw error;
      return data as Coletor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Coletor cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar coletor: ${error.message}`);
    },
  });

  const deleteRTMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rts')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT excluída com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao excluir RT: ${error.message}`);
    },
  });

  const updateRTMutation = useMutation({
    mutationFn: async ({ 
      id, 
      data, 
      motivo,
      dadosAnteriores 
    }: { 
      id: string; 
      data: {
        numero: string;
        natureza: NaturezaRT;
        origem: string;
        destino: string;
        programacao?: string;
        peso: number;
        valor: number;
      };
      motivo: string;
      dadosAnteriores: RT;
    }) => {
      // Atualiza a RT
      const { error: updateError } = await supabase
        .from('rts')
        .update({
          numero: data.numero,
          natureza: data.natureza,
          origem: data.origem,
          destino: data.destino,
          programacao: data.programacao || null,
          peso: data.peso,
          valor: data.valor,
        })
        .eq('id', id);
      
      if (updateError) throw updateError;

      // Registra a edição
      const { error: logError } = await supabase
        .from('rt_edicoes')
        .insert({
          rt_id: id,
          motivo: motivo,
          dados_anteriores: {
            numero: dadosAnteriores.numero,
            natureza: dadosAnteriores.natureza,
            origem: dadosAnteriores.origem,
            destino: dadosAnteriores.destino,
            programacao: dadosAnteriores.programacao,
            peso: dadosAnteriores.peso,
            valor: dadosAnteriores.valor,
          },
          dados_novos: data,
        });
      
      if (logError) throw logError;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT atualizada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar RT: ${error.message}`);
    },
  });

  const searchRTs = (query: string): RT[] => {
    if (!query.trim()) return rts;
    
    const lowerQuery = query.toLowerCase();
    return rts.filter(rt => 
      rt.numero.toLowerCase().includes(lowerQuery) ||
      rt.origem.toLowerCase().includes(lowerQuery) ||
      rt.destino.toLowerCase().includes(lowerQuery) ||
      rt.status.toLowerCase().includes(lowerQuery) ||
      rt.natureza.toLowerCase().includes(lowerQuery) ||
      (rt.coletor?.nome?.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    rts,
    coletores,
    isLoading,
    addRT: addRTMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    addColetor: addColetorMutation.mutateAsync,
    deleteRT: deleteRTMutation.mutateAsync,
    updateRT: updateRTMutation.mutateAsync,
    searchRTs,
  };
};
