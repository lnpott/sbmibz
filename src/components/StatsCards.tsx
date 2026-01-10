import { RT } from '@/types/rt';
import { Card, CardContent } from '@/components/ui/card';
import { Package, Clock, Truck, FileText } from 'lucide-react';

interface StatsCardsProps {
  rts: RT[];
}

export const StatsCards = ({ rts }: StatsCardsProps) => {
  const total = rts.length;
  const pendentes = rts.filter(rt => rt.status === 'pendente').length;
  const retiradas = rts.filter(rt => rt.status === 'retirada').length;
  const despachadas = rts.filter(rt => rt.status === 'despachada').length;

  const stats = [
    {
      label: 'Total de RTs',
      value: total,
      icon: FileText,
      className: 'text-primary',
      bgClassName: 'bg-primary/10',
    },
    {
      label: 'Pendentes',
      value: pendentes,
      icon: Clock,
      className: 'text-warning',
      bgClassName: 'bg-warning/10',
    },
    {
      label: 'Retiradas',
      value: retiradas,
      icon: Package,
      className: 'text-info',
      bgClassName: 'bg-info/10',
    },
    {
      label: 'Despachadas',
      value: despachadas,
      icon: Truck,
      className: 'text-success',
      bgClassName: 'bg-success/10',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.label} className="animate-scale-in overflow-hidden">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${stat.bgClassName}`}>
                <stat.icon className={`h-5 w-5 ${stat.className}`} />
              </div>
              <div>
                <p className="text-2xl font-bold">{stat.value}</p>
                <p className="text-xs text-muted-foreground">{stat.label}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
