export type NaturezaRT = 'entregador_aeronave' | 'desembarque_desassistida';
export type StatusRT = 'pendente' | 'coletada' | 'despachada';

export interface Coletor {
  id: string;
  nome: string;
  cpf: string;
  telefone?: string;
  email?: string;
  created_at: string;
  updated_at: string;
}

export interface RT {
  id: string;
  numero: string;
  natureza: NaturezaRT;
  origem: string;
  destino: string;
  programacao?: string;
  peso: number;
  valor: number;
  status: StatusRT;
  coletor_id?: string;
  coletor?: Coletor;
  created_at: string;
  coletada_em?: string;
  despachada_em?: string;
}

export const naturezaLabels: Record<NaturezaRT, string> = {
  'entregador_aeronave': 'Entregador para Aeronave',
  'desembarque_desassistida': 'Desembarque Desassistida',
};
