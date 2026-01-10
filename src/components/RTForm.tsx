import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, X } from 'lucide-react';
import { NaturezaRT, naturezaLabels } from '@/types/rt';
import { toast } from 'sonner';

interface RTFormProps {
  onSubmit: (rt: {
    numero: string;
    natureza: NaturezaRT;
    origem: string;
    destino: string;
    programacao?: string;
    peso: number;
    valor: number;
  }) => Promise<void>;
  onCancel?: () => void;
}

export const RTForm = ({ onSubmit, onCancel }: RTFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    numero: '',
    natureza: '' as NaturezaRT | '',
    origem: '',
    destino: '',
    programacao: '',
    peso: '',
    valor: '',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.numero || !formData.natureza || !formData.origem || !formData.destino) {
      toast.error('Preencha os campos obrigatórios');
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        numero: formData.numero.trim(),
        natureza: formData.natureza as NaturezaRT,
        origem: formData.origem.trim(),
        destino: formData.destino.trim(),
        programacao: formData.programacao || undefined,
        peso: parseFloat(formData.peso) || 0,
        valor: parseFloat(formData.valor) || 0,
      });

      setFormData({
        numero: '',
        natureza: '',
        origem: '',
        destino: '',
        programacao: '',
        peso: '',
        valor: '',
      });
    } finally {
      setIsSubmitting(false);
    }
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
            <Label htmlFor="natureza">Natureza *</Label>
            <Select
              value={formData.natureza}
              onValueChange={(value: NaturezaRT) => setFormData({ ...formData, natureza: value })}
            >
              <SelectTrigger className="transition-shadow focus:shadow-md">
                <SelectValue placeholder="Selecione a natureza" />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(naturezaLabels).map(([value, label]) => (
                  <SelectItem key={value} value={value}>
                    {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
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
            <Button 
              type="submit" 
              className="gradient-primary text-primary-foreground"
              disabled={isSubmitting}
            >
              <Plus className="h-4 w-4 mr-2" />
              {isSubmitting ? 'Cadastrando...' : 'Cadastrar RT'}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
