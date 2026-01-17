import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RT, StatusRT, NaturezaRT, ClassificacaoCarga, Coletor, Local, Agente, Empresa } from '@/types/rt';
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
          coletor:coletores!rts_coletor_id_fkey(*),
          entregador:coletores!rts_entregador_id_fkey(*),
          agente:agentes(*)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as RT[];
    },
  });

  const { data: coletores = [] } = useQuery({
    queryKey: ['coletores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coletores')
        .select(`
          *,
          empresa:empresas(*)
        `)
        .order('nome');
      
      if (error) throw error;
      return data as unknown as Coletor[];
    },
  });

  const { data: locais = [] } = useQuery({
    queryKey: ['locais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locais')
        .select('*')
        .order('codigo');
      
      if (error) throw error;
      return data as Local[];
    },
  });

  const { data: agentes = [] } = useQuery({
    queryKey: ['agentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agentes')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Agente[];
    },
  });

  const agentesAtivos = agentes.filter(a => a.ativo);

  const { data: empresas = [] } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select('*')
        .order('nome');
      
      if (error) throw error;
      return data as Empresa[];
    },
  });

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
      rt_origem_transbordo_id?: string;
    }) => {
      const { data, error } = await supabase
        .from('rts')
        .insert({
          numero: rt.numero,
          natureza: rt.natureza,
          descricao: rt.descricao || null,
          classificacao: rt.classificacao,
          origem: rt.origem,
          origem_id: rt.origem_id || null,
          destino: rt.destino,
          destino_id: rt.destino_id || null,
          programacao: rt.programacao || null,
          data_recebimento_base: rt.data_recebimento_base || null,
          data_prevista_despacho: rt.data_prevista_despacho || null,
          peso: rt.peso,
          valor: rt.valor,
          agente_id: rt.agente_id || null,
          entregador_id: rt.entregador_id || null,
          rt_origem_transbordo_id: rt.rt_origem_transbordo_id || null,
        })
        .select(`
          *,
          agente:agentes(*)
        `)
        .single();
      
      if (error) throw error;
      return data as unknown as RT;
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
      coletorId,
      entregadorId,
      cia_aerea,
      numero_voo,
      observacao_despacho,
    }: { 
      id: string; 
      status: StatusRT; 
      coletorId?: string;
      entregadorId?: string;
      cia_aerea?: string;
      numero_voo?: string;
      observacao_despacho?: string;
    }) => {
      const updates: Record<string, unknown> = { status };
      
      if (status === 'coletada') {
        updates.coletada_em = new Date().toISOString();
        if (coletorId) {
          updates.coletor_id = coletorId;
        }
      } else if (status === 'despachada') {
        updates.despachada_em = new Date().toISOString();
        if (entregadorId) {
          updates.entregador_id = entregadorId;
        }
        if (cia_aerea) {
          updates.cia_aerea = cia_aerea;
        }
        if (numero_voo) {
          updates.numero_voo = numero_voo;
        }
        if (observacao_despacho) {
          updates.observacao_despacho = observacao_despacho;
        }
      } else if (status === 'pendente') {
        // Ao reverter para pendente, limpar dados de coleta/despacho
        updates.coletada_em = null;
        updates.coletor_id = null;
        updates.despachada_em = null;
        updates.cia_aerea = null;
        updates.numero_voo = null;
        updates.observacao_despacho = null;
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
        pendente: 'RT retornada para pendente!',
        coletada: 'RT marcada como coletada!',
        despachada: 'RT marcada como despachada!',
      };
      toast.success(statusMessages[variables.status]);
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar status: ${error.message}`);
    },
  });

  const revertToColetadaMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('rts')
        .update({
          status: 'coletada',
          despachada_em: null,
          cia_aerea: null,
          numero_voo: null,
          observacao_despacho: null,
        })
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rts'] });
      toast.success('RT retornada para coletada!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao reverter status: ${error.message}`);
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
        .insert(coletor)
        .select(`
          *,
          empresa:empresas(*)
        `)
        .single();
      
      if (error) throw error;
      return data as unknown as Coletor;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Pessoa cadastrada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar: ${error.message}`);
    },
  });

  const updateColetorMutation = useMutation({
    mutationFn: async ({ 
      id, 
      data 
    }: { 
      id: string; 
      data: {
        nome?: string;
        telefone?: string;
        email?: string;
        empresa_id?: string;
      };
    }) => {
      const { error } = await supabase
        .from('coletores')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Dados atualizados!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar: ${error.message}`);
    },
  });

  const addEmpresaMutation = useMutation({
    mutationFn: async (empresa: { nome: string }) => {
      const { data, error } = await supabase
        .from('empresas')
        .insert(empresa)
        .select()
        .single();
      
      if (error) throw error;
      return data as Empresa;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa cadastrada com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar empresa: ${error.message}`);
    },
  });

  const addLocalMutation = useMutation({
    mutationFn: async (local: { codigo: string; descricao?: string }) => {
      const { data, error } = await supabase
        .from('locais')
        .insert(local)
        .select()
        .single();
      
      if (error) throw error;
      return data as Local;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais'] });
      toast.success('Local cadastrado com sucesso!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar local: ${error.message}`);
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
        numeros_anteriores?: string[];
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
      };
      motivo: string;
      dadosAnteriores: RT;
    }) => {
      const { error: updateError } = await supabase
        .from('rts')
        .update({
          numero: data.numero,
          numeros_anteriores: data.numeros_anteriores || [],
          natureza: data.natureza,
          descricao: data.descricao || null,
          classificacao: data.classificacao,
          origem: data.origem,
          origem_id: data.origem_id || null,
          destino: data.destino,
          destino_id: data.destino_id || null,
          programacao: data.programacao || null,
          data_recebimento_base: data.data_recebimento_base || null,
          data_prevista_despacho: data.data_prevista_despacho || null,
          peso: data.peso,
          valor: data.valor,
        })
        .eq('id', id);
      
      if (updateError) throw updateError;

      const { error: logError } = await supabase
        .from('rt_edicoes')
        .insert({
          rt_id: id,
          motivo: motivo,
          dados_anteriores: {
            numero: dadosAnteriores.numero,
            numeros_anteriores: dadosAnteriores.numeros_anteriores,
            natureza: dadosAnteriores.natureza,
            descricao: dadosAnteriores.descricao,
            classificacao: dadosAnteriores.classificacao,
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

  const findColetorByCPF = (cpf: string): Coletor | undefined => {
    const normalizedCPF = cpf.replace(/\D/g, '');
    return coletores.find(c => c.cpf.replace(/\D/g, '') === normalizedCPF);
  };

  const searchRTs = (query: string): RT[] => {
    if (!query.trim()) return rts;
    
    const lowerQuery = query.toLowerCase();
    return rts.filter(rt => 
      rt.numero.toLowerCase().includes(lowerQuery) ||
      rt.origem.toLowerCase().includes(lowerQuery) ||
      rt.destino.toLowerCase().includes(lowerQuery) ||
      rt.status.toLowerCase().includes(lowerQuery) ||
      rt.natureza.toLowerCase().includes(lowerQuery) ||
      (rt.descricao?.toLowerCase().includes(lowerQuery)) ||
      (rt.coletor?.nome?.toLowerCase().includes(lowerQuery)) ||
      (rt.agente?.nome?.toLowerCase().includes(lowerQuery))
    );
  };

  return {
    rts,
    coletores,
    locais,
    agentes,
    agentesAtivos,
    empresas,
    isLoading,
    addRT: addRTMutation.mutateAsync,
    updateStatus: updateStatusMutation.mutateAsync,
    revertToColetada: revertToColetadaMutation.mutateAsync,
    addColetor: addColetorMutation.mutateAsync,
    updateColetor: updateColetorMutation.mutateAsync,
    addEmpresa: addEmpresaMutation.mutateAsync,
    addLocal: addLocalMutation.mutateAsync,
    deleteRT: deleteRTMutation.mutateAsync,
    updateRT: updateRTMutation.mutateAsync,
    findColetorByCPF,
    searchRTs,
  };
};
