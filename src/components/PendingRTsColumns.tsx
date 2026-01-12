import { RT, naturezaLabels, classificacaoLabels } from '@/types/rt';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Package, Truck, Trash2, MapPin, Calendar, Scale, DollarSign, Plane, Edit3 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface PendingRTsColumnsProps {
  despachoRTs: RT[];
  coletaRTs: RT[];
  onColeta: (id: string) => void;
  onDespacho: (id: string) => void;
  onEdit: (rt: RT) => void;
  onDelete: (id: string) => void;
}

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

const formatDate = (date: string | undefined) => {
  if (!date) return '-';
  return format(new Date(date), "dd/MM/yyyy", { locale: ptBR });
};

interface RTCardProps {
  rt: RT;
  type: 'despacho' | 'coleta';
  onColeta: (id: string) => void;
  onDespacho: (id: string) => void;
  onEdit: (rt: RT) => void;
  onDelete: (id: string) => void;
}

const RTCard = ({ rt, type, onColeta, onDespacho, onEdit, onDelete }: RTCardProps) => {
  return (
    <div className="p-3 bg-background rounded-lg border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{rt.numero}</span>
          <Badge variant="outline" className="text-xs">{naturezaLabels[rt.natureza]}</Badge>
          <Badge variant={rt.classificacao === 'fragil' ? 'destructive' : 'secondary'} className="text-xs">
            {classificacaoLabels[rt.classificacao]}
          </Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="h-6 w-6">
              <MoreHorizontal className="h-3.5 w-3.5" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(rt)}>
              <Edit3 className="h-4 w-4 mr-2 text-primary" />Editar RT
            </DropdownMenuItem>
            {type === 'coleta' && (
              <DropdownMenuItem onClick={() => onColeta(rt.id)}>
                <Package className="h-4 w-4 mr-2" />Registrar Coleta
              </DropdownMenuItem>
            )}
            <DropdownMenuItem onClick={() => onDespacho(rt.id)}>
              <Truck className="h-4 w-4 mr-2" />Marcar Despachada
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(rt.id)} className="text-destructive">
              <Trash2 className="h-4 w-4 mr-2" />Excluir RT
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{rt.origem} → {rt.destino}</span></div>
        {rt.natureza === 'despacho' && rt.programacao && (
          <div className="flex items-center gap-1"><Calendar className="h-3 w-3" /><span>{formatDate(rt.programacao)}</span></div>
        )}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1"><Scale className="h-3 w-3" /><span>{Number(rt.peso).toFixed(2)} kg</span></div>
          <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /><span>{formatCurrency(Number(rt.valor))}</span></div>
        </div>
      </div>
    </div>
  );
};

export const PendingRTsColumns = ({ despachoRTs, coletaRTs, onColeta, onDespacho, onEdit, onDelete }: PendingRTsColumnsProps) => {
  return (
    <div className="grid md:grid-cols-2 gap-4">
      <Card className="border-orange-200 dark:border-orange-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
              <Plane className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
            </div>
            <span>Pendentes para Despacho</span>
            <Badge variant="secondary" className="ml-auto">{despachoRTs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {despachoRTs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">Nenhuma RT pendente para despacho</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {despachoRTs.map((rt) => (
                <RTCard key={rt.id} rt={rt} type="despacho" onColeta={onColeta} onDespacho={onDespacho} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <Card className="border-blue-200 dark:border-blue-800">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <Package className="h-3.5 w-3.5 text-blue-600 dark:text-blue-400" />
            </div>
            <span>Pendentes para Coleta</span>
            <Badge variant="secondary" className="ml-auto">{coletaRTs.length}</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          {coletaRTs.length === 0 ? (
            <div className="text-center py-6 text-muted-foreground text-sm">Nenhuma RT pendente para coleta</div>
          ) : (
            <div className="space-y-2 max-h-[400px] overflow-y-auto pr-1">
              {coletaRTs.map((rt) => (
                <RTCard key={rt.id} rt={rt} type="coleta" onColeta={onColeta} onDespacho={onDespacho} onEdit={onEdit} onDelete={onDelete} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
