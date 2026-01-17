import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X, Search } from 'lucide-react';
import { NaturezaRT, ClassificacaoCarga, TipoRecebimento, FinalidadeRT, tipoRecebimentoLabels, finalidadeLabels, classificacaoLabels, Local, Coletor, Empresa, Agente, buildNatureza, isAereo, isParaDespacho } from '@/types/rt';
import { toast } from 'sonner';
import { LocalSearchDialog } from './LocalSearchDialog';
import { PessoaSearchDialog } from './PessoaSearchDialog';

interface RTFormProps {
  onSubmit: (rt: {
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
  }) => Promise<unknown>;
  onCancel?: () => void;
  locais: Local[];
  coletores: Coletor[];
  empresas: Empresa[];
  agente?: Agente | null;
  onAddLocal: (local: { codigo: string }) => Promise<Local>;
  onAddColetor: (c: { nome: string; cpf: string; telefone?: string; email?: string; empresa_id?: string }) => Promise<Coletor>;
  onUpdateColetor: (params: { id: string; data: { nome?: string; telefone?: string; email?: string; empresa_id?: string } }) => Promise<void>;
  onAddEmpresa: (e: { nome: string }) => Promise<Empresa>;
  findColetorByCPF: (cpf: string) => Coletor | undefined;
}

