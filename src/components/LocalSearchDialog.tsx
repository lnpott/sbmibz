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
import { Local, CategoriaLocal, categoriaLocalLabels } from '@/types/rt';
import { Search, Plus, MapPin, Check, Building2, Factory } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LocalSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  locais: Local[];
  onSelect: (local: Local) => void;
  onAddLocal: (local: { codigo: string; descricao?: string; categoria?: CategoriaLocal }) => Promise<Local>;
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
  const [newDescricao, setNewDescricao] = useState('');
  const [newCategoria, setNewCategoria] = useState<CategoriaLocal>('onshore');
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
      const local = await onAddLocal({ 
        codigo: newCodigo.trim().toUpperCase(),
        descricao: newDescricao.trim() || undefined,
        categoria: newCategoria
      });
      handleSelect(local);
      setNewCodigo('');
      setNewDescricao('');
      setNewCategoria('onshore');
      setShowAddForm(false);
    } catch (error) {
      console.error('Erro ao adicionar local:', error);
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
                  <div className={`h-8 w-8 rounded-md flex items-center justify-center shrink-0 ${
                    local.categoria === 'offshore' 
                      ? 'bg-blue-100 dark:bg-blue-900/50' 
                      : 'bg-green-100 dark:bg-green-900/50'
                  }`}>
                    {local.categoria === 'offshore' ? (
                      <Building2 className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                    ) : (
                      <Factory className="h-4 w-4 text-green-600 dark:text-green-400" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{local.codigo}</p>
                    {local.descricao && (
                      <p className="text-xs text-muted-foreground truncate">
                        {local.descricao}
                      </p>
                    )}
                    <Badge variant="outline" className="text-xs mt-1">
                      {categoriaLocalLabels[local.categoria]}
                    </Badge>
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
              <Input
                placeholder="Código (ex: P-79)"
                value={newCodigo}
                onChange={(e) => setNewCodigo(e.target.value.toUpperCase())}
              />
              <Input
                placeholder="Descrição (opcional)"
                value={newDescricao}
                onChange={(e) => setNewDescricao(e.target.value)}
              />
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={newCategoria} onValueChange={(value: CategoriaLocal) => setNewCategoria(value)}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione a categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="onshore">
                      <div className="flex items-center gap-2">
                        <Factory className="h-4 w-4" />
                        {categoriaLocalLabels.onshore}
                      </div>
                    </SelectItem>
                    <SelectItem value="offshore">
                      <div className="flex items-center gap-2">
                        <Building2 className="h-4 w-4" />
                        {categoriaLocalLabels.offshore}
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleAddNew}
                  disabled={!newCodigo.trim() || isSubmitting}
                  className="flex-1"
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowAddForm(false);
                    setNewCodigo('');
                    setNewDescricao('');
                    setNewCategoria('onshore');
                  }}
                >
                  Cancelar
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
