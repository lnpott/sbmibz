-- Adicionar statuses cancelados ao enum status_rt
-- Primeiro remover a constraint de check
ALTER TABLE public.rts ALTER COLUMN status DROP DEFAULT;

-- Converter para texto temporariamente
ALTER TABLE public.rts ALTER COLUMN status TYPE text;

-- Dropar o enum antigo
DROP TYPE IF EXISTS public.status_rt;

-- Criar novo enum com todos os statuses
CREATE TYPE public.status_rt AS ENUM ('pendente', 'coletada', 'despachada', 'embarque_cancelado', 'coleta_cancelada');

-- Converter coluna para o novo enum
ALTER TABLE public.rts ALTER COLUMN status TYPE status_rt USING status::status_rt;

-- Restaurar default
ALTER TABLE public.rts ALTER COLUMN status SET DEFAULT 'pendente';

-- Adicionar comentários
COMMENT ON TYPE public.status_rt IS 'Status da RT: pendente, coletada, despachada, embarque_cancelado, coleta_cancelada';
