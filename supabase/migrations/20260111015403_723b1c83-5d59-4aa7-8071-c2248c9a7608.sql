-- Enum para classificação da carga
CREATE TYPE public.classificacao_carga AS ENUM ('comum', 'fragil');

-- Novo enum para natureza (substituindo o anterior)
-- Primeiro removemos a dependência
ALTER TABLE public.rts ALTER COLUMN natureza DROP DEFAULT;
ALTER TABLE public.rts ALTER COLUMN natureza TYPE text;
DROP TYPE IF EXISTS public.natureza_rt;

-- Criar novo enum com as novas opções
CREATE TYPE public.natureza_rt AS ENUM ('coleta', 'despacho', 'transbordo');

-- Atualizar valores existentes para o novo enum
UPDATE public.rts SET natureza = 'coleta' WHERE natureza = 'desembarque_desassistida';
UPDATE public.rts SET natureza = 'despacho' WHERE natureza = 'entregador_aeronave';

-- Converter coluna para o novo enum
ALTER TABLE public.rts ALTER COLUMN natureza TYPE natureza_rt USING natureza::natureza_rt;

-- Tabela de empresas (apenas nome conforme solicitado)
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público para leitura de empresas" ON public.empresas FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção de empresas" ON public.empresas FOR INSERT WITH CHECK (true);
CREATE POLICY "Acesso público para atualização de empresas" ON public.empresas FOR UPDATE USING (true);

-- Tabela de origens/destinos pré-cadastrados
CREATE TABLE public.locais (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  codigo TEXT NOT NULL UNIQUE,
  descricao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.locais ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público para leitura de locais" ON public.locais FOR SELECT USING (true);
CREATE POLICY "Acesso público para inserção de locais" ON public.locais FOR INSERT WITH CHECK (true);

-- Inserir locais pré-definidos
INSERT INTO public.locais (codigo) VALUES
  ('P-74'), ('P-75'), ('P-76'), ('P-77'), ('P-78'),
  ('SBMI'), ('NS48'), ('FPAT'), ('UMPT'), ('UMTJ'),
  ('SS70'), ('NS62'), ('NS47'), ('NS29'), ('UMAC');

-- Tabela de agentes aeroportuários
CREATE TABLE public.agentes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL UNIQUE,
  ativo BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.agentes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Acesso público para leitura de agentes" ON public.agentes FOR SELECT USING (true);

-- Inserir agentes pré-definidos
INSERT INTO public.agentes (nome) VALUES
  ('Lucas'), ('Carlos'), ('Kelly'), ('Henrique'), ('Guilherme'), ('Rosana');

-- Adicionar coluna empresa_id na tabela coletores
ALTER TABLE public.coletores ADD COLUMN empresa_id UUID REFERENCES public.empresas(id);

-- Adicionar novos campos na tabela rts
ALTER TABLE public.rts ADD COLUMN descricao TEXT;
ALTER TABLE public.rts ADD COLUMN classificacao classificacao_carga NOT NULL DEFAULT 'comum';
ALTER TABLE public.rts ADD COLUMN data_recebimento_base TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.rts ADD COLUMN data_prevista_despacho TIMESTAMP WITH TIME ZONE;
ALTER TABLE public.rts ADD COLUMN agente_id UUID REFERENCES public.agentes(id);
ALTER TABLE public.rts ADD COLUMN rt_origem_transbordo_id UUID REFERENCES public.rts(id);
ALTER TABLE public.rts ADD COLUMN entregador_id UUID REFERENCES public.coletores(id);

-- Alterar origem e destino para referenciarem locais
ALTER TABLE public.rts ADD COLUMN origem_id UUID REFERENCES public.locais(id);
ALTER TABLE public.rts ADD COLUMN destino_id UUID REFERENCES public.locais(id);

-- Habilitar realtime para novas tabelas
ALTER PUBLICATION supabase_realtime ADD TABLE public.empresas;
ALTER PUBLICATION supabase_realtime ADD TABLE public.locais;
ALTER PUBLICATION supabase_realtime ADD TABLE public.agentes;