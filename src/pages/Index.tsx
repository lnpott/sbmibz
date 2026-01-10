import { useState, useMemo } from 'react';
import { useRTs } from '@/hooks/useRTs';
import { RTForm } from '@/components/RTForm';
import { RTTable } from '@/components/RTTable';
import { StatsCards } from '@/components/StatsCards';
import { SearchBar } from '@/components/SearchBar';
import { Button } from '@/components/ui/button';
import { Plus, Package, Loader2 } from 'lucide-react';

const Index = () => {
  const { rts, coletores, isLoading, addRT, updateStatus, deleteRT, searchRTs, addColetor } = useRTs();
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredRTs = useMemo(() => {
    return searchRTs(searchQuery);
  }, [searchQuery, searchRTs]);

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
              await addRT(data);
              setShowForm(false);
            }}
            onCancel={() => setShowForm(false)}
          />
        )}

        {/* Search and Table */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <h2 className="text-lg font-semibold">Listagem de RTs</h2>
            <SearchBar value={searchQuery} onChange={setSearchQuery} />
          </div>

          <RTTable 
            rts={filteredRTs}
            coletores={coletores}
            onUpdateStatus={updateStatus}
            onDelete={deleteRT}
            onAddColetor={addColetor}
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
    </div>
  );
};

export default Index;
