-- Enum para natureza do recebimento
CREATE TYPE public.natureza_rt AS ENUM ('entregador_aeronave', 'desembarque_desassistida');

-- Enum para status da RT
CREATE TYPE public.status_rt AS ENUM ('pendente', 'coletada', 'despachada');

-- Tabela de coletores (pessoas que fazem coleta)
CREATE TABLE public.coletores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  cpf TEXT NOT NULL UNIQUE,
  telefone TEXT,
  email TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Tabela de RTs
CREATE TABLE public.rts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  numero TEXT NOT NULL UNIQUE,
  natureza natureza_rt NOT NULL,
  origem TEXT NOT NULL,
  destino TEXT NOT NULL,
  programacao DATE,
  peso DECIMAL(10,2) NOT NULL DEFAULT 0,
  valor DECIMAL(12,2) NOT NULL DEFAULT 0,
  status status_rt NOT NULL DEFAULT 'pendente',
  coletor_id UUID REFERENCES public.coletores(id),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  coletada_em TIMESTAMP WITH TIME ZONE,
  despachada_em TIMESTAMP WITH TIME ZONE
);

-- Habilitar RLS
ALTER TABLE public.coletores ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.rts ENABLE ROW LEVEL SECURITY;

-- Políticas públicas (sem autenticação por enquanto)
CREATE POLICY "Acesso público para leitura de coletores"
  ON public.coletores FOR SELECT
  USING (true);

CREATE POLICY "Acesso público para inserção de coletores"
  ON public.coletores FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Acesso público para atualização de coletores"
  ON public.coletores FOR UPDATE
  USING (true);

CREATE POLICY "Acesso público para leitura de RTs"
  ON public.rts FOR SELECT
  USING (true);

CREATE POLICY "Acesso público para inserção de RTs"
  ON public.rts FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Acesso público para atualização de RTs"
  ON public.rts FOR UPDATE
  USING (true);

CREATE POLICY "Acesso público para exclusão de RTs"
  ON public.rts FOR DELETE
  USING (true);

-- Trigger para atualizar updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER update_coletores_updated_at
  BEFORE UPDATE ON public.coletores
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar realtime para RTs
ALTER PUBLICATION supabase_realtime ADD TABLE public.rts;