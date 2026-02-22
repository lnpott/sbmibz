import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RT, Local, Agente, Coletor, Empresa } from '@/types/rt';

export const useRTData = () => {
  const { data: rts = [], isLoading: isLoadingRTs } = useQuery({
    queryKey: ['rts'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('rts')
        .select(`
          id,
          numero,
          natureza,
          descricao,
          classificacao,
          origem,
          origem_id,
          destino,
          destino_id,
          programacao,
          data_recebimento_base,
          data_prevista_despacho,
          peso,
          valor,
          status,
          coletor_id,
          entregador_id,
          agente_id,
          cia_aerea,
          numero_voo,
          observacao_despacho,
          created_at,
          coletada_em,
          despachada_em,
          coletor:coletores!rts_coletor_id_fkey(
            id,
            nome,
            cpf,
            empresa:empresas(id, nome)
          ),
          entregador:coletores!rts_entregador_id_fkey(
            id,
            nome,
            cpf,
            empresa:empresas(id, nome)
          ),
          agente:agentes(id, nome, ativo)
        `)
        .order('created_at', { ascending: false });
      
      if (error) throw error;
      return data as unknown as RT[];
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const { data: coletores = [], isLoading: isLoadingColetores } = useQuery({
    queryKey: ['coletores'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('coletores')
        .select(`
          id,
          nome,
          cpf,
          telefone,
          email,
          empresa_id,
          empresa:empresas(id, nome),
          created_at
        `)
        .order('nome');
      
      if (error) throw error;
      return data as unknown as Coletor[];
    },
    staleTime: 10 * 60 * 1000, // 10 minutos
  });

  const { data: locais = [], isLoading: isLoadingLocais } = useQuery({
    queryKey: ['locais'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('locais')
        .select(`
          id,
          codigo,
          descricao,
          created_at
        `)
        .order('codigo');
      
      if (error) throw error;
      return data as Local[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });

  const { data: agentes = [], isLoading: isLoadingAgentes } = useQuery({
    queryKey: ['agentes'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('agentes')
        .select(`
          id,
          nome,
          ativo,
          created_at
        `)
        .order('nome');
      
      if (error) throw error;
      return data as Agente[];
    },
    staleTime: 15 * 60 * 1000, // 15 minutos
  });

  const { data: empresas = [], isLoading: isLoadingEmpresas } = useQuery({
    queryKey: ['empresas'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('empresas')
        .select(`
          id,
          nome,
          created_at
        `)
        .order('nome');
      
      if (error) throw error;
      return data as Empresa[];
    },
    staleTime: 30 * 60 * 1000, // 30 minutos
  });

  const agentesAtivos = agentes.filter(a => a.ativo);

  return {
    // Data
    rts,
    coletores,
    locais,
    agentes,
    agentesAtivos,
    empresas,
    
    // Loading states
    isLoading: isLoadingRTs || isLoadingColetores || isLoadingLocais || isLoadingAgentes || isLoadingEmpresas,
    isLoadingRTs,
    isLoadingColetores,
    isLoadingLocais,
    isLoadingAgentes,
    isLoadingEmpresas,
  };
};
