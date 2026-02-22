import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RT, NaturezaRT, ClassificacaoCarga, Coletor, Empresa, Local, Agente, StatusRT } from '@/types/rt';
import { toast } from 'sonner';

// Tipos específicos para as mutations
type UpdateRTData = {
  numero?: string;
  natureza?: NaturezaRT;
  descricao?: string;
  classificacao?: ClassificacaoCarga;
  origem?: string;
  origem_id?: string;
  destino?: string;
  destino_id?: string;
  programacao?: string;
  data_recebimento_base?: string;
  data_prevista_despacho?: string;
  peso?: number;
  valor?: number;
  agente_id?: string;
  entregador_id?: string;
  coletor_id?: string;
  cia_aerea?: string;
  numero_voo?: string;
  observacao_despacho?: string;
  status?: StatusRT;
  coletada_em?: string;
  despachada_em?: string;
};

type UpdateColetorData = {
  nome?: string;
  cpf?: string;
  telefone?: string;
  email?: string;
  empresa_id?: string;
};

export const useRTMutations = () => {
  const queryClient = useQueryClient();

  const addRTMutation = useMutation({
    mutationFn: async (rt: {
      numero: string;
      natureza: NaturezaRT;
      descricao?: string;
      classificacao: ClassificacaoCarga;
      origem: string;
      origem_id?: string;
      destino: string;
      destino_id?: string;
      programacao?: string;
      data_recebimento_base?: string;
      data_prevista_despacho?: string;
      peso: number;
      valor: number;
      agente_id?: string;
      entregador_id?: string;
      cia_aerea?: string;
      numero_voo?: string;
      observacao_despacho?: string;
    }) => {
      const { data, error } = await supabase
        .from('rts')
        .insert([{
          numero: rt.numero,
          natureza: rt.natureza,
          descricao: rt.descricao,
          classificacao: rt.classificacao,
          origem: rt.origem,
          origem_id: rt.origem_id,
          destino: rt.destino,
          destino_id: rt.destino_id,
          programacao: rt.programacao,
          data_recebimento_base: rt.data_recebimento_base,
          data_prevista_despacho: rt.data_prevista_despacho,
          peso: rt.peso,
          valor: rt.valor,
          agente_id: rt.agente_id,
          entregador_id: rt.entregador_id,
          cia_aerea: rt.cia_aerea,
          numero_voo: rt.numero_voo,
          observacao_despacho: rt.observacao_despacho,
        }])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT criada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao criar RT: ' + error.message);
    },
  });

  const updateRTMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateRTData }) => {
      const { data: updatedRT, error } = await supabase
        .from('rts')
        .update(data as any) // Type assertion necessária devido a limitações do Supabase
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedRT;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT atualizada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar RT: ' + error.message);
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: 'pendente' | 'coletada' | 'despachada' | 'embarque_cancelado' | 'coleta_cancelada' }) => {
      const updateData: { status: string; coletada_em?: string; despachada_em?: string } = { status };
      
      if (status === 'coletada') {
        updateData.coletada_em = new Date().toISOString();
      } else if (status === 'despachada') {
        updateData.despachada_em = new Date().toISOString();
      }

      const { data, error } = await supabase
        .from('rts')
        .update(updateData as any) // Type assertion necessária devido a limitações do Supabase
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('Status atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar status: ' + error.message);
    },
  });

  const addColetorMutation = useMutation({
    mutationFn: async (coletor: {
      nome: string;
      cpf: string;
      telefone?: string;
      email?: string;
      empresa_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('coletores')
        .insert([coletor])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Coletor adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar coletor: ' + error.message);
    },
  });

  const updateColetorMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Coletor> }) => {
      const { data: updatedColetor, error } = await supabase
        .from('coletores')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return updatedColetor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Coletor atualizado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao atualizar coletor: ' + error.message);
    },
  });

  const addEmpresaMutation = useMutation({
    mutationFn: async (empresa: { nome: string }) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert([empresa])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa adicionada com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar empresa: ' + error.message);
    },
  });

  const addLocalMutation = useMutation({
    mutationFn: async (local: { codigo: string; descricao?: string }) => {
      const { data, error } = await supabase
        .from('locais')
        .insert([local])
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais'] });
      toast.success('Local adicionado com sucesso!');
    },
    onError: (error) => {
      toast.error('Erro ao adicionar local: ' + error.message);
    },
  });

  const findColetorByCPFMutation = useMutation({
    mutationFn: async (cpf: string) => {
      const { data, error } = await supabase
        .from('coletores')
        .select('*')
        .eq('cpf', cpf)
        .single();

      if (error && error.code !== 'PGRST116') {
        throw error;
      }
      return data;
    },
  });

  return {
    // Mutations
    addRT: addRTMutation.mutateAsync,
    updateRT: updateRTMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    addColetor: addColetorMutation.mutateAsync,
    updateColetor: updateColetorMutation.mutateAsync,
    addEmpresa: addEmpresaMutation.mutateAsync,
    addLocal: addLocalMutation.mutateAsync,
    findColetorByCPF: findColetorByCPFMutation.mutateAsync,
    
    // Loading states
    isAddingRT: addRTMutation.isPending,
    isUpdatingRT: updateRTMutation.isPending,
    isUpdatingStatus: updateStatusMutation.isPending,
    isAddingColetor: addColetorMutation.isPending,
    isUpdatingColetor: updateColetorMutation.isPending,
    isAddingEmpresa: addEmpresaMutation.isPending,
    isAddingLocal: addLocalMutation.isPending,
    isFindingColetor: findColetorByCPFMutation.isPending,
  };
};
