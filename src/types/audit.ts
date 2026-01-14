export type AcaoAudit = 'criacao' | 'edicao' | 'exclusao' | 'alteracao_status';

export interface AuditLog {
  id: string;
  created_at: string;
  tabela: string;
  registro_id: string;
  acao: AcaoAudit;
  dados_anteriores?: Record<string, unknown>;
  dados_novos?: Record<string, unknown>;
  descricao?: string;
  usuario?: string;
}

export const acaoLabels: Record<AcaoAudit, string> = {
  'criacao': 'Criação',
  'edicao': 'Edição',
  'exclusao': 'Exclusão',
  'alteracao_status': 'Alteração de Status',
};

export const tabelaLabels: Record<string, string> = {
  'rts': 'RTs',
  'coletores': 'Pessoas',
  'empresas': 'Empresas',
  'locais': 'Locais',
  'agentes': 'Agentes',
};
