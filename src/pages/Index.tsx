import { useState } from 'react';
import { useRTs } from '@/hooks/useRTs';
import { StatsCards } from '@/components/StatsCards';
import { SearchBar } from '@/components/SearchBar';
import { RTForm } from '@/components/RTForm';
import { RTTable } from '@/components/RTTable';
import { RTImpressao } from '@/components/RTImpressao';
import { AgentePicker, useSavedAgente } from '@/components/AgentePicker';
import { ColetaDialog } from '@/components/ColetaDialog';
import { DespachoDialog } from '@/components/DespachoDialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Plus, Package, Loader2, LayoutGrid, List, Check, MoreHorizontal, Truck, MapPin, Scale, DollarSign, Settings, Calendar, History, Undo2 } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RT, NaturezaRT, ClassificacaoCarga, naturezaLabels, classificacaoLabels, isParaDespacho, isParaColeta, isAereo } from '@/types/rt';
import { Link } from 'react-router-dom';

const Index = () => {
  const { rts, coletores, locais, agentesAtivos, empresas, isLoading, addRT, updateStatus, revertToColetada, addColetor, updateColetor, addEmpresa, addLocal, updateRT, findColetorByCPF } = useRTs();
  
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [printDialogOpen, setPrintDialogOpen] = useState(false);
  const [rtToPrint, setRtToPrint] = useState<RT | null>(null);
  
  // Estados para dialogs de coleta e despacho
  const [coletaDialogOpen, setColetaDialogOpen] = useState(false);
  const [despachoDialogOpen, setDespachoDialogOpen] = useState(false);
  const [selectedRT, setSelectedRT] = useState<RT | null>(null);
  
  const currentAgente = useSavedAgente(agentesAtivos);

  const pendingDespacho = rts.filter(rt => isParaDespacho(rt.natureza) && rt.status !== 'despachada');
  const pendingColeta = rts.filter(rt => isParaColeta(rt.natureza) && rt.status === 'pendente');
  const concluidas = rts.filter(rt => rt.status === 'despachada' || rt.status === 'coletada');

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

  const handleOpenColeta = (rt: RT) => {
    setSelectedRT(rt);
    setColetaDialogOpen(true);
  };

  const handleConfirmColeta = async (coletorId: string) => {
    if (selectedRT) {
      await updateStatus({ id: selectedRT.id, status: 'coletada', coletorId });
      setSelectedRT(null);
    }
  };

  const handleOpenDespacho = (rt: RT) => {
    setSelectedRT(rt);
    setDespachoDialogOpen(true);
  };

  const handleConfirmDespacho = async (data: { cia_aerea?: string; numero_voo?: string; observacao_despacho?: string }) => {
    if (selectedRT) {
      await updateStatus({ 
        id: selectedRT.id, 
        status: 'despachada',
        cia_aerea: data.cia_aerea,
        numero_voo: data.numero_voo,
        observacao_despacho: data.observacao_despacho,
      });
      setSelectedRT(null);
    }
  };

  const handleRevertToPendente = async (id: string) => {
    await updateStatus({ id, status: 'pendente' });
  };

  const handleRevertToColetada = async (id: string) => {
    await revertToColetada(id);
  };

  const formatCurrency = (value: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-12 w-12 animate-spin text-primary" />
      </div>
    );
  }

  const formatDateTime = (date: string | undefined | null) => {
    if (!date) return '-';
    return format(new Date(date), "dd/MM/yyyy HH:mm", { locale: ptBR });
  };

  const getPrevisaoLabel = (rt: RT) => {
    return isParaColeta(rt.natureza) ? 'Prev. Coleta' : 'Prev. Despacho';
  };

  const RTCardItem = ({ rt, showColeta, completed }: { rt: RT; showColeta?: boolean; completed?: boolean }) => {
    const canMarkColeta = isParaColeta(rt.natureza) && rt.status === 'pendente';
    const canMarkDespacho = isParaDespacho(rt.natureza) && (rt.status === 'pendente' || rt.status === 'coletada');
    const isCompleted = rt.status === 'despachada' || rt.status === 'coletada';
    const wasColetada = rt.status === 'despachada' && rt.coletada_em;

    return (
      <div className={`p-3 rounded-lg border transition-shadow hover:shadow-md ${completed ? 'bg-muted/50 opacity-75' : 'bg-background'}`}>
        <div className="flex items-start justify-between mb-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-sm">{rt.numero}</span>
            {rt.numeros_anteriores && rt.numeros_anteriores.length > 0 && (
              <Tooltip>
                <TooltipTrigger>
                  <Badge variant="outline" className="text-xs gap-1">
                    <History className="h-2.5 w-2.5" />
                    {rt.numeros_anteriores.length}
                  </Badge>
                </TooltipTrigger>
                <TooltipContent>
                  <div className="text-xs">
                    <p className="font-medium mb-1">Números anteriores:</p>
                    {rt.numeros_anteriores.map((num, idx) => (
                      <p key={idx}>{num}</p>
                    ))}
                  </div>
                </TooltipContent>
              </Tooltip>
            )}
            <Badge variant="outline" className="text-xs">{naturezaLabels[rt.natureza]}</Badge>
            <Badge variant={rt.classificacao === 'fragil' ? 'destructive' : 'secondary'} className="text-xs">{classificacaoLabels[rt.classificacao]}</Badge>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild><Button variant="ghost" size="icon" className="h-6 w-6"><MoreHorizontal className="h-3.5 w-3.5" /></Button></DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {canMarkColeta && (
                <DropdownMenuItem onClick={() => handleOpenColeta(rt)}>
                  <Package className="h-4 w-4 mr-2 text-info" />
                  Marcar como Coletada
                </DropdownMenuItem>
              )}
              {canMarkDespacho && (
                <DropdownMenuItem onClick={() => handleOpenDespacho(rt)}>
                  <Truck className="h-4 w-4 mr-2 text-success" />
                  Marcar como Despachada
                </DropdownMenuItem>
              )}
              {isCompleted && (
                <>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => handleRevertToPendente(rt.id)}>
                    <Undo2 className="h-4 w-4 mr-2" />
                    Retornar para Pendente
                  </DropdownMenuItem>
                  {wasColetada && (
                    <DropdownMenuItem onClick={() => handleRevertToColetada(rt.id)}>
                      <Undo2 className="h-4 w-4 mr-2" />
                      Retornar para Coletada
                    </DropdownMenuItem>
                  )}
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="space-y-1.5 text-xs text-muted-foreground">
          <div className="flex items-center gap-1"><MapPin className="h-3 w-3" /><span>{rt.origem} → {rt.destino}</span></div>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              <span>Entrada: {formatDateTime(rt.data_recebimento_base || rt.created_at)}</span>
            </div>
            {rt.data_prevista_despacho && (
              <div className="flex items-center gap-1">
                <span>{getPrevisaoLabel(rt)}: {formatDateTime(rt.data_prevista_despacho)}</span>
              </div>
            )}
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1"><Scale className="h-3 w-3" /><span>{Number(rt.peso).toFixed(2)} kg</span></div>
            <div className="flex items-center gap-1"><DollarSign className="h-3 w-3" /><span>{formatCurrency(Number(rt.valor))}</span></div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <AgentePicker agentes={agentesAtivos} onSelect={() => {}} />
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Sistema de RTs</h1>
            {currentAgente && <p className="text-sm text-muted-foreground">Agente: <span className="font-medium text-foreground">{currentAgente.nome}</span></p>}
          </div>
          <div className="flex items-center gap-2">
            <Link to="/configuracoes">
              <Button variant="outline" size="icon">
                <Settings className="h-4 w-4" />
              </Button>
            </Link>
            <Button onClick={() => setShowForm(!showForm)} className="gradient-primary text-primary-foreground shadow-lg"><Plus className="h-4 w-4 mr-2" />Nova RT</Button>
          </div>
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
            <RTTable rts={filteredRTs} coletores={coletores} empresas={empresas} onUpdateStatus={updateStatus} onRevertToColetada={revertToColetada} onAddColetor={addColetor} onUpdateColetor={updateColetor} onAddEmpresa={addEmpresa} findColetorByCPF={findColetorByCPF} onUpdateRT={updateRT} />
          </TabsContent>
        </Tabs>
      </div>

      <RTImpressao open={printDialogOpen} onOpenChange={setPrintDialogOpen} rt={rtToPrint} agente={currentAgente} />
      
      <ColetaDialog
        open={coletaDialogOpen}
        onOpenChange={setColetaDialogOpen}
        coletores={coletores}
        empresas={empresas}
        onConfirm={handleConfirmColeta}
        onAddColetor={addColetor}
        onUpdateColetor={updateColetor}
        onAddEmpresa={addEmpresa}
        findColetorByCPF={findColetorByCPF}
      />
      
      <DespachoDialog
        open={despachoDialogOpen}
        onOpenChange={setDespachoDialogOpen}
        onConfirm={handleConfirmDespacho}
        isAereo={selectedRT ? isAereo(selectedRT.natureza) : false}
      />
    </div>
  );
};

export default Index;
