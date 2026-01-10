export type RTStatus = 'pendente' | 'retirada' | 'despachada';

export interface RT {
  id: string;
  numero: string;
  origem: string;
  destino: string;
  programacao: string;
  peso: number;
  valor: number;
  status: RTStatus;
  criadoEm: Date;
  retiradaEm?: Date;
  despachadaEm?: Date;
}
