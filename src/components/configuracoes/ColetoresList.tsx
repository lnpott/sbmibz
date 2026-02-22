import { Coletor } from '@/types/rt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, User, Building2 } from 'lucide-react';

interface ColetoresListProps {
  coletores: Coletor[];
  onEdit: (coletor: Coletor) => void;
}

export const ColetoresList = ({ coletores, onEdit }: ColetoresListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="h-5 w-5" />
          Coletores ({coletores.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {coletores.map((coletor) => (
            <div
              key={coletor.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <User className="h-5 w-5 text-purple-600" />
                <div className="flex-1">
                  <p className="font-medium">{coletor.nome}</p>
                  <p className="text-sm text-muted-foreground">CPF: {coletor.cpf}</p>
                  {coletor.telefone && (
                    <p className="text-sm text-muted-foreground">Tel: {coletor.telefone}</p>
                  )}
                  {coletor.empresa && (
                    <div className="flex items-center gap-1 mt-1">
                      <Building2 className="h-3 w-3 text-muted-foreground" />
                      <p className="text-xs text-muted-foreground">{coletor.empresa.nome}</p>
                    </div>
                  )}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(coletor)}
              >
                <Pencil className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
