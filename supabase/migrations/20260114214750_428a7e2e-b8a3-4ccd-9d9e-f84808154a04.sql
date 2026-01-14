-- Adicionar políticas para UPDATE e INSERT em agentes
CREATE POLICY "Acesso público para atualização de agentes"
ON public.agentes
FOR UPDATE
USING (true);

CREATE POLICY "Acesso público para inserção de agentes"
ON public.agentes
FOR INSERT
WITH CHECK (true);

-- Adicionar política para UPDATE em locais
CREATE POLICY "Acesso público para atualização de locais"
ON public.locais
FOR UPDATE
USING (true);