import { useRef } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { RT, naturezaLabels, classificacaoLabels, Agente, isParaColeta, isAereo } from '@/types/rt';
import { Printer, Package, MapPin, Calendar, Scale, DollarSign, User, Building2, FileText, History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RTImpressaoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rt: RT | null;
  agente?: Agente | null;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
};

const formatDate = (date: string | undefined | null) => {
  if (!date) return '-';
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
};

const formatDateTime = (date: string | undefined | null) => {
  if (!date) return '-';
  return format(new Date(date), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR });
};

export const RTImpressao = ({ open, onOpenChange, rt, agente }: RTImpressaoProps) => {
  const printRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    if (!printRef.current) return;

    const printContent = printRef.current.innerHTML;
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>RT ${rt?.numero || ''}</title>
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { font-family: Arial, sans-serif; padding: 20px; font-size: 12px; }
            .header { text-align: center; margin-bottom: 20px; border-bottom: 2px solid #000; padding-bottom: 10px; }
            .header h1 { font-size: 18px; margin-bottom: 5px; }
            .header p { color: #666; font-size: 11px; }
            .section { margin-bottom: 15px; }
            .section-title { font-weight: bold; font-size: 13px; margin-bottom: 8px; background: #f0f0f0; padding: 5px; }
            .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
            .field { margin-bottom: 8px; }
            .label { font-weight: bold; color: #333; font-size: 10px; text-transform: uppercase; }
            .value { font-size: 12px; margin-top: 2px; }
            .signature-section { margin-top: 30px; display: grid; grid-template-columns: 1fr 1fr; gap: 40px; }
            .signature-box { border-top: 1px solid #000; padding-top: 5px; text-align: center; }
            .signature-label { font-size: 10px; color: #666; }
            .badge { display: inline-block; padding: 2px 8px; border-radius: 4px; font-size: 10px; font-weight: bold; }
            .badge-coleta { background: #dbeafe; color: #1e40af; }
            .badge-despacho { background: #fef3c7; color: #92400e; }
            .badge-transbordo { background: #f3e8ff; color: #7c3aed; }
            .badge-comum { background: #e5e7eb; color: #374151; }
            .badge-fragil { background: #fee2e2; color: #991b1b; }
            .historico { background: #f9fafb; border: 1px dashed #d1d5db; padding: 8px; margin-top: 10px; border-radius: 4px; }
            .historico-title { font-size: 10px; color: #6b7280; margin-bottom: 5px; }
            .historico-list { font-size: 11px; }
            .footer { margin-top: 20px; text-align: center; font-size: 10px; color: #666; border-top: 1px solid #ccc; padding-top: 10px; }
            @media print {
              body { padding: 10px; }
            }
          </style>
        </head>
        <body>
          ${printContent}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.print();
  };

  if (!rt) return null;

  const naturezaClass = {
    coleta: 'badge-coleta',
    despacho: 'badge-despacho',
    transbordo: 'badge-transbordo',
  }[rt.natureza];

  const classificacaoClass = rt.classificacao === 'fragil' ? 'badge-fragil' : 'badge-comum';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="h-5 w-5 text-primary" />
            Impressão da RT
          </DialogTitle>
        </DialogHeader>

        {/* Preview Area */}
        <div ref={printRef} className="bg-white text-black p-4 rounded-lg border">
          <div className="header">
            <h1>REQUISIÇÃO DE TRANSPORTE</h1>
            <p>Sistema de Gerenciamento de RTs</p>
          </div>

          <div className="section">
            <div className="section-title">DADOS DA RT</div>
            <div className="grid">
              <div className="field">
                <div className="label">Número da RT</div>
                <div className="value" style={{ fontSize: '16px', fontWeight: 'bold' }}>{rt.numero}</div>
              </div>
              <div className="field">
                <div className="label">Data de Entrada</div>
                <div className="value">{formatDateTime(rt.data_recebimento_base || rt.created_at)}</div>
              </div>
              <div className="field">
                <div className="label">{isParaColeta(rt.natureza) ? 'Previsão de Coleta' : 'Previsão de Despacho'}</div>
                <div className="value">{formatDateTime(rt.data_prevista_despacho)}</div>
              </div>
              <div className="field">
                <div className="label">Natureza</div>
                <div className="value">
                  <span className={`badge ${naturezaClass}`}>
                    {naturezaLabels[rt.natureza]}
                  </span>
                </div>
              </div>
              <div className="field">
                <div className="label">Classificação</div>
                <div className="value">
                  <span className={`badge ${classificacaoClass}`}>
                    {classificacaoLabels[rt.classificacao]}
                  </span>
                </div>
              </div>
            </div>
            {rt.numeros_anteriores && rt.numeros_anteriores.length > 0 && (
              <div className="historico">
                <div className="historico-title">HISTÓRICO DE NUMERAÇÃO</div>
                <div className="historico-list">
                  <strong>Número atual:</strong> {rt.numero}<br />
                  <strong>Número(s) anterior(es):</strong> {rt.numeros_anteriores.join(', ')}
                </div>
              </div>
            )}
          </div>

          <div className="section">
            <div className="section-title">ROTA</div>
            <div className="grid">
              <div className="field">
                <div className="label">Origem</div>
                <div className="value">{rt.origem}</div>
              </div>
              <div className="field">
                <div className="label">Destino</div>
                <div className="value">{rt.destino}</div>
              </div>
            </div>
          </div>

          {rt.descricao && (
            <div className="section">
              <div className="section-title">DESCRIÇÃO</div>
              <div className="value">{rt.descricao}</div>
            </div>
          )}

          <div className="section">
            <div className="section-title">INFORMAÇÕES DA CARGA</div>
            <div className="grid">
              <div className="field">
                <div className="label">Peso</div>
                <div className="value">{Number(rt.peso).toFixed(2)} kg</div>
              </div>
              <div className="field">
                <div className="label">Valor Declarado</div>
                <div className="value">{formatCurrency(Number(rt.valor))}</div>
              </div>
              {rt.data_recebimento_base && (
                <div className="field">
                  <div className="label">Data Recebimento em Base</div>
                  <div className="value">{formatDateTime(rt.data_recebimento_base)}</div>
                </div>
              )}
              {rt.data_prevista_despacho && (
                <div className="field">
                  <div className="label">{isParaColeta(rt.natureza) ? 'Previsão de Coleta' : 'Previsão de Despacho'}</div>
                  <div className="value">{formatDateTime(rt.data_prevista_despacho)}</div>
                </div>
              )}
              {rt.programacao && (
                <div className="field">
                  <div className="label">Programação</div>
                  <div className="value">{formatDate(rt.programacao)}</div>
                </div>
              )}
            </div>
          </div>

          {(rt.cia_aerea || rt.numero_voo || rt.observacao_despacho) && (
            <div className="section">
              <div className="section-title">DADOS DO DESPACHO AÉREO</div>
              <div className="grid">
                {rt.cia_aerea && (
                  <div className="field">
                    <div className="label">Companhia Aérea</div>
                    <div className="value">{rt.cia_aerea}</div>
                  </div>
                )}
                {rt.numero_voo && (
                  <div className="field">
                    <div className="label">Número do Voo</div>
                    <div className="value">{rt.numero_voo}</div>
                  </div>
                )}
              </div>
              {rt.observacao_despacho && (
                <div className="field" style={{ marginTop: '8px' }}>
                  <div className="label">Observação</div>
                  <div className="value">{rt.observacao_despacho}</div>
                </div>
              )}
            </div>
          )}

          {(rt.entregador || rt.coletor) && (
            <div className="section">
              <div className="section-title">RESPONSÁVEIS</div>
              <div className="grid">
                {rt.entregador && (
                  <div className="field">
                    <div className="label">Entregador</div>
                    <div className="value">
                      {rt.entregador.nome}<br />
                      <span style={{ fontSize: '10px', color: '#666' }}>CPF: {rt.entregador.cpf}</span>
                    </div>
                  </div>
                )}
                {rt.coletor && (
                  <div className="field">
                    <div className="label">Coletor</div>
                    <div className="value">
                      {rt.coletor.nome}<br />
                      <span style={{ fontSize: '10px', color: '#666' }}>CPF: {rt.coletor.cpf}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="signature-section">
            <div className="signature-box">
              <div className="signature-label">Agente Aeroportuário</div>
              {agente && <div style={{ fontSize: '11px', marginTop: '5px' }}>{agente.nome}</div>}
            </div>
            <div className="signature-box">
              <div className="signature-label">Responsável pela Carga</div>
            </div>
          </div>

          <div className="footer">
            <p>Documento gerado em {formatDateTime(new Date().toISOString())}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handlePrint} className="gradient-primary text-primary-foreground">
            <Printer className="h-4 w-4 mr-2" />
            Imprimir
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
