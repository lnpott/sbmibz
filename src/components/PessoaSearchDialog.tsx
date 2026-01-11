import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Coletor, Empresa } from '@/types/rt';
import { Search, Plus, User, UserPlus, Building2, Check, AlertCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
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

interface PessoaSearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pessoas: Coletor[];
  empresas: Empresa[];
  onSelect: (pessoa: Coletor) => void;
  onAddPessoa: (pessoa: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
    empresa_id?: string;
  }) => Promise<Coletor>;
  onUpdatePessoa: (params: { id: string; data: { nome?: string; telefone?: string; email?: string; empresa_id?: string } }) => Promise<void>;
  onAddEmpresa: (empresa: { nome: string }) => Promise<Empresa>;
  findByCPF: (cpf: string) => Coletor | undefined;
  title?: string;
}

const formatCPF = (value: string) => {
  const numbers = value.replace(/\D/g, '');
  return numbers
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})/, '$1-$2')
    .slice(0, 14);
};

export const PessoaSearchDialog = ({
  open,
  onOpenChange,
  pessoas,
  empresas,
  onSelect,
  onAddPessoa,
  onUpdatePessoa,
  onAddEmpresa,
  findByCPF,
  title = 'Selecionar Pessoa',
}: PessoaSearchDialogProps) => {
  const [search, setSearch] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showEmpresaDialog, setShowEmpresaDialog] = useState(false);
  const [showUpdateConfirm, setShowUpdateConfirm] = useState(false);
  const [foundPessoa, setFoundPessoa] = useState<Coletor | null>(null);
  
  const [newPessoa, setNewPessoa] = useState({
    nome: '',
    cpf: '',
    telefone: '',
    email: '',
    empresa_id: '',
    empresa_nome: '',
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setSearch('');
      setNewPessoa({
        nome: '',
        cpf: '',
        telefone: '',
        email: '',
        empresa_id: '',
        empresa_nome: '',
      });
      setFoundPessoa(null);
    }
  }, [open]);

  // Auto-preenchimento por CPF
  useEffect(() => {
    if (newPessoa.cpf.replace(/\D/g, '').length === 11) {
      const found = findByCPF(newPessoa.cpf);
      if (found) {
        setFoundPessoa(found);
        setNewPessoa({
          nome: found.nome,
          cpf: found.cpf,
          telefone: found.telefone || '',
          email: found.email || '',
          empresa_id: found.empresa_id || '',
          empresa_nome: found.empresa?.nome || '',
        });
      }
    }
  }, [newPessoa.cpf, findByCPF]);

  const filteredPessoas = pessoas.filter(
    (p) =>
      p.nome.toLowerCase().includes(search.toLowerCase()) ||
      p.cpf.includes(search)
  );

  const handleSelect = (pessoa: Coletor) => {
    onSelect(pessoa);
    onOpenChange(false);
  };

  const handleEmpresaSelect = (empresa: Empresa) => {
    setNewPessoa({
      ...newPessoa,
      empresa_id: empresa.id,
      empresa_nome: empresa.nome,
    });
    setShowEmpresaDialog(false);
  };

  const handleSubmitNew = async () => {
    if (!newPessoa.nome || !newPessoa.cpf) {
      toast.error('Nome e CPF são obrigatórios');
      return;
    }

    // Se encontrou pessoa existente, verificar se houve alteração
    if (foundPessoa) {
      const hasChanges =
        foundPessoa.nome !== newPessoa.nome ||
        foundPessoa.telefone !== newPessoa.telefone ||
        foundPessoa.email !== newPessoa.email ||
        foundPessoa.empresa_id !== newPessoa.empresa_id;

      if (hasChanges) {
        setShowUpdateConfirm(true);
        return;
      }

      // Sem alterações, apenas selecionar
      onSelect(foundPessoa);
      onOpenChange(false);
      return;
    }

    // Nova pessoa
    setIsSubmitting(true);
    try {
      const pessoa = await onAddPessoa({
        nome: newPessoa.nome.trim(),
        cpf: newPessoa.cpf.trim(),
        telefone: newPessoa.telefone.trim() || undefined,
        email: newPessoa.email.trim() || undefined,
        empresa_id: newPessoa.empresa_id || undefined,
      });
      onSelect(pessoa);
      onOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmUpdate = async () => {
    if (!foundPessoa) return;

    setIsSubmitting(true);
    try {
      await onUpdatePessoa({
        id: foundPessoa.id,
        data: {
          nome: newPessoa.nome.trim(),
          telefone: newPessoa.telefone.trim() || undefined,
          email: newPessoa.email.trim() || undefined,
          empresa_id: newPessoa.empresa_id || undefined,
        },
      });
      
      // Return updated person
      const updatedPessoa: Coletor = {
        ...foundPessoa,
        nome: newPessoa.nome.trim(),
        telefone: newPessoa.telefone.trim() || undefined,
        email: newPessoa.email.trim() || undefined,
        empresa_id: newPessoa.empresa_id || undefined,
      };
      
      onSelect(updatedPessoa);
      onOpenChange(false);
      setShowUpdateConfirm(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              {title}
            </DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="search" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="search" className="flex items-center gap-1">
                <Search className="h-4 w-4" />
                Buscar
              </TabsTrigger>
              <TabsTrigger value="new" className="flex items-center gap-1">
                <UserPlus className="h-4 w-4" />
                Cadastrar
              </TabsTrigger>
            </TabsList>

            <TabsContent value="search" className="space-y-4 pt-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou CPF..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-9"
                />
              </div>

              <ScrollArea className="h-[280px]">
                <div className="space-y-1">
                  {filteredPessoas.map((pessoa) => (
                    <button
                      key={pessoa.id}
                      onClick={() => handleSelect(pessoa)}
                      className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left group"
                    >
                      <div className="h-9 w-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                        <User className="h-4 w-4 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{pessoa.nome}</p>
                        <p className="text-xs text-muted-foreground">
                          {pessoa.cpf}
                          {pessoa.empresa && ` • ${pessoa.empresa.nome}`}
                        </p>
                      </div>
                      <Check className="h-4 w-4 text-primary opacity-0 group-hover:opacity-100" />
                    </button>
                  ))}

                  {filteredPessoas.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground text-sm">
                      <User className="h-10 w-10 mx-auto mb-2 opacity-30" />
                      Nenhuma pessoa encontrada
                    </div>
                  )}
                </div>
              </ScrollArea>
            </TabsContent>

            <TabsContent value="new" className="space-y-4 pt-4">
              {foundPessoa && (
                <div className="flex items-start gap-2 p-3 bg-blue-50 dark:bg-blue-950 rounded-lg text-sm border border-blue-200 dark:border-blue-800">
                  <AlertCircle className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5 shrink-0" />
                  <div>
                    <p className="font-medium text-blue-800 dark:text-blue-200">CPF já cadastrado</p>
                    <p className="text-blue-600 dark:text-blue-400">
                      Os dados foram preenchidos automaticamente. Edite se necessário.
                    </p>
                  </div>
                </div>
              )}

              <div className="grid gap-3">
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pessoa-cpf">CPF *</Label>
                    <Input
                      id="pessoa-cpf"
                      placeholder="000.000.000-00"
                      value={newPessoa.cpf}
                      onChange={(e) =>
                        setNewPessoa({ ...newPessoa, cpf: formatCPF(e.target.value) })
                      }
                      maxLength={14}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pessoa-nome">Nome *</Label>
                    <Input
                      id="pessoa-nome"
                      placeholder="Nome completo"
                      value={newPessoa.nome}
                      onChange={(e) =>
                        setNewPessoa({ ...newPessoa, nome: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="pessoa-telefone">Telefone</Label>
                    <Input
                      id="pessoa-telefone"
                      placeholder="(00) 00000-0000"
                      value={newPessoa.telefone}
                      onChange={(e) =>
                        setNewPessoa({ ...newPessoa, telefone: e.target.value })
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="pessoa-email">Email</Label>
                    <Input
                      id="pessoa-email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={newPessoa.email}
                      onChange={(e) =>
                        setNewPessoa({ ...newPessoa, email: e.target.value })
                      }
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Empresa</Label>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1 justify-start"
                      onClick={() => setShowEmpresaDialog(true)}
                    >
                      <Building2 className="h-4 w-4 mr-2 text-muted-foreground" />
                      {newPessoa.empresa_nome || 'Selecionar empresa...'}
                    </Button>
                    {newPessoa.empresa_id && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setNewPessoa({
                            ...newPessoa,
                            empresa_id: '',
                            empresa_nome: '',
                          })
                        }
                      >
                        ✕
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              <Button
                onClick={handleSubmitNew}
                disabled={!newPessoa.nome || !newPessoa.cpf || isSubmitting}
                className="w-full gradient-primary text-primary-foreground"
              >
                {isSubmitting
                  ? 'Processando...'
                  : foundPessoa
                  ? 'Confirmar Seleção'
                  : 'Cadastrar e Selecionar'}
              </Button>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Empresa Search Dialog */}
      <Dialog open={showEmpresaDialog} onOpenChange={setShowEmpresaDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-primary" />
              Selecionar Empresa
            </DialogTitle>
          </DialogHeader>
          <EmpresaList
            empresas={empresas}
            onSelect={handleEmpresaSelect}
            onAddEmpresa={onAddEmpresa}
          />
        </DialogContent>
      </Dialog>

      {/* Update Confirmation Dialog */}
      <AlertDialog open={showUpdateConfirm} onOpenChange={setShowUpdateConfirm}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Atualizar Dados?</AlertDialogTitle>
            <AlertDialogDescription>
              Os dados desta pessoa foram alterados. Deseja salvar as atualizações?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmUpdate}>
              {isSubmitting ? 'Salvando...' : 'Salvar Alterações'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

// Embedded Empresa List component
const EmpresaList = ({
  empresas,
  onSelect,
  onAddEmpresa,
}: {
  empresas: Empresa[];
  onSelect: (empresa: Empresa) => void;
  onAddEmpresa: (empresa: { nome: string }) => Promise<Empresa>;
}) => {
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);
  const [newNome, setNewNome] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const filtered = empresas.filter((e) =>
    e.nome.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = async () => {
    if (!newNome.trim()) return;
    setIsSubmitting(true);
    try {
      const emp = await onAddEmpresa({ nome: newNome.trim() });
      onSelect(emp);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
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

      <ScrollArea className="h-[200px]">
        <div className="space-y-1">
          {filtered.map((emp) => (
            <button
              key={emp.id}
              onClick={() => onSelect(emp)}
              className="w-full flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted transition-colors text-left"
            >
              <Building2 className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{emp.nome}</span>
            </button>
          ))}
          {filtered.length === 0 && !showAdd && (
            <p className="text-center py-4 text-muted-foreground text-sm">
              Nenhuma empresa encontrada
            </p>
          )}
        </div>
      </ScrollArea>

      {!showAdd ? (
        <Button variant="outline" className="w-full" onClick={() => setShowAdd(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Nova Empresa
        </Button>
      ) : (
        <div className="flex gap-2">
          <Input
            placeholder="Nome da empresa"
            value={newNome}
            onChange={(e) => setNewNome(e.target.value)}
          />
          <Button onClick={handleAdd} disabled={!newNome.trim() || isSubmitting}>
            {isSubmitting ? '...' : 'Salvar'}
          </Button>
        </div>
      )}
    </div>
  );
};
