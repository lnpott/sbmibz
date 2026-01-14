import { useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Agente, Empresa, Local, Coletor } from '@/types/rt';
import { AcaoAudit } from '@/types/audit';

export const useConfiguracoes = (addLog: (log: { tabela: string; registro_id: string; acao: AcaoAudit; dados_anteriores?: Record<string, unknown>; dados_novos?: Record<string, unknown>; descricao?: string; usuario?: string }) => Promise<unknown>) => {
  const queryClient = useQueryClient();

  // AGENTES
  const updateAgenteMutation = useMutation({
    mutationFn: async ({ id, data, dadosAnteriores }: { id: string; data: { nome?: string; ativo?: boolean }; dadosAnteriores: Agente }) => {
      const { error } = await supabase
        .from('agentes')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;

      await addLog({
        tabela: 'agentes',
        registro_id: id,
        acao: 'edicao',
        dados_anteriores: dadosAnteriores as unknown as Record<string, unknown>,
        dados_novos: data,
        descricao: `Agente "${dadosAnteriores.nome}" atualizado`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentes'] });
      toast.success('Agente atualizado!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar agente: ${error.message}`);
    },
  });

  const addAgenteMutation = useMutation({
    mutationFn: async (agente: { nome: string }) => {
      const { data, error } = await supabase
        .from('agentes')
        .insert({ nome: agente.nome, ativo: true })
        .select()
        .single();
      
      if (error) throw error;

      await addLog({
        tabela: 'agentes',
        registro_id: data.id,
        acao: 'criacao',
        dados_novos: data,
        descricao: `Agente "${agente.nome}" criado`,
      });

      return data as Agente;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['agentes'] });
      toast.success('Agente cadastrado!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao cadastrar agente: ${error.message}`);
    },
  });

  // EMPRESAS
  const updateEmpresaMutation = useMutation({
    mutationFn: async ({ id, data, dadosAnteriores }: { id: string; data: { nome?: string }; dadosAnteriores: Empresa }) => {
      const { error } = await supabase
        .from('empresas')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;

      await addLog({
        tabela: 'empresas',
        registro_id: id,
        acao: 'edicao',
        dados_anteriores: dadosAnteriores as unknown as Record<string, unknown>,
        dados_novos: data,
        descricao: `Empresa "${dadosAnteriores.nome}" atualizada`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['empresas'] });
      toast.success('Empresa atualizada!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar empresa: ${error.message}`);
    },
  });

  // LOCAIS
  const updateLocalMutation = useMutation({
    mutationFn: async ({ id, data, dadosAnteriores }: { id: string; data: { codigo?: string; descricao?: string }; dadosAnteriores: Local }) => {
      const { error } = await supabase
        .from('locais')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;

      await addLog({
        tabela: 'locais',
        registro_id: id,
        acao: 'edicao',
        dados_anteriores: dadosAnteriores as unknown as Record<string, unknown>,
        dados_novos: data,
        descricao: `Local "${dadosAnteriores.codigo}" atualizado`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['locais'] });
      toast.success('Local atualizado!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar local: ${error.message}`);
    },
  });

  // COLETORES/PESSOAS
  const updatePessoaMutation = useMutation({
    mutationFn: async ({ id, data, dadosAnteriores }: { id: string; data: { nome?: string; telefone?: string; email?: string; empresa_id?: string }; dadosAnteriores: Coletor }) => {
      const { error } = await supabase
        .from('coletores')
        .update(data)
        .eq('id', id);
      
      if (error) throw error;

      await addLog({
        tabela: 'coletores',
        registro_id: id,
        acao: 'edicao',
        dados_anteriores: dadosAnteriores as unknown as Record<string, unknown>,
        dados_novos: data,
        descricao: `Pessoa "${dadosAnteriores.nome}" atualizada`,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coletores'] });
      toast.success('Pessoa atualizada!');
    },
    onError: (error: Error) => {
      toast.error(`Erro ao atualizar pessoa: ${error.message}`);
    },
  });

  return {
    updateAgente: updateAgenteMutation.mutateAsync,
    addAgente: addAgenteMutation.mutateAsync,
    updateEmpresa: updateEmpresaMutation.mutateAsync,
    updateLocal: updateLocalMutation.mutateAsync,
    updatePessoa: updatePessoaMutation.mutateAsync,
  };
};
