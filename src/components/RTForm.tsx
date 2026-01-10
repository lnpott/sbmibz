import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, X } from 'lucide-react';
import { RT } from '@/types/rt';
import { toast } from 'sonner';

interface RTFormProps {
  onSubmit: (rt: Omit<RT, 'id' | 'status' | 'criadoEm'>) => void;
  onCancel?: () => void;
}

export const RTForm = ({ onSubmit, onCancel }: RTFormProps) => {
  const [formData, setFormData] = useState({
    numero: '',
    origem: '',
    destino: '',
    programacao: '',
    peso: '',
    valor: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.origem || !formData.destino) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    onSubmit({
      numero: formData.numero,
      origem: formData.origem,
      destino: formData.destino,
      programacao: formData.programacao,
      peso: parseFloat(formData.peso) || 0,
      valor: parseFloat(formData.valor) || 0,
    });

    setFormData({
      numero: '',
      origem: '',
      destino: '',
      programacao: '',
      peso: '',
      valor: '',
    });

    toast.success('RT cadastrada com sucesso!');
  };

  return (
    <Card className="animate-slide-up border-primary/20 shadow-lg">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg gradient-primary flex items-center justify-center">
              <Plus className="h-4 w-4 text-primary-foreground" />
            </div>
            Nova RT
          </CardTitle>
          {onCancel && (
            <Button variant="ghost" size="icon" onClick={onCancel}>
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          <div className="space-y-2">
            <Label htmlFor="numero">Número *</Label>
            <Input
              id="numero"
              placeholder="Ex: RT-001"
              value={formData.numero}
              onChange={(e) => setFormData({ ...formData, numero: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="origem">Origem *</Label>
            <Input
              id="origem"
              placeholder="Cidade de origem"
              value={formData.origem}
              onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="destino">Destino *</Label>
            <Input
              id="destino"
              placeholder="Cidade de destino"
              value={formData.destino}
              onChange={(e) => setFormData({ ...formData, destino: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="programacao">Programação</Label>
            <Input
              id="programacao"
              type="date"
              value={formData.programacao}
              onChange={(e) => setFormData({ ...formData, programacao: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="peso">Peso (kg)</Label>
            <Input
              id="peso"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.peso}
              onChange={(e) => setFormData({ ...formData, peso: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="valor">Valor (R$)</Label>
            <Input
              id="valor"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={formData.valor}
              onChange={(e) => setFormData({ ...formData, valor: e.target.value })}
              className="transition-shadow focus:shadow-md"
            />
          </div>
          
          <div className="sm:col-span-2 lg:col-span-3 flex justify-end gap-2 pt-2">
            {onCancel && (
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            )}
            <Button type="submit" className="gradient-primary text-primary-foreground">
              <Plus className="h-4 w-4 mr-2" />
              Cadastrar RT
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
