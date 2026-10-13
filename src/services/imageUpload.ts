import { supabase, isSupabaseConfigured } from './supabase';

export interface PresetImage {
  id: string;
  name: string;
  category: 'banner' | 'avatar';
  url: string;
}

export const PRESET_BANNERS: PresetImage[] = [
  {
    id: 'b-temple',
    name: 'Templo & Altar Noturno',
    category: 'banner',
    url: 'https://images.unsplash.com/photo-1548625361-195fd01a2663?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b-architecture',
    name: 'Colunas & Arquitetura Neoclássica',
    category: 'banner',
    url: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b-library',
    name: 'Biblioteca Clássica de Estudos',
    category: 'banner',
    url: 'https://images.unsplash.com/photo-1507842229452-772428669e4a?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b-geometric-gold',
    name: 'Ouro Polido & Geometria Nobre',
    category: 'banner',
    url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=1600&q=80',
  },
  {
    id: 'b-executive',
    name: 'Horizonte Corporativo & Liderança',
    category: 'banner',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
  },
];

export const PRESET_AVATARS: PresetImage[] = [
  {
    id: 'av-crest-gold',
    name: 'Brasão Dourado Heráldico',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-executive-suit',
    name: 'Executivo Formal',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-young-leader',
    name: 'Jovem Líder',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
  },
  {
    id: 'av-senior-mentor',
    name: 'Mentor Sênior',
    category: 'avatar',
    url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
  },
];

/**
 * Redimensiona e comprime uma imagem localmente no navegador usando Canvas.
 * Evita sobrecarregar o LocalStorage ou gastar dados móveis excessivos.
 */
export async function compressImage(
  file: File,
  maxWidth = 1400,
  maxHeight = 900,
  quality = 0.85
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calcular proporção
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        if (height > maxHeight) {
          width = Math.round((width * maxHeight) / height);
          height = maxHeight;
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;

        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(event.target?.result as string);
          return;
        }

        ctx.drawImage(img, 0, 0, width, height);

        // Exportar para DataURL JPEG ou PNG
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        resolve(compressedDataUrl);
      };

      img.onerror = (err) => reject(err);
      img.src = event.target?.result as string;
    };

    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Faz upload de imagem:
 * - Se o Supabase estiver configurado com credenciais reais, envia para o bucket de Storage.
 * - Caso contrário (Modo Demo / Local), comprime localmente e retorna o DataURL (Base64) persistível.
 */
export async function uploadImageFile(
  file: File,
  bucket: 'avatars' | 'company-assets' | 'chapter-assets' = 'avatars',
  type: 'avatar' | 'banner' = 'avatar'
): Promise<string> {
  const isAvatar = type === 'avatar';
  const maxWidth = isAvatar ? 600 : 1600;
  const maxHeight = isAvatar ? 600 : 900;

  // 1. Comprimir imagem localmente
  const compressedDataUrl = await compressImage(file, maxWidth, maxHeight, 0.88);

  // 2. Se o Supabase estiver ativo, tentar enviar para o bucket oficial
  if (isSupabaseConfigured && supabase) {
    try {
      const fileExt = file.name.split('.').pop() || 'jpg';
      const fileName = `${type}_${Date.now()}_${Math.random().toString(36).substring(2, 8)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Converter DataURL para Blob
      const response = await fetch(compressedDataUrl);
      const blob = await response.blob();

      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(filePath, blob, {
          cacheControl: '3600',
          upsert: true,
        });

      if (!error && data) {
        const {
          data: { publicUrl },
        } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return publicUrl;
      }
    } catch (err) {
      console.warn('Falha no upload do Supabase Storage. Usando fallback local:', err);
    }
  }

  // 3. Fallback: Retorna o dataURL comprimido que é instantaneamente salvo no banco local
  return compressedDataUrl;
}
