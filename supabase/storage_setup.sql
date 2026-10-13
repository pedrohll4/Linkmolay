-- ==============================================================================
-- LINKMOLAY - SCRIPT DEDICADO DE CONFIGURAÇÃO DO SUPABASE STORAGE
-- Cole este script no SQL Editor do seu projeto Supabase e clique em RUN.
-- ==============================================================================

-- 1. Criação dos Buckets de Armazenamento
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('avatars', 'avatars', true, 5242880, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('company-assets', 'company-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('chapter-assets', 'chapter-assets', true, 10485760, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
  ('resumes', 'resumes', true, 10485760, ARRAY['application/pdf'])
ON CONFLICT (id) DO UPDATE SET 
  public = true,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- 2. Garantir coluna de banner no perfil de usuários
ALTER TABLE IF EXISTS public.profiles ADD COLUMN IF NOT EXISTS banner_url TEXT;

-- 3. Políticas de Segurança RLS para os Arquivos (storage.objects)

-- Leitura pública para que qualquer usuário/visitante visualize fotos de perfis, capas e posts
DROP POLICY IF EXISTS "LinkMolay Storage - Leitura Pública" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Leitura Pública"
ON storage.objects FOR SELECT
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

-- Upload permitido para autenticados e clientes anon
DROP POLICY IF EXISTS "LinkMolay Storage - Upload" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Upload"
ON storage.objects FOR INSERT
TO authenticated, anon
WITH CHECK (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

-- Atualização e substituição de imagens
DROP POLICY IF EXISTS "LinkMolay Storage - Atualização" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Atualização"
ON storage.objects FOR UPDATE
TO authenticated, anon
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

-- Exclusão de arquivos
DROP POLICY IF EXISTS "LinkMolay Storage - Exclusão" ON storage.objects;
CREATE POLICY "LinkMolay Storage - Exclusão"
ON storage.objects FOR DELETE
TO authenticated, anon
USING (bucket_id IN ('avatars', 'company-assets', 'chapter-assets', 'resumes'));

-- Confirmação
SELECT 'Buckets e Políticas do Supabase Storage configurados com sucesso para o LinkMolay!' AS status;
