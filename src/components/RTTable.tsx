import { RT, RTStatus } from '@/types/rt';
import { StatusBadge } from './StatusBadge';
import { Button } from '@/components/ui/button';
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
import { MoreHorizontal, Package, Truck, Trash2, MapPin, Calendar, Scale, DollarSign } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { toast } from 'sonner';

interface RTTableProps {
  rts: RT[];
  onUpdateStatus: (id: string, status: RTStatus) => void;
  onDelete: (id: string) => void;
}

export const RTTable = ({ rts, onUpdateStatus, onDelete }: RTTableProps) => {
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const formatDate = (date: Date | string) => {
    if (!date) return '-';
    const d = typeof date === 'string' ? new Date(date) : date;
    return format(d, "dd/MM/yyyy", { locale: ptBR });
  };

  const handleRetirada = (id: string) => {
    onUpdateStatus(id, 'retirada');
    toast.success('RT marcada como retirada!');
  };

  const handleDespacho = (id: string) => {
    onUpdateStatus(id, 'despachada');
    toast.success('RT marcada como despachada!');
  };

  const handleDelete = (id: string) => {
    onDelete(id);
    toast.success('RT excluída com sucesso!');
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
    <div className="rounded-lg border bg-card overflow-hidden animate-fade-in">
      <Table>
        <TableHeader>
          <TableRow className="bg-muted/50">
            <TableHead className="font-semibold">Número</TableHead>
            <TableHead className="font-semibold">Rota</TableHead>
            <TableHead className="font-semibold">Programação</TableHead>
            <TableHead className="font-semibold text-right">Peso</TableHead>
            <TableHead className="font-semibold text-right">Valor</TableHead>
            <TableHead className="font-semibold">Status</TableHead>
            <TableHead className="font-semibold text-right">Ações</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rts.map((rt) => (
            <TableRow key={rt.id} className="hover:bg-muted/30 transition-colors">
              <TableCell className="font-medium">{rt.numero}</TableCell>
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
                  {rt.programacao ? formatDate(rt.programacao) : '-'}
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm">
                  <Scale className="h-3.5 w-3.5 text-muted-foreground" />
                  {rt.peso.toFixed(2)} kg
                </div>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex items-center justify-end gap-1 text-sm">
                  <DollarSign className="h-3.5 w-3.5 text-muted-foreground" />
                  {formatCurrency(rt.valor)}
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={rt.status} />
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
                      <DropdownMenuItem onClick={() => handleRetirada(rt.id)}>
                        <Package className="h-4 w-4 mr-2 text-info" />
                        Marcar como Retirada
                      </DropdownMenuItem>
                    )}
                    {(rt.status === 'pendente' || rt.status === 'retirada') && (
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
  );
};
