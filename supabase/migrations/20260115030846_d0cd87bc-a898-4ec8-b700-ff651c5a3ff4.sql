-- Adicionar novos valores ao enum natureza_rt
ALTER TYPE public.natureza_rt ADD VALUE IF NOT EXISTS 'aereo_despacho';
ALTER TYPE public.natureza_rt ADD VALUE IF NOT EXISTS 'aereo_coleta';
ALTER TYPE public.natureza_rt ADD VALUE IF NOT EXISTS 'aereo_transbordo';
ALTER TYPE public.natureza_rt ADD VALUE IF NOT EXISTS 'terrestre_despacho';
ALTER TYPE public.natureza_rt ADD VALUE IF NOT EXISTS 'terrestre_coleta';