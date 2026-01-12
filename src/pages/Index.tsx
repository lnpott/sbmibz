import { useState } from 'react';
import { useRTs } from '@/hooks/useRTs';
import { StatsCards } from '@/components/StatsCards';
import { SearchBar } from '@/components/SearchBar';
import { RTForm } from '@/components/RTForm';
import { RTTable } from '@/components/RTTable';
import { RTImpressao } from '@/components/RTImpressao';
import { AgentePicker, useSavedAgente } from '@/components/AgentePicker';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Package, Loader2, LayoutGrid, List, Check, MoreHorizontal, Truck, Trash2, MapPin, Scale, DollarSign } from 'lucide-react';
import { RT, NaturezaRT, ClassificacaoCarga, naturezaLabels, classificacaoLabels } from '@/types/rt';

const Index = () => {
  const { rts, coletores, locais, agentes, empresas, isLoading, addRT, updateStatus, deleteRT, addColetor, updateColetor, addEmpresa, addLocal, updateRT, findColetorByCPF } = useRTs();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [rtToPrint, setRtToPrint] = useState<RT | null>(null);
  
  const currentAgente = useSavedAgente(agentes);

  const pendingDespacho = rts.filter(rt => (rt.natureza === 'despacho' || rt.natureza === 'transbordo') && rt.status !== 'despachada');
  const pendingColeta = rts.filter(rt => rt.natureza === 'coleta' && rt.status === 'pendente');
  const concluidas = rts.filter(rt => rt.status === 'despachada');

  const filteredRTs = rts.filter(rt => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase();
    return rt.numero.toLowerCase().includes(query) || rt.origem.toLowerCase().includes(query) || rt.destino.toLowerCase().includes(query);
  });

  const handleSubmit = async (data: { numero: string; natureza: NaturezaRT; descricao?: string; classificacao: ClassificacaoCarga; origem: string; origem_id?: string; destino: string; destino_id?: string; programacao?: string; data_recebimento_base?: string; data_prevista_despacho?: string; peso: number; valor: number; entregador_id?: string; }) => {
    const newRT = await addRT({ ...data, agente_id: currentAgente?.id });
    setShowForm(false);
    setRtToPrint(newRT);
    setPrintDialogOpen(true);
  };

  const handleDespacho = async (id: string) => { await updateStatus({ id, status: 'despachada' }); };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const RTCardItem = ({ rt, showColeta, completed }: { rt: RT; showColeta?: boolean; completed?: boolean }) => (
    <div className={`p-3 rounded-lg border transition-shadow hover:shadow-md ${completed ? 'bg-muted/50 opacity-75' : 'bg-background'}`}>
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-semibold text-sm">{rt.numero}</span>
          <Badge variant="outline" className="text-xs">{naturezaLabels[rt.natureza]}</Badge>
          <Badge variant={rt.classificacao === 'fragil' ? 'destructive' : 'secondary'} className="text-xs">{classificacaoLabels[rt.classificacao]}</Badge>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {!completed && <DropdownMenuItem onClick={() => handleDespacho(rt.id)}><Truck className="h-4 w-4 mr-2" />Marcar Despachada</DropdownMenuItem>}
            <DropdownMenuItem onClick={() => deleteRT(rt.id)} className="text-destructive"><Trash2 className="h-4 w-4 mr-2" />Excluir RT</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-1.5 text-xs text-muted-foreground">
        <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{rt.origem} → {rt.destino}</span></div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1"><Scale className="h-3 w-3" /><span>{Number(rt.peso).toFixed(2)} kg</span></div>
          <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /><span>{formatCurrency(Number(rt.valor))}</span></div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <AgentePicker agentes={agentes} onSelect={() => {}} />
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sistema de RTs</h1>
            {currentAgente && <p className="text-sm text-muted-foreground">Agente: <span className="font-medium text-foreground">{currentAgente.nome}</span></p>}
          </div>
          <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground shadow-lg"><Plus className="h-4 w-4 mr-2" />Nova RT</Button>
        </div>

        <StatsCards rts={rts} />

        {showForm && <RTForm onSubmit={handleSubmit} onCancel={() => setShowForm(false)} locais={locais} coletores={coletores} empresas={empresas} agente={currentAgente} onAddLocal={addLocal} onAddColetor={addColetor} onUpdateColetor={updateColetor} onAddEmpresa={addEmpresa} findColetorByCPF={findColetorByCPF} />}

        <Tabs defaultValue="columns" className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <TabsList>
              <TabsTrigger value="columns" className="gap-2"><LayoutGrid className="h-4 w-4" />Colunas</TabsTrigger>
              <TabsTrigger value="table" className="gap-2"><List className="h-4 w-4" />Tabela</TabsTrigger>
            </TabsList>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <TabsContent value="columns" className="space-y-4">
            <div className="grid lg:grid-cols-3 gap-4">
              <Card className="border-orange-200 dark:border-orange-800/50">
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><div className="h-6 w-6 rounded-md bg-orange-100 dark:bg-orange-900/50 flex items-center justify-center"><Package className="h-3.5 w-3.5 text-orange-600" /></div>Em Trânsito para Despacho<Badge variant="secondary" className="ml-auto">{pendingDespacho.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0">{pendingDespacho.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma RT pendente</div> : <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">{pendingDespacho.map(rt => <RTCardItem key={rt.id} rt={rt} />)}</div>}</CardContent>
              </Card>

              <Card className="border-blue-200 dark:border-blue-800/50">
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><div className="h-6 w-6 rounded-md bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center"><Package className="h-3.5 w-3.5 text-blue-600" /></div>Aguardando Coleta<Badge variant="secondary" className="ml-auto">{pendingColeta.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0">{pendingColeta.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma RT aguardando</div> : <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">{pendingColeta.map(rt => <RTCardItem key={rt.id} rt={rt} showColeta />)}</div>}</CardContent>
              </Card>

              <Card className="border-green-200 dark:border-green-800/50">
                <CardHeader className="pb-3"><CardTitle className="text-base flex items-center gap-2"><div className="h-6 w-6 rounded-md bg-green-100 dark:bg-green-900/50 flex items-center justify-center"><Check className="h-3.5 w-3.5 text-green-600" /></div>Processo Concluído<Badge variant="secondary" className="ml-auto">{concluidas.length}</Badge></CardTitle></CardHeader>
                <CardContent className="pt-0">{concluidas.length === 0 ? <div className="text-center py-8 text-muted-foreground text-sm">Nenhuma RT concluída</div> : <div className="space-y-2 max-h-[500px] overflow-y-auto pr-1">{concluidas.map(rt => <RTCardItem key={rt.id} rt={rt} completed />)}</div>}</CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="table">
            <RTTable rts={filteredRTs} coletores={coletores} empresas={empresas} onUpdateStatus={updateStatus} onDelete={deleteRT} onAddColetor={addColetor} onUpdateColetor={updateColetor} onAddEmpresa={addEmpresa} findColetorByCPF={findColetorByCPF} onUpdateRT={updateRT} />
          </TabsContent>
        </Tabs>
      </div>

      <RTImpressao open={printDialogOpen} onOpenChange={setPrintDialogOpen} rt={rtToPrint} agente={currentAgente} />
    </div>
  );
};

export default Index;