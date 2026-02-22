import { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useRTNew } from '@/hooks/useRTNew';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useCurrentAgente } from '@/hooks/useCurrentAgente';
import { useVersionTracker } from '@/hooks/useVersionTracker';
import { EditDialog } from '@/components/EditDialog';
import { AddAgenteDialog } from '@/components/AddAgenteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Search } from 'lucide-react';
import { Agente, Empresa, Local, Coletor } from '@/types/rt';

// Componentes refatorados
import { ConfiguracoesHeader } from '@/components/configuracoes/ConfiguracoesHeader';
import { AgentesList } from '@/components/configuracoes/AgentesList';
import { EmpresasList } from '@/components/configuracoes/EmpresasList';
import { LocaisList } from '@/components/configuracoes/LocaisList';
import { ColetoresList } from '@/components/configuracoes/ColetoresList';
import { AuditLogsList } from '@/components/configuracoes/AuditLogsList';
import { SearchResults } from '@/components/configuracoes/SearchResults';

const Configuracoes = () => {
  const navigate = useNavigate();
  const { rts, coletores, locais, agentes, empresas } = useRTNew();
  const { logs, addLog } = useAuditLogs();
  const { updateAgente, addAgente, updateEmpresa, updateLocal, updatePessoa } = useConfiguracoes(addLog);
  const currentAgente = useCurrentAgente(agentes);
  const { manualIncrement, versionInfo } = useVersionTracker();

  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addAgenteDialogOpen, setAddAgenteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    tipo: 'agente' | 'empresa' | 'local' | 'pessoa';
    item: Agente | Empresa | Local | Coletor;
  } | null>(null);

  const handleIncrementVersion = () => {
    const newVersion = manualIncrement();
    // Recarrega apenas os dados necessários em vez da página inteira
    navigate(0); // Force refresh da rota atual
  };

  // Busca universal
  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { agentes: [], empresas: [], locais: [], coletores: [], rts: [] };
    
    const query = searchQuery.toLowerCase();
    
    return {
      agentes: agentes.filter(a => a.nome.toLowerCase().includes(query)),
      empresas: empresas.filter(e => e.nome.toLowerCase().includes(query)),
      locais: locais.filter(l => 
        l.codigo.toLowerCase().includes(query) || 
        (l.descricao?.toLowerCase().includes(query))
      ),
      coletores: coletores.filter(c => 
        c.nome.toLowerCase().includes(query) || 
        c.cpf.includes(query) ||
        (c.telefone?.includes(query)) ||
        (c.empresa?.nome?.toLowerCase().includes(query))
      ),
      rts: rts.filter(rt => 
        rt.numero.toLowerCase().includes(query) ||
        rt.origem.toLowerCase().includes(query) ||
        rt.destino.toLowerCase().includes(query) ||
        (rt.descricao?.toLowerCase().includes(query))
      ),
    };
  }, [searchQuery, agentes, empresas, locais, coletores, rts]);

  const handleEdit = (tipo: 'agente' | 'empresa' | 'local' | 'pessoa', item: Agente | Empresa | Local | Coletor) => {
    setSelectedItem({ tipo, item });
    setEditDialogOpen(true);
  };

  const handleSave = async (data: Record<string, unknown>) => {
    if (!selectedItem) return;

    const { tipo, item } = selectedItem;

    switch (tipo) {
      case 'agente':
        await updateAgente({ 
          id: item.id, 
          data: { nome: data.nome as string, ativo: data.ativo as boolean }, 
          dadosAnteriores: item as Agente 
        });
        break;
      case 'empresa':
        await updateEmpresa({ 
          id: item.id, 
          data: { nome: data.nome as string }, 
          dadosAnteriores: item as Empresa 
        });
        break;
      case 'local':
        await updateLocal({ 
          id: item.id, 
          data: { 
            codigo: data.codigo as string, 
            descricao: data.descricao as string | null 
          }, 
          dadosAnteriores: item as Local 
        });
        break;
      case 'pessoa':
        await updatePessoa({ 
          id: item.id, 
          data: { 
            nome: data.nome as string, 
            telefone: data.telefone as string | null,
            email: data.email as string | null,
            empresa_id: data.empresa_id as string | null
          }, 
          dadosAnteriores: item as Coletor 
        });
        break;
    }
    
    setEditDialogOpen(false);
    setSelectedItem(null);
  };

  return (
    <div className="container mx-auto py-6">
      <ConfiguracoesHeader
        currentAgente={currentAgente}
        versionInfo={versionInfo}
        onIncrementVersion={handleIncrementVersion}
      />

      <Tabs defaultValue="agentes" className="space-y-6">
        <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
          <TabsList className="grid w-full sm:w-auto grid-cols-3 lg:grid-cols-6">
            <TabsTrigger value="agentes">Agentes</TabsTrigger>
            <TabsTrigger value="empresas">Empresas</TabsTrigger>
            <TabsTrigger value="locais">Locais</TabsTrigger>
            <TabsTrigger value="coletores">Coletores</TabsTrigger>
            <TabsTrigger value="logs">Logs</TabsTrigger>
            <TabsTrigger value="busca">Busca</TabsTrigger>
          </TabsList>

          <div className="relative w-full sm:w-auto">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 w-full sm:w-64"
            />
          </div>
        </div>

        <TabsContent value="agentes" className="space-y-6">
          <AgentesList
            agentes={agentes}
            onEdit={(agente) => handleEdit('agente', agente)}
            onAdd={() => setAddAgenteDialogOpen(true)}
          />
        </TabsContent>

        <TabsContent value="empresas" className="space-y-6">
          <EmpresasList
            empresas={empresas}
            onEdit={(empresa) => handleEdit('empresa', empresa)}
          />
        </TabsContent>

        <TabsContent value="locais" className="space-y-6">
          <LocaisList
            locais={locais}
            onEdit={(local) => handleEdit('local', local)}
          />
        </TabsContent>

        <TabsContent value="coletores" className="space-y-6">
          <ColetoresList
            coletores={coletores}
            onEdit={(coletor) => handleEdit('pessoa', coletor)}
          />
        </TabsContent>

        <TabsContent value="logs" className="space-y-6">
          <AuditLogsList logs={logs} />
        </TabsContent>

        <TabsContent value="busca" className="space-y-6">
          <SearchResults
            searchQuery={searchQuery}
            results={searchResults}
            onEditAgente={(agente) => handleEdit('agente', agente)}
            onEditEmpresa={(empresa) => handleEdit('empresa', empresa)}
            onEditLocal={(local) => handleEdit('local', local)}
            onEditColetor={(coletor) => handleEdit('pessoa', coletor)}
          />
        </TabsContent>
      </Tabs>

      <EditDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        tipo={selectedItem?.tipo || 'agente'}
        item={selectedItem?.item || null}
        onSave={handleSave}
        empresas={empresas}
      />

      <AddAgenteDialog
        open={addAgenteDialogOpen}
        onOpenChange={setAddAgenteDialogOpen}
        onAdd={addAgente}
      />
    </div>
  );
};

export default Configuracoes;
