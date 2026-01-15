export type NaturezaRT = 'coleta' | 'despacho' | 'transbordo';
export type StatusRT = 'pendente' | 'coletada' | 'despachada';
export type ClassificacaoCarga = 'comum' | 'fragil';

export interface Local {
  id: string;
  codigo: string;
  descricao?: string;
  created_at: string;
}

export interface Agente {
  id: string;
  nome: string;
  ativo: boolean;
  created_at: string;
}

export interface Empresa {
  id: string;
  nome: string;
  created_at: string;
}

export interface Coletor {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  empresa_id?: string;
  empresa?: Empresa;
  created_at: string;
  updated_at: string;
}

export interface RT {
  id: string;
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
  status: StatusRT;
  agente_id?: string;
  agente?: Agente;
  coletor_id?: string;
  coletor?: Coletor;
  entregador_id?: string;
  entregador?: Coletor;
  rt_origem_transbordo_id?: string;
  created_at: string;
  coletada_em?: string;
  despachada_em?: string;
}

export const naturezaLabels: Record<NaturezaRT, string> = {
  'coleta': 'Coleta',
  'despacho': 'Despacho',
  'transbordo': 'Transbordo',
};

export const classificacaoLabels: Record<ClassificacaoCarga, string> = {
  'comum': 'Comum',
  'fragil': 'Frágil',
};