export const RTForm = ({ 
  onSubmit, 
  onCancel, 
  locais, 
  coletores, 
  empresas, 
  agente,
  onAddLocal,
  onAddColetor,
  onUpdateColetor,
  onAddEmpresa,
  findColetorByCPF,
}: RTFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [origemDialogOpen, setOrigemDialogOpen] = useState(false);
  const [destinoDialogOpen, setDestinoDialogOpen] = useState(false);
  const [entregadorDialogOpen, setEntregadorDialogOpen] = useState(false);
  
  const [formData, setFormData] = useState({
    numero: '',
    tipoRecebimento: '' as TipoRecebimento | '',
    finalidade: '' as FinalidadeRT | '',
    descricao: '',
    classificacao: 'comum' as ClassificacaoCarga,
    origem: '',
    origem_id: '',
    destino: '',
    destino_id: '',
    programacao: '',
    data_recebimento_base: '',
    data_prevista_despacho: '',
    peso: '',
    valor: '',
    entregador_id: '',
    entregador_nome: '',
    companhia_aerea: '',
  });

  const validateNumeroRT = (numero: string): boolean => {
    const onlyDigits = numero.replace(/\D/g, '');
    return onlyDigits.length === 9;
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData({ ...formData, numero: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.tipoRecebimento || !formData.finalidade || !formData.origem || !formData.destino) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (!validateNumeroRT(formData.numero)) {
      toast.error('O número da RT deve conter exatamente 9 dígitos');
      return;
    }

    if (!formData.data_recebimento_base) {
      toast.error('A data de entrada é obrigatória');
      return;
    }

    const natureza = buildNatureza(formData.tipoRecebimento as TipoRecebimento, formData.finalidade as FinalidadeRT);

    if (isParaDespacho(natureza) && !formData.programacao) {
      toast.error('Programação é obrigatória para Despacho');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        numero: formData.numero.trim(),
        natureza: natureza,
        descricao: formData.descricao.trim() || undefined,
        classificacao: formData.classificacao,
        origem: formData.origem.trim(),
        origem_id: formData.origem_id || undefined,
        destino: formData.destino.trim(),
        destino_id: formData.destino_id || undefined,
        programacao: formData.programacao || undefined,
        data_recebimento_base: formData.data_recebimento_base || undefined,
        data_prevista_despacho: formData.data_prevista_despacho || undefined,
        peso: parseFloat(formData.peso) || 0,
        valor: parseFloat(formData.valor) || 0,
        agente_id: agente?.id,
        entregador_id: formData.entregador_id || undefined,
      });

      setFormData({
        numero: '', tipoRecebimento: '', finalidade: '', descricao: '', classificacao: 'comum',
        origem: '', origem_id: '', destino: '', destino_id: '',
        programacao: '', data_recebimento_base: '', data_prevista_despacho: '',
        peso: '', valor: '', entregador_id: '', entregador_nome: '', companhia_aerea: '',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const showProgramacao = formData.finalidade === 'despacho';
  const showCompanhiaAerea = formData.tipoRecebimento === 'aereo';
  const showEntregador = formData.tipoRecebimento === 'terrestre';
  const finalidadeOptions = formData.tipoRecebimento === 'terrestre' 
    ? (['despacho', 'coleta'] as FinalidadeRT[])
    : (['despacho', 'coleta', 'transbordo'] as FinalidadeRT[]);

  return (
    <>
      <Card className="animate-slide-up border-primary/20 shadow-lg">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg font-semibold flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
                <Plus className="h-4 w-4 text-primary-foreground" />
              </div>
              Nova RT
            </CardTitle>
            {onCancel && (
              <Button variant="ghost" size="icon" onClick={onCancel}>
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <Label htmlFor="numero">Número * (9 dígitos)</Label>
              <div className="relative">
                <Input 
                  id="numero" 
                  placeholder="000000000" 
                  value={formData.numero}
                  onChange={handleNumeroChange}
                  maxLength={9}
                  className={formData.numero && formData.numero.length !== 9 ? 'border-destructive' : ''}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
                  {formData.numero.length}/9
                </span>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="tipoRecebimento">Tipo de Recebimento *</Label>
              <Select value={formData.tipoRecebimento}
                onValueChange={(value: TipoRecebimento) => setFormData({ 
                  ...formData, 
                  tipoRecebimento: value,
                  finalidade: value === 'terrestre' && formData.finalidade === 'transbordo' ? '' : formData.finalidade,
                  entregador_id: value === 'aereo' ? '' : formData.entregador_id,
                  entregador_nome: value === 'aereo' ? '' : formData.entregador_nome,
                  companhia_aerea: value === 'terrestre' ? '' : formData.companhia_aerea,
                })}>
                <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                <SelectContent>
                  {Object.entries(tipoRecebimentoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {formData.tipoRecebimento && (
              <div className="space-y-2">
                <Label htmlFor="finalidade">Finalidade *</Label>
                <Select value={formData.finalidade}
                  onValueChange={(value: FinalidadeRT) => setFormData({ ...formData, finalidade: value })}>
                  <SelectTrigger><SelectValue placeholder="Selecione" /></SelectTrigger>
                  <SelectContent>
                    {finalidadeOptions.map((value) => (
                      <SelectItem key={value} value={value}>{finalidadeLabels[value]}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="classificacao">Classificação *</Label>
              <Select value={formData.classificacao}
                onValueChange={(value: ClassificacaoCarga) => setFormData({ ...formData, classificacao: value })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {Object.entries(classificacaoLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label>Origem *</Label>
              <div className="flex gap-2">
                <Input value={formData.origem} readOnly placeholder="Selecione..." className="flex-1" />
                <Button type="button" variant="outline" size="icon" onClick={() => setOrigemDialogOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label>Destino *</Label>
              <div className="flex gap-2">
                <Input value={formData.destino} readOnly placeholder="Selecione..." className="flex-1" />
                <Button type="button" variant="outline" size="icon" onClick={() => setDestinoDialogOpen(true)}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {showProgramacao && (
              <div className="space-y-2">
                <Label htmlFor="programacao">Programação *</Label>
                <Input id="programacao" type="date" value={formData.programacao}
                  onChange={(e) => setFormData({ ...formData, programacao: e.target.value })} />
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="data_recebimento">Data de Entrada *</Label>
              <Input id="data_recebimento" type="datetime-local" value={formData.data_recebimento_base}
                onChange={(e) => setFormData({ ...formData, data_recebimento_base: e.target.value })}
                required />
            </div>

            <div className="space-y-2">
              <Label htmlFor="data_despacho">
                {formData.finalidade === 'coleta' ? 'Previsão de Coleta' : 'Previsão de Despacho'}
              </Label>
              <Input id="data_despacho" type="datetime-local" value={formData.data_prevista_despacho}
                onChange={(e) => setFormData({ ...formData, data_prevista_despacho: e.target.value })} />
            </div>

            {showCompanhiaAerea && (
              <div className="space-y-2">
                <Label htmlFor="companhia_aerea">Companhia Aérea</Label>
                <Input 
                  id="companhia_aerea" 
                  placeholder="Ex: LATAM, GOL, AZUL..." 
                  value={formData.companhia_aerea}
                  onChange={(e) => setFormData({ ...formData, companhia_aerea: e.target.value })}
                />
              </div>
            )}

            {showEntregador && (
              <div className="space-y-2">
                <Label>Entregador</Label>
                <div className="flex gap-2">
                  <Input value={formData.entregador_nome} readOnly placeholder="Opcional..." className="flex-1" />
                  <Button type="button" variant="outline" size="icon" onClick={() => setEntregadorDialogOpen(true)}>
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="peso">Peso (kg)</Label>
              <Input id="peso" type="number" step="0.01" placeholder="0.00" value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })} />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input id="valor" type="number" step="0.01" placeholder="0.00" value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })} />
            </div>

            <div className="space-y-2 sm:col-span-2 lg:col-span-3">
              <Label htmlFor="descricao">Descrição</Label>
              <Textarea id="descricao" placeholder="Descrição da RT..." value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })} />
            </div>
            
            <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
              {onCancel && <Button type="button" variant="outline" onClick={onCancel}>Cancelar</Button>}
              <Button type="submit" className="gradient-primary text-primary-foreground" disabled={isSubmitting}>
                <Plus className="h-4 w-4 mr-2" />
                {isSubmitting ? 'Cadastrando...' : 'Cadastrar RT'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <LocalSearchDialog open={origemDialogOpen} onOpenChange={setOrigemDialogOpen} locais={locais}
        onSelect={(l) => setFormData({ ...formData, origem: l.codigo, origem_id: l.id })}
        onAddLocal={onAddLocal} title="Selecionar Origem" />

      <LocalSearchDialog open={destinoDialogOpen} onOpenChange={setDestinoDialogOpen} locais={locais}
        onSelect={(l) => setFormData({ ...formData, destino: l.codigo, destino_id: l.id })}
        onAddLocal={onAddLocal} title="Selecionar Destino" />

      <PessoaSearchDialog open={entregadorDialogOpen} onOpenChange={setEntregadorDialogOpen}
        pessoas={coletores} empresas={empresas}
        onSelect={(p) => setFormData({ ...formData, entregador_id: p.id, entregador_nome: p.nome })}
        onAddPessoa={onAddColetor} onUpdatePessoa={onUpdateColetor} onAddEmpresa={onAddEmpresa}
        findByCPF={findColetorByCPF} title="Selecionar Entregador" />
    </>
  );
};
