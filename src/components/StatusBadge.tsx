import { StatusRT } from '@/types/rt';
import { Badge } from '@/components/ui/badge';
import { Clock, Package, Truck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StatusBadgeProps {
  status: StatusRT;
  className?: string;
}

const statusConfig: Record<StatusRT, { label: string; icon: React.ReactNode; className: string }> = {
  pendente: {
    label: 'Pendente',
    icon: <Clock className="h-3 w-3" />,
    className: 'bg-warning/10 text-warning border-warning/20 hover:bg-warning/20',
  },
  coletada: {
    label: 'Coletada',
    icon: <Package className="h-3 w-3" />,
    className: 'bg-info/10 text-info border-info/20 hover:bg-info/20',
  },
  despachada: {
    label: 'Despachada',
    icon: <Truck className="h-3 w-3" />,
    className: 'bg-success/10 text-success border-success/20 hover:bg-success/20',
  },
};

export const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const config = statusConfig[status];
  
  return (
    <Badge 
      variant="outline" 
      className={cn(
        'flex items-center gap-1.5 font-medium transition-colors',
        config.className,
        className
      )}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};
