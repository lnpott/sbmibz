import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { AlertTriangle, X } from 'lucide-react';
import { RT } from '@/types/rt';

interface CancelamentoEmbarqueDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: (motivo: string) => void;
  rt: RT | null;
}

export const CancelamentoEmbarqueDialog = ({ 
  open, 
  onOpenChange, 
  onConfirm, 
  rt 
}: CancelamentoEmbarqueDialogProps) => {
  const [motivo, setMotivo] = useState('');

  const handleConfirm = () => {
    if (motivo.trim()) {
      onConfirm(motivo.trim());
      setMotivo('');
      onOpenChange(false);
    }
  };

  const handleClose = () => {
    setMotivo('');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-orange-600">
            <AlertTriangle className="h-5 w-5" />
            Cancelar Embarque
          </DialogTitle>
          <DialogDescription>
            {rt && (
              <span>
                RT {rt.numero} - {rt.origem} → {rt.destino}
              </span>
            )}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo do Cancelamento *</Label>
            <Textarea
              id="motivo"
              value={motivo}
              onChange={(e) => setMotivo(e.target.value)}
              placeholder="Descreva o motivo do cancelamento do embarque..."
              className="min-h-[100px]"
              required
            />
            <p className="text-xs text-muted-foreground">
              Esta informação será usada para identificar que o embarque foi cancelado.
            </p>
          </div>

          <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-800 rounded-lg p-3">
            <div className="flex items-start gap-2">
              <AlertTriangle className="h-4 w-4 text-orange-600 mt-0.5 flex-shrink-0" />
              <div className="text-sm">
                <p className="font-medium text-orange-800 dark:text-orange-200">
                  Importante
                </p>
                <p className="text-orange-700 dark:text-orange-300 mt-1">
                  Ao cancelar o embarque, a RT será movida para coleta e registrada como "Embarque Cancelado".
                </p>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={handleClose}
          >
            <X className="h-4 w-4 mr-2" />
            Cancelar
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={!motivo.trim()}
            className="bg-orange-600 hover:bg-orange-700 text-white"
          >
            <AlertTriangle className="h-4 w-4 mr-2" />
            Confirmar Cancelamento
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
