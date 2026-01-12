import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Coletor, Empresa } from '@/types/rt';
import { Package, Search, User, Phone, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import { EmpresaSearchDialog } from './EmpresaSearchDialog';

interface ColetaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  coletores: Coletor[];
  empresas: Empresa[];
  onConfirm: (coletorId: string) => Promise<void>;
  onAddColetor: (coletor: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
    empresa_id?: string;
  }) => Promise<Coletor>;
  onUpdateColetor: (params: { id: string; data: { nome?: string; telefone?: string; email?: string; empresa_id?: string } }) => Promise<void>;
  onAddEmpresa: (empresa: { nome: string }) => Promise<Empresa>;
  findColetorByCPF: (cpf: string) => Coletor | undefined;
}

export const ColetaDialog = ({
  open,
  onOpenChange,
  coletores,
  empresas,
  onConfirm,
  onAddColetor,
  onUpdateColetor,
  onAddEmpresa,
  findColetorByCPF,
}: ColetaDialogProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [empresaDialogOpen, setEmpresaDialogOpen] = useState(false);
  const [existingColetor, setExistingColetor] = useState<Coletor | null>(null);

  const [formData, setFormData] = useState({
    cpf: '',
    nome: '',
    telefone: '',
    empresa_id: '',
    empresa_nome: '',
  });

  const formatCPF = (value: string) => {
    const digits = value.replace(/\D/g, '');
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})/, '$1-$2')
      .replace(/(-\d{2})\d+?$/, '$1');
  };

  const handleCPFChange = (value: string) => {
    const formatted = formatCPF(value);
    setFormData({ ...formData, cpf: formatted });

    const digits = value.replace(/\D/g, '');
    if (digits.length === 11) {
      const found = findColetorByCPF(digits);
      if (found) {
        setExistingColetor(found);
        setFormData({
          cpf: formatted,
          nome: found.nome,
          telefone: found.telefone || '',
          empresa_id: found.empresa_id || '',
          empresa_nome: found.empresa?.nome || '',
        });
        toast.info('Dados preenchidos automaticamente');
      } else {
        setExistingColetor(null);
      }
    }
  };

  const hasChanges = () => {
    if (!existingColetor) return false;
    return (
      formData.nome !== existingColetor.nome ||
      formData.telefone !== (existingColetor.telefone || '') ||
      formData.empresa_id !== (existingColetor.empresa_id || '')
    );
  };

  const handleSubmit = async () => {
    if (!formData.cpf || !formData.nome) {
      toast.error('CPF e Nome são obrigatórios');
      return;
    }

    if (existingColetor && hasChanges()) {
      setShowUpdateConfirm(true);
      return;
    }

    await processSubmit(false);
  };

  const processSubmit = async (updateExisting: boolean) => {
    setIsSubmitting(true);
    try {
      let coletorId: string;

      if (existingColetor) {
        if (updateExisting && hasChanges()) {
          await onUpdateColetor({
            id: existingColetor.id,
            data: {
              nome: formData.nome,
              telefone: formData.telefone || undefined,
              empresa_id: formData.empresa_id || undefined,
            },
          });
        }
        coletorId = existingColetor.id;
      } else {
        const newColetor = await onAddColetor({
          nome: formData.nome,
          cpf: formData.cpf.replace(/\D/g, ''),
          telefone: formData.telefone || undefined,
          empresa_id: formData.empresa_id || undefined,
        });
        coletorId = newColetor.id;
      }

      await onConfirm(coletorId);
      resetForm();
      onOpenChange(false);
    } catch {
      toast.error('Erro ao registrar coleta');
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({ cpf: '', nome: '', telefone: '', empresa_id: '', empresa_nome: '' });
    setExistingColetor(null);
  };

  const handleClose = (isOpen: boolean) => {
    if (!isOpen) resetForm();
    onOpenChange(isOpen);
  };

  return (
    <>
      <Dialog open={open} onOpenChange={handleClose}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              Registrar Coleta
            </DialogTitle>
            <DialogDescription>
              Informe os dados de quem está coletando a carga
            </DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="cpf">CPF *</Label>
              <Input
                id="cpf"
                placeholder="000.000.000-00"
                value={formData.cpf}
                onChange={(e) => handleCPFChange(e.target.value)}
                maxLength={14}
              />
              {existingColetor && (
                <p className="text-xs text-muted-foreground">
                  ✓ Pessoa encontrada no sistema
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="nome">Nome Completo *</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="nome"
                  className="pl-9"
                  placeholder="Nome do coletor"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefone">Telefone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="telefone"
                  className="pl-9"
                  placeholder="(00) 00000-0000"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Empresa</Label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    className="pl-9"
                    value={formData.empresa_nome}
                    readOnly
                    placeholder="Selecione..."
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setEmpresaDialogOpen(true)}
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => handleClose(false)}>
              Cancelar
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting || !formData.cpf || !formData.nome}
              className="gradient-primary text-primary-foreground"
            >
              {isSubmitting ? 'Registrando...' : 'Confirmar Coleta'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <EmpresaSearchDialog
        open={empresaDialogOpen}
        onOpenChange={setEmpresaDialogOpen}
        empresas={empresas}
        onSelect={(e) => setFormData({ ...formData, empresa_id: e.id, empresa_nome: e.nome })}
        onAddEmpresa={onAddEmpresa}
      />

      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados informados são diferentes do cadastro existente. Deseja atualizar o cadastro?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => processSubmit(false)}>
              Não, manter original
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => processSubmit(true)}>
              Sim, atualizar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};