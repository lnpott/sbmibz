import { Empresa } from '@/types/rt';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, Building2 } from 'lucide-react';

interface EmpresasListProps {
  empresas: Empresa[];
  onEdit: (empresa: Empresa) => void;
}

export const EmpresasList = ({ empresas, onEdit }: EmpresasListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Empresas ({empresas.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {empresas.map((empresa) => (
            <div
              key={empresa.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <Building2 className="h-5 w-5 text-blue-600" />
                <div>
                  <p className="font-medium">{empresa.nome}</p>
                  <p className="text-sm text-muted-foreground">
                    ID: {empresa.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit(empresa)}
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
