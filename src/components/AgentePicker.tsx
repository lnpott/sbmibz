import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Agente } from '@/types/rt';
import { User, Shield, Check } from 'lucide-react';

interface AgentePickerProps {
  open: boolean;
  onSelect: (agente: Agente) => void;
  agentes: Agente[];
}

const STORAGE_KEY = 'agente_selecionado';

export const AgentePicker = ({ open, onSelect, agentes }: AgentePickerProps) => {
  const [selected, setSelected] = useState<Agente | null>(null);

  // Load saved agente on mount
  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && agentes.length > 0) {
      const agente = agentes.find((a) => a.id === saved);
      if (agente) {
        onSelect(agente);
      }
    }
  }, [agentes, onSelect]);

  const handleConfirm = () => {
    if (selected) {
      localStorage.setItem(STORAGE_KEY, selected.id);
      onSelect(selected);
    }
  };

  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-md [&>button]:hidden">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Identificação do Agente
          </DialogTitle>
          <DialogDescription>
            Selecione seu nome para iniciar a operação do sistema.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-2 py-4">
          {agentes.map((agente) => (
            <button
              key={agente.id}
              onClick={() => setSelected(agente)}
              className={`flex items-center gap-3 p-3 rounded-lg border-2 transition-all ${
                selected?.id === agente.id
                  ? 'border-primary bg-primary/5'
                  : 'border-border hover:border-primary/50 hover:bg-muted'
              }`}
            >
              <div
                className={`h-10 w-10 rounded-full flex items-center justify-center ${
                  selected?.id === agente.id
                    ? 'bg-primary text-primary-foreground'
                    : 'bg-muted'
                }`}
              >
                <User className="h-5 w-5" />
              </div>
              <span className="font-medium flex-1 text-left">{agente.nome}</span>
              {selected?.id === agente.id && (
                <Check className="h-5 w-5 text-primary" />
              )}
            </button>
          ))}
        </div>

        <DialogFooter>
          <Button
            onClick={handleConfirm}
            disabled={!selected}
            className="w-full gradient-primary text-primary-foreground"
          >
            Confirmar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// Hook para obter o agente salvo
export const useSavedAgente = (agentes: Agente[]): Agente | null => {
  const [agente, setAgente] = useState<Agente | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved && agentes.length > 0) {
      const found = agentes.find((a) => a.id === saved);
      setAgente(found || null);
    }
  }, [agentes]);

  return agente;
};
