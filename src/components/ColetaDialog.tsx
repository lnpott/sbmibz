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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coletor } from '@/types/rt';
import { UserPlus, Users } from 'lucide-react';
import { toast } from 'sonner';

interface ColetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coletores: Coletor[];
  onConfirm: (coletorId: string) => Promise<void>;
  onAddColetor: (coletor: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
  }) => Promise<Coletor>;
}

export const ColetaDialog = ({
  open,
  onOpenChange,
  coletores,
  onConfirm,
  onAddColetor,
}: ColetaDialogProps) => {
  const [selectedColetorId, setSelectedColetorId] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newColetor, setNewColetor] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
  });

  const handleSelectExisting = async () => {
    if (!selectedColetorId) {
      toast.error('Selecione um coletor');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await onConfirm(selectedColetorId);
      onOpenChange(false);
      setSelectedColetorId('');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddNew = async () => {
    if (!newColetor.nome || !newColetor.cpf) {
      toast.error('Preencha nome e CPF');
      return;
    }

    setIsSubmitting(true);
    try {
      const coletor = await onAddColetor({
        nome: newColetor.nome.trim(),
        cpf: newColetor.cpf.trim(),
        telefone: newColetor.telefone.trim() || undefined,
        email: newColetor.email.trim() || undefined,
      });
      
      await onConfirm(coletor.id);
      onOpenChange(false);
      setNewColetor({ nome: '', cpf: '', telefone: '', email: '' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatCPF = (value: string) => {
    const numbers = value.replace(/\D/g, '');
    return numbers
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .slice(0, 14);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Registrar Coleta
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="existing" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="existing" className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              Existente
            </TabsTrigger>
            <TabsTrigger value="new" className="flex items-center gap-1">
              <UserPlus className="h-4 w-4" />
              Novo Coletor
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="existing" className="space-y-4 pt-4">
            <div className="space-y-2">
              <Label>Selecionar Coletor</Label>
              <Select
                value={selectedColetorId}
                onValueChange={setSelectedColetorId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Escolha um coletor cadastrado" />
                </SelectTrigger>
                <SelectContent>
                  {coletores.map((coletor) => (
                    <SelectItem key={coletor.id} value={coletor.id}>
                      {coletor.nome} - {coletor.cpf}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {coletores.length === 0 && (
                <p className="text-sm text-muted-foreground">
                  Nenhum coletor cadastrado. Use a aba "Novo Coletor".
                </p>
              )}
            </div>
            
            <Button
              onClick={handleSelectExisting}
              disabled={!selectedColetorId || isSubmitting}
              className="w-full gradient-primary text-primary-foreground"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Coleta'}
            </Button>
          </TabsContent>
          
          <TabsContent value="new" className="space-y-4 pt-4">
            <div className="grid gap-3">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome Completo *</Label>
                <Input
                  id="nome"
                  placeholder="Nome do coletor"
                  value={newColetor.nome}
                  onChange={(e) => setNewColetor({ ...newColetor, nome: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="cpf">CPF *</Label>
                <Input
                  id="cpf"
                  placeholder="000.000.000-00"
                  value={newColetor.cpf}
                  onChange={(e) => setNewColetor({ ...newColetor, cpf: formatCPF(e.target.value) })}
                  maxLength={14}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="telefone">Telefone</Label>
                <Input
                  id="telefone"
                  placeholder="(00) 00000-0000"
                  value={newColetor.telefone}
                  onChange={(e) => setNewColetor({ ...newColetor, telefone: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="email@exemplo.com"
                  value={newColetor.email}
                  onChange={(e) => setNewColetor({ ...newColetor, email: e.target.value })}
                />
              </div>
            </div>
            
            <Button
              onClick={handleAddNew}
              disabled={!newColetor.nome || !newColetor.cpf || isSubmitting}
              className="w-full gradient-primary text-primary-foreground"
            >
              <UserPlus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar e Confirmar Coleta'}
            </Button>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
