import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Pencil, MapPin } from 'lucide-react';
import { Local } from '@/types/rt';

interface LocaisListProps {
  locais: Local[];
  onEdit: (local: Local) => void;
}

export const LocaisList = ({ locais, onEdit }: LocaisListProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Locais
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {locais.map((local) => (
            <div
              key={local.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div>
                <h4 className="font-medium">{local.codigo}</h4>
                <p className="text-sm text-muted-foreground">{local.descricao}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onEdit(local)}
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
