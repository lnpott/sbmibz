import { useState } from 'react';
import { RT, StatusRT, naturezaLabels, Coletor } from '@/types/rt';
import { StatusBadge } from './StatusBadge';
import { ColetaDialog } from './ColetaDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { MoreHorizontal, Package, Truck, Trash2, MapPin, Calendar, Scale, DollarSign, Plane, User } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface RTTableProps {
  rts: RT[];
  coletores: Coletor[];
  onUpdateStatus: (params: { id: string; status: StatusRT; coletorId?: string }) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddColetor: (coletor: {
    nome: string;
    cpf: string;
    telefone?: string;
    email?: string;
  }) => Promise<Coletor>;
}

export const RTTable = ({ rts, coletores, onUpdateStatus, onDelete, onAddColetor }: RTTableProps) => {
  const [coletaDialogOpen, setColetaDialogOpen] = useState(false);
  const [selectedRTId, setSelectedRTId] = useState<string | null>(null);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: string | undefined) => {
    if (!date) return '-';
    return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
  };

  const handleColeta = (id: string) => {
    setSelectedRTId(id);
    setColetaDialogOpen(true);
  };

  const handleConfirmColeta = async (coletorId: string) => {
    if (selectedRTId) {
      await onUpdateStatus({ id: selectedRTId, status: 'coletada', coletorId });
      setSelectedRTId(null);
    }
  };

  const handleDespacho = async (id: string) => {
    await onUpdateStatus({ id, status: 'despachada' });
  };

  const handleDelete = async (id: string) => {
    await onDelete(id);
  };

  if (rts.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center animate-fade-in">
        <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
          <Package className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium mb-1">Nenhuma RT encontrada</h3>
        <p className="text-muted-foreground text-sm">
          Cadastre uma nova RT ou ajuste sua busca
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-lg border bg-card overflow-hidden animate-fade-in">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/50">
              <TableHead className="font-semibold">Número</TableHead>
              <TableHead className="font-semibold">Natureza</TableHead>
              <TableHead className="font-semibold">Rota</TableHead>
              <TableHead className="font-semibold">Programação</TableHead>
              <TableHead className="font-semibold text-right">Peso</TableHead>
              <TableHead className="font-semibold text-right">Valor</TableHead>
              <TableHead className="font-semibold">Status</TableHead>
              <TableHead className="font-semibold">Coletor</TableHead>
              <TableHead className="font-semibold text-right">Ações</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rts.map((rt) => (
              <TableRow key={rt.id} className="hover:bg-muted/30 transition-colors">
                <TableCell className="font-medium">{rt.numero}</TableCell>
                <TableCell>
                  <Tooltip>
                    <TooltipTrigger>
                      <Badge variant="outline" className="flex items-center gap-1 w-fit">
                        <Plane className="h-3 w-3" />
                        {rt.natureza === 'entregador_aeronave' ? 'Aeronave' : 'Desembarque'}
                      </Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      {naturezaLabels[rt.natureza]}
                    </TooltipContent>
                  </Tooltip>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                    <span>{rt.origem}</span>
                    <span className="text-muted-foreground">→</span>
                    <span>{rt.destino}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatDate(rt.programacao)}
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm">
                    <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                    {Number(rt.peso).toFixed(2)} kg
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex items-center justify-end gap-1 text-sm">
                    <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                    {formatCurrency(Number(rt.valor))}
                  </div>
                </TableCell>
                <TableCell>
                  <StatusBadge status={rt.status} />
                </TableCell>
                <TableCell>
                  {rt.coletor ? (
                    <Tooltip>
                      <TooltipTrigger>
                        <div className="flex items-center gap-1.5 text-sm">
                          <User className="h-3.5 w-3.5 text-muted-foreground" />
                          {rt.coletor.nome.split(' ')[0]}
                        </div>
                      </TooltipTrigger>
                      <TooltipContent>
                        <div className="text-xs">
                          <p className="font-medium">{rt.coletor.nome}</p>
                          <p>CPF: {rt.coletor.cpf}</p>
                          {rt.coletor.telefone && <p>Tel: {rt.coletor.telefone}</p>}
                        </div>
                      </TooltipContent>
                    </Tooltip>
                  ) : (
                    <span className="text-muted-foreground text-sm">-</span>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48">
                      {rt.status === 'pendente' && (
                        <DropdownMenuItem onClick={() => handleColeta(rt.id)}>
                          <Package className="h-4 w-4 mr-2 text-info" />
                          Registrar Coleta
                        </DropdownMenuItem>
                      )}
                      {(rt.status === 'pendente' || rt.status === 'coletada') && (
                        <DropdownMenuItem onClick={() => handleDespacho(rt.id)}>
                          <Truck className="h-4 w-4 mr-2 text-success" />
                          Marcar como Despachada
                        </DropdownMenuItem>
                      )}
                      <DropdownMenuItem 
                        onClick={() => handleDelete(rt.id)}
                        className="text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Excluir RT
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <ColetaDialog
        open={coletaDialogOpen}
        onOpenChange={setColetaDialogOpen}
        coletores={coletores}
        onConfirm={handleConfirmColeta}
        onAddColetor={onAddColetor}
      />
    </>
  );
};
