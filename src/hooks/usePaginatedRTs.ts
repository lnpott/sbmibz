import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { RT, StatusRT, NaturezaRT } from '@/types/rt';
import { usePagination } from './usePagination';

interface UsePaginatedRTsProps {
  initialPage?: number;
  initialPageSize?: number;
  filters?: {
    search?: string;
    status?: StatusRT;
    natureza?: NaturezaRT;
  };
}

export const usePaginatedRTs = ({
  initialPage = 1,
  initialPageSize = 10,
  filters = {}
}: UsePaginatedRTsProps = {}) => {
  const pagination = usePagination({
    initialPage,
    initialPageSize,
    totalItems: 0 // Será atualizado após a query
  });

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ['rts', pagination.currentPage, pagination.pageSize, filters],
    queryFn: async () => {
      let query = supabase
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
        `, { count: 'exact' });

      // Aplicar filtros
      if (filters.search) {
        query = query.or(`numero.ilike.%${filters.search}%,origem.ilike.%${filters.search}%,destino.ilike.%${filters.search}%`);
      }
      
      if (filters.status) {
        query = query.eq('status', filters.status as any); // Type assertion devido a limitações do Supabase
      }
      
      if (filters.natureza) {
        query = query.eq('natureza', filters.natureza);
      }

      // Obter contagem total para paginação
      const { count } = await supabase
        .from('rts')
        .select('*', { count: 'exact', head: true });

      // Aplicar paginação
      const from = (pagination.currentPage - 1) * pagination.pageSize;
      const to = from + pagination.pageSize - 1;
      
      const { data: rts, error } = await query
        .order('created_at', { ascending: false })
        .range(from, to);

      if (error) throw error;
      
      return {
        data: rts || [],
        totalCount: count || 0,
        currentPage: pagination.currentPage,
        pageSize: pagination.pageSize,
        totalPages: Math.ceil((count || 0) / pagination.pageSize)
      };
    },
    staleTime: 2 * 60 * 1000, // 2 minutos
  });

  const handlePageChange = useCallback((page: number) => {
    pagination.goToPage(page);
  }, [pagination]);

  const handlePageSizeChange = useCallback((size: number) => {
    pagination.setPageSize(size);
  }, [pagination]);

  const handleFiltersChange = useCallback((newFilters: typeof filters) => {
    pagination.goToPage(1); // Reset to first page when filters change
    refetch();
  }, [pagination, refetch]);

  return {
    ...pagination,
    data: data?.data || [],
    totalCount: data?.totalCount || 0,
    isLoading,
    error,
    refetch,
    onPageChange: handlePageChange,
    onPageSizeChange: handlePageSizeChange,
    onFiltersChange: handleFiltersChange
  };
};
