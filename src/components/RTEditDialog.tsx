import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { RT, NaturezaRT, ClassificacaoCarga, naturezaLabels, classificacaoLabels } from '@/types/rt';
import { Edit3, History } from 'lucide-react';
import { toast } from 'sonner';
import { Badge } from '@/components/ui/badge';

interface RTEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rt: RT | null;
  onConfirm: (id: string, data: {
    numero: string;
    numeros_anteriores?: string[];
    natureza: NaturezaRT;
    descricao?: string;
    classificacao: ClassificacaoCarga;
    origem: string;
    destino: string;
    programacao?: string;
    peso: number;
    valor: number;
  }, motivo: string) => Promise<void>;
}

export const RTEditDialog = ({
  open,
  onOpenChange,
  rt,
  onConfirm,
}: RTEditDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [motivo, setMotivo] = useState('');
  const [formData, setFormData] = useState({
    numero: '',
    natureza: 'coleta' as NaturezaRT,
    descricao: '',
    classificacao: 'comum' as ClassificacaoCarga,
    origem: '',
    destino: '',
    programacao: '',
    peso: '',
    valor: '',
  });

  useEffect(() => {
    if (rt) {
      setFormData({
        numero: rt.numero,
        natureza: rt.natureza,
        descricao: rt.descricao || '',
        classificacao: rt.classificacao,
        origem: rt.origem,
        destino: rt.destino,
        programacao: rt.programacao || '',
        peso: String(rt.peso),
        valor: String(rt.valor),
      });
      setMotivo('');
    }
  }, [rt]);

  const validateNumeroRT = (numero: string): boolean => {
    const onlyDigits = numero.replace(/\D/g, '');
    return onlyDigits.length === 9;
  };

  const handleNumeroChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 9);
    setFormData({ ...formData, numero: value });
  };

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      toast.error('O motivo da edição é obrigatório');
      return;
    }

    if (!formData.numero || !formData.natureza || !formData.origem || !formData.destino) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    if (!validateNumeroRT(formData.numero)) {
      toast.error('O número da RT deve conter exatamente 9 dígitos');
      return;
    }

    if (!rt) return;

    setIsSubmitting(true);
    try {
      // Se o número foi alterado, adicionar ao histórico
      let numeros_anteriores = rt.numeros_anteriores || [];
      if (formData.numero.trim() !== rt.numero) {
        numeros_anteriores = [...numeros_anteriores, rt.numero];
      }

      await onConfirm(rt.id, {
        numero: formData.numero.trim(),
        numeros_anteriores: numeros_anteriores.length > 0 ? numeros_anteriores : undefined,
        natureza: formData.natureza,
        descricao: formData.descricao || undefined,
        classificacao: formData.classificacao,
        origem: formData.origem.trim(),
        destino: formData.destino.trim(),
        programacao: formData.natureza === 'despacho' ? formData.programacao || undefined : undefined,
        peso: parseFloat(formData.peso) || 0,
        valor: parseFloat(formData.valor) || 0,
      }, motivo.trim());
      
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showProgramacao = formData.natureza === 'despacho';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Editar RT
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {rt?.numeros_anteriores && rt.numeros_anteriores.length > 0 && (
            <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
              <History className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">Números anteriores:</span>
              <div className="flex flex-wrap gap-1">
                {rt.numeros_anteriores.map((num, idx) => (
                  <Badge key={idx} variant="secondary" className="text-xs">{num}</Badge>
                ))}
              </div>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-numero">Número * (9 dígitos)</Label>
              <div className="relative">
                <Input
                  id="edit-numero"
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
              <Label htmlFor="edit-natureza">Natureza *</Label>
              <Select
                value={formData.natureza}
                onValueChange={(value: NaturezaRT) => setFormData({ 
                  ...formData, 
                  natureza: value,
                  programacao: value !== 'despacho' ? '' : formData.programacao
                })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(naturezaLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-descricao">Descrição</Label>
            <Textarea
              id="edit-descricao"
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              rows={2}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-classificacao">Classificação</Label>
            <Select
              value={formData.classificacao}
              onValueChange={(value: ClassificacaoCarga) => setFormData({ 
                ...formData, 
                classificacao: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(classificacaoLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-origem">Origem *</Label>
              <Input
                id="edit-origem"
                value={formData.origem}
                onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-destino">Destino *</Label>
              <Input
                id="edit-destino"
                value={formData.destino}
                onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              />
            </div>
            
            {showProgramacao && (
              <div className="space-y-2">
                <Label htmlFor="edit-programacao">Programação</Label>
                <Input
                  id="edit-programacao"
                  type="date"
                  value={formData.programacao}
                  onChange={(e) => setFormData({ ...formData, programacao: e.target.value })}
                />
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="edit-peso">Peso (kg)</Label>
              <Input
                id="edit-peso"
                type="number"
                step="0.01"
                value={formData.peso}
                onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-valor">Valor (R$)</Label>
              <Input
                id="edit-valor"
                type="number"
                step="0.01"
                value={formData.valor}
                onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="edit-motivo" className="text-destructive">
              Motivo da Edição * (obrigatório)
            </Label>
            <Textarea
              id="edit-motivo"
              placeholder="Descreva o motivo da edição..."
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              className="min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !motivo.trim()}
            className="gradient-primary text-primary-foreground"
          >
            {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};