import { Agente } from '@/types/rt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Pencil, User, UserCheck } from 'lucide-react';

interface AgentesListProps {
  agentes: Agente[];
  onEdit: (agente: Agente) => void;
  onAdd: () => void;
}

export const AgentesList = ({ agentes, onEdit, onAdd }: AgentesListProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Agentes ({agentes.length})
          </CardTitle>
          <Button onClick={onAdd} size="sm">
            Adicionar Agente
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {agentes.map((agente) => (
            <div
              key={agente.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <UserCheck className={`h-5 w-5 ${agente.ativo ? 'text-green-600' : 'text-gray-400'}`} />
                <div>
                  <p className="font-medium">{agente.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {agente.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={agente.ativo ? 'default' : 'secondary'}>
                  {agente.ativo ? 'Ativo' : 'Inativo'}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => onEdit(agente)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
