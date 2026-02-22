import { Agente, Empresa, Local, Coletor, RT } from '@/types/rt';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Search, Users, Building2, MapPin, User, Package } from 'lucide-react';

interface SearchResultsProps {
  searchQuery: string;
  results: {
    agentes: Agente[];
    empresas: Empresa[];
    locais: Local[];
    coletores: Coletor[];
    rts: RT[];
  };
  onEditAgente: (agente: Agente) => void;
  onEditEmpresa: (empresa: Empresa) => void;
  onEditLocal: (local: Local) => void;
  onEditColetor: (coletor: Coletor) => void;
}

export const SearchResults = ({
  searchQuery,
  results,
  onEditAgente,
  onEditEmpresa,
  onEditLocal,
  onEditColetor
}: SearchResultsProps) => {
  const totalResults = results.agentes.length + results.empresas.length + 
                      results.locais.length + results.coletores.length + results.rts.length;

  if (!searchQuery.trim()) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-12">
          <Search className="h-12 w-12 text-muted-foreground mb-4" />
          <p className="text-lg font-medium">Busca Universal</p>
          <p className="text-sm text-muted-foreground text-center">
            Digite para buscar agentes, empresas, locais, coletores ou RTs
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5" />
            Resultados da Busca: "{searchQuery}" ({totalResults})
          </CardTitle>
        </CardHeader>
      </Card>

      {results.agentes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Users className="h-4 w-4" />
              Agentes ({results.agentes.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.agentes.map((agente) => (
                <div
                  key={agente.id}
                  className="flex items-center justify-between p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => onEditAgente(agente)}
                >
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    <span>{agente.nome}</span>
                  </div>
                  <Badge variant={agente.ativo ? 'default' : 'secondary'}>
                    {agente.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.empresas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Building2 className="h-4 w-4" />
              Empresas ({results.empresas.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.empresas.map((empresa) => (
                <div
                  key={empresa.id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => onEditEmpresa(empresa)}
                >
                  <Building2 className="h-4 w-4" />
                  <span>{empresa.nome}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.locais.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <MapPin className="h-4 w-4" />
              Locais ({results.locais.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.locais.map((local) => (
                <div
                  key={local.id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => onEditLocal(local)}
                >
                  <MapPin className="h-4 w-4" />
                  <div>
                    <span className="font-medium">{local.codigo}</span>
                    {local.descricao && (
                      <span className="text-sm text-muted-foreground ml-2">
                        {local.descricao}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.coletores.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="h-4 w-4" />
              Coletores ({results.coletores.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.coletores.map((coletor) => (
                <div
                  key={coletor.id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50 cursor-pointer"
                  onClick={() => onEditColetor(coletor)}
                >
                  <User className="h-4 w-4" />
                  <div>
                    <span className="font-medium">{coletor.nome}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      CPF: {coletor.cpf}
                    </span>
                    {coletor.empresa && (
                      <span className="text-xs text-muted-foreground ml-2">
                        {coletor.empresa.nome}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {results.rts.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="h-4 w-4" />
              RTs ({results.rts.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {results.rts.map((rt) => (
                <div
                  key={rt.id}
                  className="flex items-center gap-2 p-2 border rounded hover:bg-muted/50"
                >
                  <Package className="h-4 w-4" />
                  <div>
                    <span className="font-medium">{rt.numero}</span>
                    <span className="text-sm text-muted-foreground ml-2">
                      {rt.origem} → {rt.destino}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
