import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Local } from '@/types/rt';
import { Search, Plus, MapPin, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface LocalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locais: Local[];
  onSelect: (local: Local) => void;
  onAddLocal: (local: { codigo: string; descricao?: string }) => Promise<Local>;
  title?: string;
}

export const LocalSearchDialog = ({
  open,
  onOpenChange,
  locais,
  onSelect,
  onAddLocal,
  title = 'Selecionar Local',
}: LocalSearchDialogProps) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newCodigo, setNewCodigo] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredLocais = locais.filter(
    (l) =>
      l.codigo.toLowerCase().includes(search.toLowerCase()) ||
      l.descricao?.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (local: Local) => {
    onSelect(local);
    onOpenChange(false);
    setSearch('');
  };

  const handleAddNew = async () => {
    if (!newCodigo.trim()) return;
    
    setIsSubmitting(true);
    try {
      const local = await onAddLocal({ codigo: newCodigo.trim().toUpperCase() });
      handleSelect(local);
      setNewCodigo('');
      setShowAddForm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar local..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[250px]">
            <div className="space-y-1">
              {filteredLocais.map((local) => (
                <button
                  key={local.id}
                  onClick={() => handleSelect(local)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{local.codigo}</p>
                    {local.descricao && (
                      <p className="text-xs text-muted-foreground truncate">
                        {local.descricao}
                      </p>
                    )}
                  </div>
                  <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                </button>
              ))}

              {filteredLocais.length === 0 && !showAddForm && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Nenhum local encontrado
                </div>
              )}
            </div>
          </ScrollArea>

          {!showAddForm ? (
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setShowAddForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              Adicionar Novo Local
            </Button>
          ) : (
            <div className="space-y-3 pt-2 border-t">
              <Label>Novo Local</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Código (ex: P-79)"
                  value={newCodigo}
                  onChange={(e) => setNewCodigo(e.target.value.toUpperCase())}
                />
                <Button
                  onClick={handleAddNew}
                  disabled={!newCodigo.trim() || isSubmitting}
                  className="shrink-0"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setShowAddForm(false);
                  setNewCodigo('');
                }}
              >
                Cancelar
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
