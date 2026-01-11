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
import { Empresa } from '@/types/rt';
import { Search, Plus, Building2, Check } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface EmpresaSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  empresas: Empresa[];
  onSelect: (empresa: Empresa) => void;
  onAddEmpresa: (empresa: { nome: string }) => Promise<Empresa>;
}

export const EmpresaSearchDialog = ({
  open,
  onOpenChange,
  empresas,
  onSelect,
  onAddEmpresa,
}: EmpresaSearchDialogProps) => {
  const [search, setSearch] = useState('');
  const [showAddForm, setShowAddForm] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filteredEmpresas = empresas.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleSelect = (empresa: Empresa) => {
    onSelect(empresa);
    onOpenChange(false);
    setSearch('');
  };

  const handleAddNew = async () => {
    if (!newNome.trim()) return;
    
    setIsSubmitting(true);
    try {
      const empresa = await onAddEmpresa({ nome: newNome.trim() });
      handleSelect(empresa);
      setNewNome('');
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
            <Building2 className="h-5 w-5 text-primary" />
            Selecionar Empresa
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar empresa..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="h-[250px]">
            <div className="space-y-1">
              {filteredEmpresas.map((empresa) => (
                <button
                  key={empresa.id}
                  onClick={() => handleSelect(empresa)}
                  className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
                >
                  <div className="h-8 w-8 rounded-md bg-primary/10 flex items-center justify-center shrink-0">
                    <Building2 className="h-4 w-4 text-primary" />
                  </div>
                  <p className="font-medium text-sm flex-1">{empresa.nome}</p>
                  <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                </button>
              ))}

              {filteredEmpresas.length === 0 && !showAddForm && (
                <div className="text-center py-6 text-muted-foreground text-sm">
                  Nenhuma empresa encontrada
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
              Adicionar Nova Empresa
            </Button>
          ) : (
            <div className="space-y-3 pt-2 border-t">
              <Label>Nova Empresa</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="Nome da empresa"
                  value={newNome}
                  onChange={(e) => setNewNome(e.target.value)}
                />
                <Button
                  onClick={handleAddNew}
                  disabled={!newNome.trim() || isSubmitting}
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
                  setNewNome('');
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
