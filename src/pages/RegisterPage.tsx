import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserRole } from '../types';
import confetti from 'canvas-confetti';
import {
  ShieldAlert,
  ArrowRight,
  Award,
  Building2,
  MapPin,
  Mail,
  User,
  Phone,
  Landmark,
  Briefcase,
  FileText,
} from 'lucide-react';

export const RegisterPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const initialType = (searchParams.get('tipo') as UserRole) || 'demolay';
  const { register } = useAuth();
  const navigate = useNavigate();

  const [role, setRole] = useState<UserRole>(initialType === 'mason' ? 'mason' : 'demolay');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('Ariquemes');
  const [state, setState] = useState('RO');

  // DeMolay fields
  const [chapterName, setChapterName] = useState('Capítulo Luciano de Assis nº 118');
  const [orderRank, setOrderRank] = useState('DeMolay Ativo');
  const [cid, setCid] = useState('');

  // Mason fields
  const [lodgeName, setLodgeName] = useState('A.R.L.S. Acácia de Ariquemes nº 15');
  const [lodgeObedience, setLodgeObedience] = useState('GLOMARON');
  const [cim, setCim] = useState('');
  const [profession, setProfession] = useState('Empresário');

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await register({
        fullName,
        email,
        role,
        city,
        state,
        phone,
        chapterName: role === 'demolay' ? chapterName : undefined,
        orderRank: role === 'demolay' ? orderRank : undefined,
        cid: role === 'demolay' ? cid : undefined,
        lodgeName: role === 'mason' ? lodgeName : undefined,
        lodgeObedience: role === 'mason' ? lodgeObedience : undefined,
        cim: role === 'mason' ? cim : undefined,
        profession: role === 'mason' ? profession : undefined,
      });

      setLoading(false);

      if (!res.success) {
        setError(res.error || 'Erro ao realizar cadastro.');
      } else {
        // Confetti celebration
        try {
          confetti({
            particleCount: 80,
            spread: 60,
            origin: { y: 0.6 },
          });
        } catch {}

        navigate('/dashboard');
      }
    } catch (err: any) {
      setLoading(false);
      setError(err.message || 'Erro inesperado.');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-navy-950 flex flex-col justify-center items-center p-4 py-12">
      <div className="max-w-lg w-full">
        {/* Brand Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center gap-2.5 mb-3 group">
            <div className="w-10 h-10 rounded-2xl bg-navy-900 dark:bg-navy-850 border border-gold-500/30 flex items-center justify-center shadow-md">
              <span className="font-bold text-lg text-gold-400">LM</span>
            </div>
            <span className="text-2xl font-extrabold text-navy-900 dark:text-white">
              LINK<span className="text-gold-500 dark:text-gold-400">MOLAY</span>
            </span>
          </Link>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">
            Solicitação de Acesso
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Seu cadastro passará por aprovação manual da administração antes da liberação de acesso.
          </p>
        </div>

        {/* Form Card */}
        <div className="rounded-3xl border border-slate-200 dark:border-navy-800 bg-white dark:bg-navy-900 p-8 shadow-xl">
          {/* Role Selector Tabs */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-slate-100 dark:bg-navy-950 rounded-2xl border border-slate-200/60 dark:border-navy-800">
            <button
              type="button"
              onClick={() => setRole('demolay')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                role === 'demolay'
                  ? 'bg-white dark:bg-navy-850 text-blue-500 dark:text-blue-400 shadow-sm border border-slate-200 dark:border-navy-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Sou DeMolay</span>
            </button>

            <button
              type="button"
              onClick={() => setRole('mason')}
              className={`flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold transition-all ${
                role === 'mason'
                  ? 'bg-white dark:bg-navy-850 text-gold-500 dark:text-gold-400 shadow-sm border border-slate-200 dark:border-navy-700'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Building2 className="w-4 h-4" />
              <span>Sou Maçom</span>
            </button>
          </div>

          {error && (
            <div className="mb-5 p-3 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-500 text-xs flex items-start gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Common Fields */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                Nome Completo *
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="Nome e Sobrenome"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  E-mail *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="email@exemplo.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  WhatsApp / Telefone
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    placeholder="(00) 00000-0000"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              <div className="col-span-2">
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  Cidade *
                </label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Ex: Ariquemes"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                  UF *
                </label>
                <input
                  type="text"
                  required
                  maxLength={2}
                  placeholder="RO"
                  value={state}
                  onChange={(e) => setState(e.target.value.toUpperCase())}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white text-center font-bold focus:outline-none focus:ring-1 focus:ring-gold-500 uppercase"
                />
              </div>
            </div>

            {/* Role-Specific Fields */}
            {role === 'demolay' ? (
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 space-y-3">
                <div className="text-[11px] font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Award className="w-3.5 h-3.5" /> Informações da Ordem DeMolay
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Capítulo DeMolay *
                  </label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Capítulo Luciano de Assis nº 118"
                      value={chapterName}
                      onChange={(e) => setChapterName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Grau / Status
                    </label>
                    <select
                      value={orderRank}
                      onChange={(e) => setOrderRank(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-gold-500"
                    >
                      <option value="DeMolay Ativo">DeMolay Ativo</option>
                      <option value="Sênior DeMolay">Sênior DeMolay</option>
                      <option value="Past Mestre Conselheiro">Past Mestre Conselheiro</option>
                      <option value="Chevalier">Chevalier</option>
                      <option value="Iniciático">Iniciático</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      CID (ID DeMolay)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 98451"
                      value={cid}
                      onChange={(e) => setCid(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </div>
            ) : (
              <div className="pt-3 border-t border-slate-100 dark:border-navy-800 space-y-3">
                <div className="text-[11px] font-bold text-gold-500 uppercase tracking-wider flex items-center gap-1.5">
                  <Building2 className="w-3.5 h-3.5" /> Informações Maçônicas & Profissionais
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Loja Maçônica *
                  </label>
                  <div className="relative">
                    <Landmark className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: A.R.L.S. Acácia de Ariquemes nº 15"
                      value={lodgeName}
                      onChange={(e) => setLodgeName(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      Potência / Obediência
                    </label>
                    <input
                      type="text"
                      placeholder="GLOMARON, GOB, COMAB..."
                      value={lodgeObedience}
                      onChange={(e) => setLodgeObedience(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                      CIM (Identificação)
                    </label>
                    <input
                      type="text"
                      placeholder="Ex: 12498"
                      value={cim}
                      onChange={(e) => setCim(e.target.value)}
                      className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
                    Profissão / Ramo de Atuação *
                  </label>
                  <div className="relative">
                    <Briefcase className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Ex: Empresário de TI, Advogado, Médico..."
                      value={profession}
                      onChange={(e) => setProfession(e.target.value)}
                      className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-1 focus:ring-gold-500"
                    />
                  </div>
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-4 py-3 rounded-xl font-bold text-xs bg-gold-400 hover:bg-gold-300 text-slate-950 flex items-center justify-center gap-2 transition-all shadow-md active:scale-98 disabled:opacity-50"
            >
              {loading ? 'Processando solicitação...' : 'Enviar Solicitação de Cadastro'}
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>
        </div>

        {/* Footer Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Já possui cadastro?{' '}
            <Link to="/login" className="font-semibold text-gold-500 hover:underline">
              Fazer login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};
