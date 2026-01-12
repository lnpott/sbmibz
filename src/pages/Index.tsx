import { useState, useMemo } from 'react';
import { useRTs } from '@/hooks/useRTs';
import { RTForm } from '@/components/RTForm';
import { RTTable } from '@/components/RTTable';
import { PendingRTsColumns } from '@/components/PendingRTsColumns';
import { ColetaDialog } from '@/components/ColetaDialog';
import { RTEditDialog } from '@/components/RTEditDialog';
import { StatsCards } from '@/components/StatsCards';
import { SearchBar } from '@/components/SearchBar';
import { AgentePicker } from '@/components/AgentePicker';
import { Button } from '@/components/ui/button';
import { Plus, Package, Loader2 } from 'lucide-react';
import { RT, NaturezaRT, ClassificacaoCarga } from '@/types/rt';

const Index = () => {
  const { 
    rts, 
    coletores, 
    locais, 
    agentes, 
    empresas, 
    isLoading, 
    addRT, 
    updateStatus, 
    deleteRT, 
    searchRTs, 
    addColetor, 
    updateColetor,
    addEmpresa,
    addLocal,
    updateRT 
  } = useRTs();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedAgente, setSelectedAgente] = useState<string | null>(null);
  
  // Estados para os dialogs das colunas pendentes
  const [coletaDialogOpen, setColetaDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedRTId, setSelectedRTId] = useState<string | null>(null);
  const [selectedRT, setSelectedRT] = useState<RT | null>(null);

  const filteredRTs = useMemo(() => {
    return searchRTs(searchQuery);
  }, [searchQuery, searchRTs]);

  // Separar RTs pendentes por natureza
  const pendingDespacho = useMemo(() => {
    return rts.filter(rt => rt.status === 'pendente' && rt.natureza === 'despacho');
  }, [rts]);

  const pendingColeta = useMemo(() => {
    return rts.filter(rt => rt.status === 'pendente' && (rt.natureza === 'coleta' || rt.natureza === 'transbordo'));
  }, [rts]);

  const handleColetaFromColumns = (id: string) => {
    setSelectedRTId(id);
    setColetaDialogOpen(true);
  };

  const handleConfirmColeta = async (coletorId: string) => {
    if (selectedRTId) {
      await updateStatus({ id: selectedRTId, status: 'coletada', coletorId });
      setSelectedRTId(null);
      setColetaDialogOpen(false);
    }
  };

  const handleDespachoFromColumns = async (id: string) => {
    await updateStatus({ id, status: 'despachada' });
  };

  const handleEditFromColumns = (rt: RT) => {
    setSelectedRT(rt);
    setEditDialogOpen(true);
  };

  const handleConfirmEdit = async (
    id: string,
    data: {
      numero: string;
      natureza: NaturezaRT;
      descricao?: string;
      classificacao: ClassificacaoCarga;
      origem: string;
      destino: string;
      programacao?: string;
      peso: number;
      valor: number;
    },
    motivo: string
  ) => {
    if (selectedRT) {
      await updateRT({ id, data, motivo, dadosAnteriores: selectedRT });
      setSelectedRT(null);
      setEditDialogOpen(false);
    }
  };

  const handleAgenteSelect = (agenteId: string) => {
    setSelectedAgente(agenteId);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-muted-foreground">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <AgentePicker agentes={agentes} onSelect={handleAgenteSelect} />
      
      <div className="min-h-screen bg-background">
        {/* Header */}
        <header className="border-b bg-card/80 glass-effect sticky top-0 z-50">
          <div className="container py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl gradient-primary flex items-center justify-center shadow-lg">
                  <Package className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h1 className="text-xl font-bold">Sistema de RTs</h1>
                  <p className="text-xs text-muted-foreground">Gerenciamento de Transportes</p>
                </div>
              </div>
              <Button 
                onClick={() => setShowForm(!showForm)}
                className={showForm ? 'bg-muted text-muted-foreground hover:bg-muted/80' : 'gradient-primary text-primary-foreground'}
              >
                <Plus className="h-4 w-4 mr-2" />
                {showForm ? 'Fechar' : 'Nova RT'}
              </Button>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="container py-6 space-y-6">
          {/* Stats */}
          <StatsCards rts={rts} />

          {/* Form */}
          {showForm && (
            <RTForm 
              onSubmit={async (data) => {
                await addRT({ ...data, agente_id: selectedAgente || undefined });
                setShowForm(false);
              }}
              onCancel={() => setShowForm(false)}
              locais={locais}
              coletores={coletores}
              empresas={empresas}
              onAddLocal={addLocal}
              onAddColetor={addColetor}
              onAddEmpresa={addEmpresa}
              onUpdateColetor={async (id, data) => {
                await updateColetor({ id, data });
              }}
            />
          )}

          {/* Pendentes em 2 colunas */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold">RTs Pendentes</h2>
            <PendingRTsColumns
              despachoRTs={pendingDespacho}
              coletaRTs={pendingColeta}
              onColeta={handleColetaFromColumns}
              onDespacho={handleDespachoFromColumns}
              onEdit={handleEditFromColumns}
              onDelete={deleteRT}
            />
          </div>

          {/* Search and Full Table */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
              <h2 className="text-lg font-semibold">Listagem Completa de RTs</h2>
              <SearchBar value={searchQuery} onChange={setSearchQuery} />
            </div>

            <RTTable 
              rts={filteredRTs}
              coletores={coletores}
              onUpdateStatus={updateStatus}
              onDelete={deleteRT}
              onAddColetor={addColetor}
              onUpdateRT={updateRT}
            />
          </div>
        </main>

        {/* Footer */}
        <footer className="border-t bg-card/50 mt-auto">
          <div className="container py-4">
            <p className="text-xs text-center text-muted-foreground">
              Sistema de Gerenciamento de RTs © {new Date().getFullYear()}
            </p>
          </div>
        </footer>

        {/* Dialogs para as colunas de pendentes */}
        <ColetaDialog
          open={coletaDialogOpen}
          onOpenChange={setColetaDialogOpen}
          coletores={coletores}
          onConfirm={handleConfirmColeta}
          onAddColetor={addColetor}
        />

        <RTEditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          rt={selectedRT}
          onConfirm={handleConfirmEdit}
        />
      </div>
    </>
  );
};

export default Index;