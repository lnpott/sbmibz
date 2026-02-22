import { AuditLog } from '@/types/audit';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { History } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { acaoLabels, tabelaLabels } from '@/types/audit';

interface AuditLogsListProps {
  logs: AuditLog[];
}

export const AuditLogsList = ({ logs }: AuditLogsListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <History className="h-5 w-5" />
          Logs de Auditoria ({logs.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ScrollArea className="h-[400px]">
          <div className="space-y-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="p-3 border rounded-lg space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">
                      {tabelaLabels[log.tabela as keyof typeof tabelaLabels] || log.tabela}
                    </Badge>
                    <Badge variant="secondary">
                      {acaoLabels[log.acao as keyof typeof acaoLabels] || log.acao}
                    </Badge>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {format(new Date(log.created_at), "dd/MM/yyyy HH:mm", { locale: ptBR })}
                  </span>
                </div>
                
                {log.descricao && (
                  <p className="text-sm">{log.descricao}</p>
                )}
                
                {log.usuario && (
                  <p className="text-xs text-muted-foreground">
                    Por: {log.usuario}
                  </p>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </CardContent>
    </Card>
  );
};
