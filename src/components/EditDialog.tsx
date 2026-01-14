import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Agente, Empresa, Local, Coletor } from '@/types/rt';

interface EditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tipo: 'agente' | 'empresa' | 'local' | 'pessoa';
  item: Agente | Empresa | Local | Coletor | null;
  onSave: (data: Record<string, unknown>) => Promise<void>;
  empresas?: Empresa[];
}

export const EditDialog = ({ open, onOpenChange, tipo, item, onSave, empresas = [] }: EditDialogProps) => {
  const [formData, setFormData] = useState<Record<string, unknown>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (item) {
      setFormData(item as unknown as Record<string, unknown>);
    }
  }, [item]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      await onSave(formData);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const getTitulo = () => {
    switch (tipo) {
      case 'agente': return 'Editar Agente';
      case 'empresa': return 'Editar Empresa';
      case 'local': return 'Editar Local';
      case 'pessoa': return 'Editar Pessoa';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{getTitulo()}</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {tipo === 'agente' && (
            <>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={(formData.nome as string) || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  checked={(formData.ativo as boolean) || false}
                  onCheckedChange={(checked) => setFormData({ ...formData, ativo: checked })}
                />
                <Label>Ativo</Label>
              </div>
            </>
          )}

          {tipo === 'empresa' && (
            <div className="space-y-2">
              <Label>Nome</Label>
              <Input
                value={(formData.nome as string) || ''}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              />
            </div>
          )}

          {tipo === 'local' && (
            <>
              <div className="space-y-2">
                <Label>Código</Label>
                <Input
                  value={(formData.codigo as string) || ''}
                  onChange={(e) => setFormData({ ...formData, codigo: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Descrição</Label>
                <Input
                  value={(formData.descricao as string) || ''}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                />
              </div>
            </>
          )}

          {tipo === 'pessoa' && (
            <>
              <div className="space-y-2">
                <Label>Nome</Label>
                <Input
                  value={(formData.nome as string) || ''}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>CPF</Label>
                <Input
                  value={(formData.cpf as string) || ''}
                  disabled
                  className="bg-muted"
                />
              </div>
              <div className="space-y-2">
                <Label>Telefone</Label>
                <Input
                  value={(formData.telefone as string) || ''}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>E-mail</Label>
                <Input
                  type="email"
                  value={(formData.email as string) || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Empresa</Label>
                <select
                  value={(formData.empresa_id as string) || ''}
                  onChange={(e) => setFormData({ ...formData, empresa_id: e.target.value || null })}
                  className="w-full h-10 px-3 rounded-md border border-input bg-background text-sm"
                >
                  <option value="">Sem empresa</option>
                  {empresas.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.nome}</option>
                  ))}
                </select>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? 'Salvando...' : 'Salvar'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
