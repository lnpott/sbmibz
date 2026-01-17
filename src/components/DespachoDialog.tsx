import { useState } from 'react';
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
  DialogDescription,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Truck, Plane } from 'lucide-react';
import { toast } from 'sonner';

interface DespachoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (data: {
    cia_aerea?: string;
    numero_voo?: string;
    observacao_despacho?: string;
  }) => Promise<void>;
  isAereo?: boolean;
}

const CIA_AEREAS = ['OMNI', 'LIDER', 'CHC'];

export const DespachoDialog = ({
  open,
  onOpenChange,
  onConfirm,
  isAereo = false,
}: DespachoDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    cia_aerea: '',
    numero_voo: '',
    observacao_despacho: '',
  });

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onConfirm({
        cia_aerea: formData.cia_aerea || undefined,
        numero_voo: formData.numero_voo || undefined,
        observacao_despacho: formData.observacao_despacho || undefined,
      });
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error('Erro ao registrar despacho');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ cia_aerea: '', numero_voo: '', observacao_despacho: '' });
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Truck className="h-5 w-5 text-primary" />
            Registrar Despacho
          </DialogTitle>
          <DialogDescription>
            {isAereo 
              ? 'Informe os dados do despacho aéreo' 
              : 'Confirme o despacho da carga'}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {isAereo && (
            <>
              <div className="space-y-2">
                <Label htmlFor="cia_aerea">Companhia Aérea</Label>
                <Select
                  value={formData.cia_aerea}
                  onValueChange={(value) => setFormData({ ...formData, cia_aerea: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a CIA" />
                  </SelectTrigger>
                  <SelectContent>
                    {CIA_AEREAS.map((cia) => (
                      <SelectItem key={cia} value={cia}>
                        <div className="flex items-center gap-2">
                          <Plane className="h-4 w-4" />
                          {cia}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="numero_voo">Número do Voo</Label>
                <Input
                  id="numero_voo"
                  placeholder="Ex: AD1234"
                  value={formData.numero_voo}
                  onChange={(e) => setFormData({ ...formData, numero_voo: e.target.value.toUpperCase() })}
                />
              </div>
            </>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacao_despacho">Observação</Label>
            <Textarea
              id="observacao_despacho"
              placeholder="Observações sobre o despacho..."
              value={formData.observacao_despacho}
              onChange={(e) => setFormData({ ...formData, observacao_despacho: e.target.value })}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleClose(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="gradient-primary text-primary-foreground"
          >
            {isSubmitting ? 'Registrando...' : 'Confirmar Despacho'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
