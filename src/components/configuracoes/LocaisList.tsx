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
          Locais ({locais.length})
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {locais.map((local) => (
            <div
              key={local.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center gap-3">
                <MapPin className="h-5 w-5 text-green-600" />
                <div>
                  <p className="font-medium">{local.codigo}</p>
                  {local.descricao && (
                    <p className="text-sm text-muted-foreground">{local.descricao}</p>
                  )}
                  <p className="text-xs text-muted-foreground">
                    ID: {local.id.slice(0, 8)}...
                  </p>
                </div>
              </div>
              <Button
                variant="ghost"
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
