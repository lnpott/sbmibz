-- Adicionar campos para despacho aéreo
ALTER TABLE public.rts ADD COLUMN IF NOT EXISTS cia_aerea text;
ALTER TABLE public.rts ADD COLUMN IF NOT EXISTS numero_voo text;
ALTER TABLE public.rts ADD COLUMN IF NOT EXISTS observacao_despacho text;