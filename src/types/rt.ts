export type NaturezaRT = 'coleta' | 'despacho' | 'transbordo' | 'aereo_despacho' | 'aereo_coleta' | 'aereo_transbordo' | 'terrestre_despacho' | 'terrestre_coleta';
export type TipoRecebimento = 'aereo' | 'terrestre';
export type FinalidadeRT = 'despacho' | 'coleta' | 'transbordo';
export type StatusRT = 'pendente' | 'coletada' | 'despachada' | 'embarque_cancelado' | 'coleta_cancelada';
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
  cia_aerea?: string;
  numero_voo?: string;
  observacao_despacho?: string;
  motivo_cancelamento?: string;
  data_cancelamento?: string;
  cancelado_por?: string;
  natureza_original?: NaturezaRT;
}

export const naturezaLabels: Record<NaturezaRT, string> = {
  'coleta': 'Coleta',
  'despacho': 'Despacho',
  'transbordo': 'Transbordo',
  'aereo_despacho': 'Aéreo → Despacho',
  'aereo_coleta': 'Aéreo → Coleta',
  'aereo_transbordo': 'Aéreo → Transbordo',
  'terrestre_despacho': 'Terrestre → Despacho',
  'terrestre_coleta': 'Terrestre → Coleta',
};

export const tipoRecebimentoLabels: Record<TipoRecebimento, string> = {
  'aereo': 'Recebimento AÉREO',
  'terrestre': 'Recebimento TERRESTRE',
};

export const finalidadeLabels: Record<FinalidadeRT, string> = {
  'despacho': 'Para Despacho',
  'coleta': 'Para Coleta',
  'transbordo': 'Transbordo',
};

export const classificacaoLabels: Record<ClassificacaoCarga, string> = {
  'comum': 'Comum',
  'fragil': 'Frágil',
};

export const statusLabels: Record<StatusRT, string> = {
  'pendente': 'Pendente',
  'coletada': 'Coletada',
  'despachada': 'Despachada',
  'embarque_cancelado': 'Embarque Cancelado',
  'coleta_cancelada': 'Coleta Cancelada',
};

// Helpers para determinar tipo e finalidade a partir da natureza
export const getNaturezaInfo = (natureza: NaturezaRT): { tipo: TipoRecebimento | null; finalidade: FinalidadeRT } => {
  if (natureza.startsWith('aereo_')) {
    return { tipo: 'aereo', finalidade: natureza.replace('aereo_', '') as FinalidadeRT };
  }
  if (natureza.startsWith('terrestre_')) {
    return { tipo: 'terrestre', finalidade: natureza.replace('terrestre_', '') as FinalidadeRT };
  }
  // Legado
  return { tipo: null, finalidade: natureza as FinalidadeRT };
};

export const buildNatureza = (tipo: TipoRecebimento, finalidade: FinalidadeRT): NaturezaRT => {
  return `${tipo}_${finalidade}` as NaturezaRT;
};

export const isAereo = (natureza: NaturezaRT): boolean => {
  return natureza.startsWith('aereo_') || natureza === 'transbordo';
};

export const isTerrestre = (natureza: NaturezaRT): boolean => {
  return natureza.startsWith('terrestre_');
};

export const isParaDespacho = (natureza: NaturezaRT): boolean => {
  return natureza === 'despacho' || natureza.endsWith('_despacho');
};

export const isParaColeta = (natureza: NaturezaRT): boolean => {
  return natureza === 'coleta' || natureza.endsWith('_coleta');
};
