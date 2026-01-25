import { useState, useMemo } from 'react';
import { useRTs } from '@/hooks/useRTs';
import { useAuditLogs } from '@/hooks/useAuditLogs';
import { useConfiguracoes } from '@/hooks/useConfiguracoes';
import { useSavedAgente } from '@/components/AgentePicker';
import { EditDialog } from '@/components/EditDialog';
import { AddAgenteDialog } from '@/components/AddAgenteDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ArrowLeft, Search, Users, Building2, MapPin, UserCheck, History, Plus, Pencil, User, Settings, LogOut } from 'lucide-react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { acaoLabels, tabelaLabels } from '@/types/audit';
import { Agente, Empresa, Local, Coletor } from '@/types/rt';
import { Link } from 'react-router-dom';

const Configuracoes = () => {
  const { rts, coletores, locais, agentes, empresas } = useRTs();
  const { logs, addLog } = useAuditLogs();
  const { updateAgente, addAgente, updateEmpresa, updateLocal, updatePessoa } = useConfiguracoes(addLog);
  const currentAgente = useSavedAgente(agentes);

  const [searchQuery, setSearchQuery] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addAgenteDialogOpen, setAddAgenteDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<{
    tipo: 'agente' | 'empresa' | 'local' | 'pessoa';
    item: Agente | Empresa | Local | Coletor;
  } | null>(null);

  const handleLogout = () => {
    localStorage.removeItem('agente_selecionado');
    window.location.reload();
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
          data: { codigo: data.codigo as string, descricao: data.descricao as string }, 
          dadosAnteriores: item as Local 
        });
        break;
      case 'pessoa':
        await updatePessoa({ 
          id: item.id, 
          data: { 
            nome: data.nome as string, 
            telefone: data.telefone as string, 
            email: data.email as string,
            empresa_id: data.empresa_id as string
          }, 
          dadosAnteriores: item as Coletor 
        });
        break;
    }
  };

  const hasSearchResults = searchQuery.trim() && (
    searchResults.agentes.length > 0 ||
    searchResults.empresas.length > 0 ||
    searchResults.locais.length > 0 ||
    searchResults.coletores.length > 0 ||
    searchResults.rts.length > 0
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div className="container mx-auto px-4 py-6 space-y-6 max-w-7xl">
        <div className="flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-5 w-5" />
            </Button>
          </Link>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Configurações</h1>
            <p className="text-sm text-muted-foreground">Gerenciamento de cadastros e histórico</p>
          </div>
        </div>

        {/* Busca Universal */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Search className="h-4 w-4" />
              Busca Universal
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Pesquisar RTs, agentes, empresas, locais, pessoas..."
              className="max-w-lg"
            />

            {/* Resultados da busca */}
            {hasSearchResults && (
              <div className="mt-4 space-y-4">
                {searchResults.rts.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">RTs ({searchResults.rts.length})</h3>
                    <div className="space-y-1">
                      {searchResults.rts.slice(0, 5).map(rt => (
                        <div key={rt.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{rt.numero} - {rt.origem} → {rt.destino}</span>
                          <Badge variant="outline">{rt.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.agentes.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Agentes ({searchResults.agentes.length})</h3>
                    <div className="space-y-1">
                      {searchResults.agentes.map(agente => (
                        <div key={agente.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{agente.nome}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('agente', agente)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.empresas.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Empresas ({searchResults.empresas.length})</h3>
                    <div className="space-y-1">
                      {searchResults.empresas.map(empresa => (
                        <div key={empresa.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{empresa.nome}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('empresa', empresa)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.locais.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Locais ({searchResults.locais.length})</h3>
                    <div className="space-y-1">
                      {searchResults.locais.map(local => (
                        <div key={local.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{local.codigo}{local.descricao && ` - ${local.descricao}`}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('local', local)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {searchResults.coletores.length > 0 && (
                  <div>
                    <h3 className="text-sm font-medium mb-2">Pessoas ({searchResults.coletores.length})</h3>
                    <div className="space-y-1">
                      {searchResults.coletores.map(pessoa => (
                        <div key={pessoa.id} className="flex items-center justify-between p-2 rounded bg-muted/50">
                          <span className="text-sm">{pessoa.nome} - {pessoa.cpf}{pessoa.empresa && ` (${pessoa.empresa.nome})`}</span>
                          <Button size="sm" variant="ghost" onClick={() => handleEdit('pessoa', pessoa)}>
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {searchQuery.trim() && !hasSearchResults && (
              <p className="mt-4 text-sm text-muted-foreground">Nenhum resultado encontrado.</p>
            )}
          </CardContent>
        </Card>

        {/* Tabs de gerenciamento */}
        <Tabs defaultValue="perfil" className="space-y-4">
          <TabsList>
            <TabsTrigger value="perfil" className="gap-2"><User className="h-4 w-4" />Perfil</TabsTrigger>
            <TabsTrigger value="agentes" className="gap-2"><UserCheck className="h-4 w-4" />Agentes</TabsTrigger>
            <TabsTrigger value="empresas" className="gap-2"><Building2 className="h-4 w-4" />Empresas</TabsTrigger>
            <TabsTrigger value="locais" className="gap-2"><MapPin className="h-4 w-4" />Locais</TabsTrigger>
            <TabsTrigger value="pessoas" className="gap-2"><Users className="h-4 w-4" />Pessoas</TabsTrigger>
            <TabsTrigger value="historico" className="gap-2"><History className="h-4 w-4" />Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="perfil">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <User className="h-4 w-4" />
                  Perfil do Usuário
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentAgente && (
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 rounded-lg border bg-muted/30">
                      <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <User className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{currentAgente.nome}</h3>
                        <p className="text-sm text-muted-foreground">Agente do Sistema</p>
                        <Badge variant={currentAgente.ativo ? 'default' : 'secondary'} className="mt-1">
                          {currentAgente.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <Settings className="h-4 w-4" />
                          ID do Agente
                        </div>
                        <p className="font-mono text-sm">{currentAgente.id}</p>
                      </div>
                      
                      <div className="p-3 rounded-lg border">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <UserCheck className="h-4 w-4" />
                          Status
                        </div>
                        <Badge variant={currentAgente.ativo ? 'default' : 'secondary'}>
                          {currentAgente.ativo ? 'Ativo no Sistema' : 'Inativo'}
                        </Badge>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button 
                        variant="destructive" 
                        onClick={handleLogout}
                        className="w-full gap-2"
                      >
                        <LogOut className="h-4 w-4" />
                        Sair do Sistema
                      </Button>
                      <p className="text-xs text-muted-foreground mt-2 text-center">
                        Ao sair, você precisará selecionar seu nome novamente ao acessar o sistema.
                      </p>
                    </div>
                  </div>
                )}
                
                {!currentAgente && (
                  <div className="text-center py-8">
                    <User className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">Nenhum agente selecionado</p>
                    <p className="text-sm text-muted-foreground mt-1">
                      Recarregue a página para selecionar um agente.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="agentes">
            <Card>
              <CardHeader className="pb-3 flex flex-row items-center justify-between">
                <CardTitle className="text-base">Agentes Cadastrados</CardTitle>
                <Button size="sm" onClick={() => setAddAgenteDialogOpen(true)}>
                  <Plus className="h-4 w-4 mr-1" />
                  Novo Agente
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {agentes.map(agente => (
                    <div key={agente.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{agente.nome}</span>
                        <Badge variant={agente.ativo ? 'default' : 'secondary'}>
                          {agente.ativo ? 'Ativo' : 'Inativo'}
                        </Badge>
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit('agente', agente)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="empresas">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Empresas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {empresas.map(empresa => (
                    <div key={empresa.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <span className="font-medium">{empresa.nome}</span>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit('empresa', empresa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {empresas.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma empresa cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="locais">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Locais Cadastrados</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {locais.map(local => (
                    <div key={local.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <span className="font-medium">{local.codigo}</span>
                        {local.descricao && <span className="text-muted-foreground ml-2">- {local.descricao}</span>}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit('local', local)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="pessoas">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Pessoas Cadastradas</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {coletores.map(pessoa => (
                    <div key={pessoa.id} className="flex items-center justify-between p-3 rounded-lg border">
                      <div>
                        <span className="font-medium">{pessoa.nome}</span>
                        <span className="text-muted-foreground ml-2">- {pessoa.cpf}</span>
                        {pessoa.empresa && (
                          <Badge variant="outline" className="ml-2">{pessoa.empresa.nome}</Badge>
                        )}
                      </div>
                      <Button size="sm" variant="ghost" onClick={() => handleEdit('pessoa', pessoa)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                  {coletores.length === 0 && (
                    <p className="text-sm text-muted-foreground text-center py-4">Nenhuma pessoa cadastrada</p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="historico">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base flex items-center gap-2">
                  <History className="h-4 w-4" />
                  Histórico de Alterações
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[500px]">
                  <div className="space-y-3">
                    {logs.map(log => (
                      <div key={log.id} className="p-3 rounded-lg border">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{tabelaLabels[log.tabela] || log.tabela}</Badge>
                            <Badge variant={log.acao === 'criacao' ? 'default' : log.acao === 'exclusao' ? 'destructive' : 'secondary'}>
                              {acaoLabels[log.acao]}
                            </Badge>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            {format(new Date(log.created_at), "dd/MM/yyyy 'às' HH:mm", { locale: ptBR })}
                          </span>
                        </div>
                        {log.descricao && (
                          <p className="text-sm text-muted-foreground">{log.descricao}</p>
                        )}
                        {log.dados_anteriores && (
                          <details className="mt-2 text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Ver dados anteriores</summary>
                            <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto">
                              {JSON.stringify(log.dados_anteriores, null, 2)}
                            </pre>
                          </details>
                        )}
                        {log.dados_novos && (
                          <details className="mt-2 text-xs">
                            <summary className="cursor-pointer text-muted-foreground">Ver dados novos</summary>
                            <pre className="mt-1 p-2 bg-muted rounded overflow-x-auto">
                              {JSON.stringify(log.dados_novos, null, 2)}
                            </pre>
                          </details>
                        )}
                      </div>
                    ))}
                    {logs.length === 0 && (
                      <p className="text-sm text-muted-foreground text-center py-8">Nenhum registro de alteração ainda</p>
                    )}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {selectedItem && (
        <EditDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          tipo={selectedItem.tipo}
          item={selectedItem.item}
          onSave={handleSave}
          empresas={empresas}
        />
      )}

      <AddAgenteDialog
        open={addAgenteDialogOpen}
        onOpenChange={setAddAgenteDialogOpen}
        onAdd={addAgente}
      />
    </div>
  );
};

export default Configuracoes;