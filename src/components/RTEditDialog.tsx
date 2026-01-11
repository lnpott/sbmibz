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
import { RT, NaturezaRT, naturezaLabels } from '@/types/rt';
import { Edit3 } from 'lucide-react';
import { toast } from 'sonner';

interface RTEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  rt: RT | null;
  onConfirm: (id: string, data: {
    numero: string;
    natureza: NaturezaRT;
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
    natureza: '' as NaturezaRT,
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
        origem: rt.origem,
        destino: rt.destino,
        programacao: rt.programacao || '',
        peso: String(rt.peso),
        valor: String(rt.valor),
      });
      setMotivo('');
    }
  }, [rt]);

  const handleSubmit = async () => {
    if (!motivo.trim()) {
      toast.error('O motivo da edição é obrigatório');
      return;
    }

    if (!formData.numero || !formData.natureza || !formData.origem || !formData.destino) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    // Programação só é válida para embarque
    if (formData.natureza !== 'entregador_aeronave' && formData.programacao) {
      toast.error('Data de programação só é permitida para natureza "Entregador para Aeronave"');
      return;
    }

    if (!rt) return;

    setIsSubmitting(true);
    try {
      await onConfirm(rt.id, {
        numero: formData.numero.trim(),
        natureza: formData.natureza,
        origem: formData.origem.trim(),
        destino: formData.destino.trim(),
        programacao: formData.natureza === 'entregador_aeronave' ? formData.programacao || undefined : undefined,
        peso: parseFloat(formData.peso) || 0,
        valor: parseFloat(formData.valor) || 0,
      }, motivo.trim());
      
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const showProgramacao = formData.natureza === 'entregador_aeronave';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Edit3 className="h-5 w-5 text-primary" />
            Editar RT
          </DialogTitle>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="edit-numero">Número *</Label>
              <Input
                id="edit-numero"
                value={formData.numero}
                onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="edit-natureza">Natureza *</Label>
              <Select
                value={formData.natureza}
                onValueChange={(value: NaturezaRT) => setFormData({ 
                  ...formData, 
                  natureza: value,
                  programacao: value !== 'entregador_aeronave' ? '' : formData.programacao
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