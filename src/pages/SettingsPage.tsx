import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { api } from '../services/api';
import {
  Settings,
  User,
  Shield,
  Eye,
  Bell,
  Sun,
  Moon,
  Monitor,
  RotateCcw,
  Check,
  Lock,
} from 'lucide-react';

export const SettingsPage: React.FC = () => {
  const { currentUser, refreshUser } = useAuth();
  const { theme, setTheme } = useTheme();

  const [activeTab, setActiveTab] = useState<'aparencia' | 'privacidade' | 'conta' | 'dados'>('aparencia');

  // Privacy states
  const [showPhone, setShowPhone] = useState(currentUser?.showPhone ?? true);
  const [showResume, setShowResume] = useState(currentUser?.showResume ?? true);
  const [privacySaved, setPrivacySaved] = useState(false);

  const handleSavePrivacy = () => {
    if (!currentUser) return;
    api.updateProfile(currentUser.id, {
      showPhone,
      showResume,
    });
    refreshUser();
    setPrivacySaved(true);
    setTimeout(() => setPrivacySaved(false), 2500);
  };

  const handleResetSeed = () => {
    if (confirm('Deseja redefinir todo o banco local para os dados padrão de demonstração?')) {
      api.resetToDefaultSeed();
      refreshUser();
      window.location.reload();
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Settings className="w-6 h-6 text-gold-500" /> Configurações
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Ajustes de tema, preferências de privacidade e gerenciamento de conta.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200/80 dark:border-navy-850 gap-6 text-xs font-semibold">
        <button
          onClick={() => setActiveTab('aparencia')}
          className={`pb-3 transition-all ${
            activeTab === 'aparencia'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Aparência & Tema
        </button>

        <button
          onClick={() => setActiveTab('privacidade')}
          className={`pb-3 transition-all ${
            activeTab === 'privacidade'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Privacidade & Visibilidade
        </button>

        <button
          onClick={() => setActiveTab('conta')}
          className={`pb-3 transition-all ${
            activeTab === 'conta'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Conta & Segurança
        </button>

        <button
          onClick={() => setActiveTab('dados')}
          className={`pb-3 transition-all ${
            activeTab === 'dados'
              ? 'text-gold-500 font-bold border-b-2 border-gold-500'
              : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Dados do MVP
        </button>
      </div>

      {/* Tab: Aparência */}
      {activeTab === 'aparencia' && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-5">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Modo de Visualização
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Escolha a experiência visual de sua preferência. O Dark Mode é otimizado para contraste premium.
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <button
              onClick={() => setTheme('dark')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2.5 ${
                theme === 'dark'
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Moon className="w-5 h-5" />
              <span className="text-xs">Dark Mode</span>
            </button>

            <button
              onClick={() => setTheme('light')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2.5 ${
                theme === 'light'
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Sun className="w-5 h-5" />
              <span className="text-xs">Light Mode</span>
            </button>

            <button
              onClick={() => setTheme('system')}
              className={`p-4 rounded-2xl border text-center transition-all flex flex-col items-center gap-2.5 ${
                theme === 'system'
                  ? 'border-gold-500 bg-gold-500/10 text-gold-400 font-bold shadow-xs'
                  : 'border-slate-200 dark:border-navy-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
              }`}
            >
              <Monitor className="w-5 h-5" />
              <span className="text-xs">Sistema</span>
            </button>
          </div>
        </div>
      )}

      {/* Tab: Privacidade */}
      {activeTab === 'privacidade' && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-5">
          {privacySaved && (
            <div className="p-3 rounded-xl bg-emerald-500/10 text-emerald-500 text-xs flex items-center gap-2">
              <Check className="w-4 h-4" /> Preferências salvas!
            </div>
          )}

          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Controles de Privacidade da Plataforma
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              O LinkMolay protege suas informações privadas. Escolha quais dados ficam visíveis para outros membros:
            </p>
          </div>

          <div className="space-y-4 pt-2">
            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-100 dark:border-navy-800 cursor-pointer">
              <div className="pr-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Exibir número do WhatsApp no perfil
                </span>
                <span className="text-[11px] text-slate-400">
                  Permite que membros conectados iniciem conversas diretas pelo WhatsApp.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showPhone}
                onChange={(e) => setShowPhone(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded mt-0.5"
              />
            </label>

            <label className="flex items-start justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-navy-850/60 border border-slate-100 dark:border-navy-800 cursor-pointer">
              <div className="pr-4">
                <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                  Disponibilizar download do Currículo em PDF
                </span>
                <span className="text-[11px] text-slate-400">
                  Permite que recrutadores e empresas parceiras baixem seu arquivo de currículo.
                </span>
              </div>
              <input
                type="checkbox"
                checked={showResume}
                onChange={(e) => setShowResume(e.target.checked)}
                className="w-4 h-4 accent-gold-500 rounded mt-0.5"
              />
            </label>
          </div>

          <button
            onClick={handleSavePrivacy}
            className="px-5 py-2.5 rounded-xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            Salvar Preferências
          </button>
        </div>
      )}

      {/* Tab: Conta */}
      {activeTab === 'conta' && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-4 text-xs">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Dados da Conta
            </h3>
            <p className="text-slate-400">Informações vinculadas ao seu login.</p>
          </div>

          <div className="space-y-3 pt-2">
            <div>
              <span className="text-slate-400 block mb-0.5">E-mail cadastrado:</span>
              <strong className="text-slate-800 dark:text-slate-200">{currentUser?.email}</strong>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Perfil institucional:</span>
              <strong className="text-slate-800 dark:text-slate-200 uppercase">
                {currentUser?.role === 'demolay' ? 'DeMolay' : currentUser?.role === 'mason' ? 'Maçom' : 'Administrador'}
              </strong>
            </div>

            <div>
              <span className="text-slate-400 block mb-0.5">Status de verificação:</span>
              <span className="text-emerald-400 font-semibold">✓ Verificado e ativo</span>
            </div>
          </div>
        </div>
      )}

      {/* Tab: Dados do MVP */}
      {activeTab === 'dados' && (
        <div className="p-6 rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-900 dark:text-white mb-1">
              Ambiente de Demonstração & Testes
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Caso você tenha alterado dados de teste e queira retornar o ecossistema para o estado inicial predefinido:
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-500 space-y-3">
            <p className="leading-relaxed">
              Esta ação redefinirá os usuários de demonstração (Pedro Henrique, Carlos Silva, Felipe Barreto, Admin), vagas, capítulos e empresas de volta para o seed original.
            </p>
            <button
              onClick={handleResetSeed}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold transition-all flex items-center gap-1.5 shadow-xs"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Restaurar Dados de Demonstração
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
