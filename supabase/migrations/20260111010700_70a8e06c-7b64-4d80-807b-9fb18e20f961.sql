-- Tabela para armazenar histórico de edições das RTs
CREATE TABLE public.rt_edicoes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  rt_id UUID NOT NULL REFERENCES public.rts(id) ON DELETE CASCADE,
  motivo TEXT NOT NULL,
  dados_anteriores JSONB NOT NULL,
  dados_novos JSONB NOT NULL,
  editado_em TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS
ALTER TABLE public.rt_edicoes ENABLE ROW LEVEL SECURITY;

-- Políticas públicas temporárias
CREATE POLICY "Acesso público para leitura de edições" 
ON public.rt_edicoes 
FOR SELECT 
USING (true);

CREATE POLICY "Acesso público para inserção de edições" 
ON public.rt_edicoes 
FOR INSERT 
WITH CHECK (true);

-- Remover constraint UNIQUE do número da RT para permitir edições
ALTER TABLE public.rts DROP CONSTRAINT IF EXISTS rts_numero_key;