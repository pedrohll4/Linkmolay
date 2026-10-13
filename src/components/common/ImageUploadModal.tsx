import React, { useState, useRef } from 'react';
import { Card } from '../ui/card';
import { Button } from '../ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '../ui/tabs';
import {
  Upload,
  Image as ImageIcon,
  Link as LinkIcon,
  X,
  Check,
  Sparkles,
  Camera,
  Loader2,
} from 'lucide-react';
import {
  PRESET_BANNERS,
  PRESET_AVATARS,
  uploadImageFile,
} from '../../services/imageUpload';
import { isSupabaseConfigured } from '../../services/supabase';

interface ImageUploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (imageUrl: string) => void;
  title: string;
  type: 'avatar' | 'banner';
  currentImage?: string;
}

export const ImageUploadModal: React.FC<ImageUploadModalProps> = ({
  isOpen,
  onClose,
  onSave,
  title,
  type,
  currentImage,
}) => {
  const [selectedImage, setSelectedImage] = useState<string>(currentImage || '');
  const [urlInput, setUrlInput] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [uploadFeedback, setUploadFeedback] = useState<{
    type: 'cloud' | 'local' | 'error';
    message: string;
  } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const presets = type === 'banner' ? PRESET_BANNERS : PRESET_AVATARS;

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setIsProcessing(true);
      setUploadFeedback(null);
      const res = await uploadImageFile(file, 'avatars', type);
      setSelectedImage(res.url);

      if (res.isCloud) {
        setUploadFeedback({
          type: 'cloud',
          message: 'Foto salva com sucesso na nuvem Supabase Storage (sincronizada para todos os dispositivos)!',
        });
      } else if (res.errorMessage) {
        setUploadFeedback({
          type: 'error',
          message: `Salvo no dispositivo local. O Supabase retornou: "${res.errorMessage}". Execute o script SQL no Supabase para salvar na nuvem.`,
        });
      } else {
        setUploadFeedback({
          type: 'local',
          message: 'Salvo neste navegador. (Para sincronizar entre outros dispositivos, configure as chaves do Supabase na Vercel e execute o script SQL).',
        });
      }
    } catch (err) {
      alert('Erro ao processar imagem. Verifique se o formato é válido.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleApplyUrl = () => {
    if (urlInput.trim()) {
      setSelectedImage(urlInput.trim());
    }
  };

  const handleConfirm = () => {
    if (selectedImage) {
      onSave(selectedImage);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-200">
      <Card
        variant="gold"
        className="w-full max-w-xl border-amber-400/40 bg-[#0A1124] text-white p-6 shadow-2xl relative"
      >
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 text-lg font-bold cursor-pointer"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Título do Modal e Status de Conexão */}
        <div className="flex items-center justify-between gap-3 mb-5 pb-3 border-b border-amber-400/20">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-400/15 text-amber-400 shrink-0">
              {type === 'avatar' ? <Camera className="h-5 w-5" /> : <ImageIcon className="h-5 w-5" />}
            </div>
            <div>
              <h3 className="font-serif text-xl font-bold text-white">{title}</h3>
              <p className="text-xs text-slate-400">
                {type === 'avatar'
                  ? 'Escolha sua foto oficial para identificação de perfil na Fraternidade'
                  : 'Defina a capa heráldica de fundo do seu perfil executivo'}
              </p>
            </div>
          </div>

          <div className="shrink-0 hidden sm:block">
            {isSupabaseConfigured ? (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Nuvem Ativa
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                Modo Local
              </span>
            )}
          </div>
        </div>

        {/* Feedback Dinâmico de Upload */}
        {uploadFeedback && (
          <div
            className={`p-3 rounded-xl text-xs font-medium mb-4 flex items-start gap-2.5 animate-in fade-in duration-200 ${
              uploadFeedback.type === 'cloud'
                ? 'bg-emerald-500/15 border border-emerald-500/30 text-emerald-300'
                : uploadFeedback.type === 'error'
                ? 'bg-rose-500/15 border border-rose-500/30 text-rose-300'
                : 'bg-amber-500/15 border border-amber-500/30 text-amber-300'
            }`}
          >
            <span className="text-base leading-none">
              {uploadFeedback.type === 'cloud' ? '☁️' : '⚠️'}
            </span>
            <div className="flex-1 leading-relaxed">{uploadFeedback.message}</div>
          </div>
        )}

        {/* Preview Atual */}
        <div className="mb-5 flex flex-col items-center justify-center p-3 rounded-2xl bg-[#070D1E] border border-slate-800">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-2">
            Pré-visualização
          </span>
          {type === 'avatar' ? (
            <div className="relative h-28 w-28 rounded-full overflow-hidden border-4 border-amber-400/40 bg-slate-800 shadow-lg">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
                  Sem Foto
                </div>
              )}
            </div>
          ) : (
            <div className="relative h-28 w-full rounded-xl overflow-hidden border-2 border-amber-400/30 bg-slate-800 shadow-md">
              {selectedImage ? (
                <img
                  src={selectedImage}
                  alt="Preview da Capa"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center text-slate-500 text-xs">
                  Sem Capa Selecionada
                </div>
              )}
            </div>
          )}
        </div>

        {/* Abas de Origem da Imagem */}
        <Tabs defaultValue="upload" className="w-full">
          <TabsList className="grid grid-cols-3 w-full mb-4">
            <TabsTrigger value="upload" className="text-xs gap-1.5">
              <Upload className="h-3.5 w-3.5" /> Arquivo Local
            </TabsTrigger>
            <TabsTrigger value="presets" className="text-xs gap-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Galeria Fraternal
            </TabsTrigger>
            <TabsTrigger value="url" className="text-xs gap-1.5">
              <LinkIcon className="h-3.5 w-3.5" /> Link / URL
            </TabsTrigger>
          </TabsList>

          {/* ABA 1: UPLOAD DE ARQUIVO DO COMPUTADOR OU CELULAR */}
          <TabsContent value="upload" className="space-y-4 mt-0">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/png, image/jpeg, image/webp, image/gif"
              className="hidden"
            />
            <div
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center justify-center p-6 rounded-2xl border-2 border-dashed border-amber-400/30 hover:border-amber-400/70 bg-[#070D1E]/70 hover:bg-[#0E162E] transition-all cursor-pointer text-center group"
            >
              {isProcessing ? (
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-8 w-8 text-amber-400 animate-spin" />
                  <span className="text-xs text-amber-300">Otimizando e comprimindo imagem...</span>
                </div>
              ) : (
                <>
                  <div className="mb-2 flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10 text-amber-400 group-hover:scale-110 transition-transform">
                    <Upload className="h-6 w-6" />
                  </div>
                  <span className="text-sm font-semibold text-white">
                    Clique para selecionar do seu dispositivo
                  </span>
                  <span className="text-xs text-slate-400 mt-1">
                    Suporta JPG, PNG, WEBP ou GIF (compressão automática rápida)
                  </span>
                </>
              )}
            </div>
          </TabsContent>

          {/* ABA 2: GALERIA FRATERNAL DE CAPAS E AVATARES */}
          <TabsContent value="presets" className="space-y-3 mt-0">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-48 overflow-y-auto pr-1">
              {presets.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => setSelectedImage(preset.url)}
                  className={`group relative rounded-xl overflow-hidden border transition-all text-left cursor-pointer ${
                    selectedImage === preset.url
                      ? 'border-amber-400 ring-2 ring-amber-400/50 scale-[1.02]'
                      : 'border-slate-800 hover:border-amber-400/50'
                  }`}
                >
                  <div className="h-16 w-full overflow-hidden bg-slate-900">
                    <img
                      src={preset.url}
                      alt={preset.name}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                    />
                  </div>
                  <div className="p-1.5 bg-[#070D1E] text-[10px] text-slate-300 truncate">
                    {preset.name}
                  </div>
                  {selectedImage === preset.url && (
                    <div className="absolute top-1 right-1 flex h-4 w-4 items-center justify-center rounded-full bg-amber-400 text-slate-950 text-[10px] font-bold">
                      ✓
                    </div>
                  )}
                </button>
              ))}
            </div>
          </TabsContent>

          {/* ABA 3: LINK DA WEB */}
          <TabsContent value="url" className="space-y-3 mt-0">
            <div className="flex gap-2">
              <input
                type="url"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                placeholder="Cole a URL da imagem aqui (ex: https://images.unsplash.com/...)"
                className="flex-1 rounded-xl border border-slate-700 bg-[#070D1E] px-3.5 py-2 text-xs text-white placeholder:text-slate-500 focus:border-amber-400 focus:outline-none"
              />
              <Button
                variant="secondary"
                size="sm"
                onClick={handleApplyUrl}
                className="text-xs"
              >
                Carregar
              </Button>
            </div>
          </TabsContent>
        </Tabs>

        {/* Rodapé com Ações */}
        <div className="mt-6 pt-4 border-t border-slate-800 flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onClose} className="text-xs text-slate-400">
            Cancelar
          </Button>
          <Button
            variant="gold"
            size="sm"
            onClick={handleConfirm}
            disabled={!selectedImage || isProcessing}
            className="gap-2 text-xs"
          >
            <Check className="h-4 w-4" />
            Aplicar Esta Imagem
          </Button>
        </div>
      </Card>
    </div>
  );
};
