-- Criar tabela de logs de auditoria
CREATE TABLE public.audit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  tabela TEXT NOT NULL,
  registro_id UUID NOT NULL,
  acao TEXT NOT NULL CHECK (acao IN ('criacao', 'edicao', 'exclusao', 'alteracao_status')),
  dados_anteriores JSONB,
  dados_novos JSONB,
  descricao TEXT,
  usuario TEXT
);

-- Habilitar RLS
ALTER TABLE public.audit_logs ENABLE ROW LEVEL SECURITY;

-- Políticas de acesso público
CREATE POLICY "Acesso público para leitura de logs"
ON public.audit_logs
FOR SELECT
USING (true);

CREATE POLICY "Acesso público para inserção de logs"
ON public.audit_logs
FOR INSERT
WITH CHECK (true);

-- Índices para melhor performance
CREATE INDEX idx_audit_logs_tabela ON public.audit_logs(tabela);
CREATE INDEX idx_audit_logs_registro_id ON public.audit_logs(registro_id);
CREATE INDEX idx_audit_logs_created_at ON public.audit_logs(created_at DESC);