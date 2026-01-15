-- Adicionar coluna para histórico de numeração de RT
ALTER TABLE public.rts ADD COLUMN numeros_anteriores text[] DEFAULT '{}';