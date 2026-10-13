import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';
import { Company } from '../types';
import { Building2, MapPin, Globe, Plus, Search, ArrowRight } from 'lucide-react';

export const CompaniesPage: React.FC = () => {
  const { currentUser, isMason, isAdmin } = useAuth();
  const [companies, setCompanies] = useState<Company[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);

  // New company form
  const [name, setName] = useState('');
  const [segment, setSegment] = useState('Tecnologia da Informação');
  const [city, setCity] = useState('Ariquemes');
  const [state, setState] = useState('RO');
  const [website, setWebsite] = useState('');
  const [instagram, setInstagram] = useState('');
  const [whatsapp, setWhatsapp] = useState('');
  const [description, setDescription] = useState('');
  const [logoUrl, setLogoUrl] = useState('');

  const loadCompanies = () => {
    setCompanies(api.getCompanies());
  };

  useEffect(() => {
    loadCompanies();
  }, []);

  const filtered = companies.filter((c) => {
    if (!searchTerm.trim()) return true;
    const q = searchTerm.toLowerCase();
    return (
      c.name.toLowerCase().includes(q) ||
      c.segment.toLowerCase().includes(q) ||
      c.city.toLowerCase().includes(q)
    );
  });

  const handleCreateCompany = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !name.trim()) return;

    api.createCompany({
      ownerId: currentUser.id,
      ownerName: currentUser.fullName,
      name: name.trim(),
      segment: segment.trim(),
      city: city.trim(),
      state: state.trim().toUpperCase(),
      website: website.trim() || undefined,
      instagram: instagram.trim() || undefined,
      whatsapp: whatsapp.trim() || undefined,
      description: description.trim(),
      logoUrl:
        logoUrl.trim() ||
        'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
    });

    setShowCreateModal(false);
    setName('');
    setDescription('');
    loadCompanies();
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
            <Building2 className="w-6 h-6 text-gold-500" /> Empresas da Rede Maçônica
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Empresas pertencentes a Maçons verificados gerando impacto e vagas para jovens líderes.
          </p>
        </div>

        {(isMason || isAdmin) && (
          <button
            onClick={() => setShowCreateModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-gold-400 hover:bg-gold-300 text-slate-950 text-xs font-bold transition-all shadow-xs"
          >
            <Plus className="w-4 h-4" /> Cadastrar Minha Empresa
          </button>
        )}
      </div>

      {/* Search Bar */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar empresa por nome, segmento ou cidade..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>
      </div>

      {/* Companies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((comp) => (
          <article
            key={comp.id}
            className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs hover:border-gold-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              <div className="h-28 bg-gradient-to-r from-navy-900 to-navy-850 relative overflow-hidden">
                {comp.bannerUrl && (
                  <img src={comp.bannerUrl} alt="" className="w-full h-full object-cover opacity-40" />
                )}
              </div>

              <div className="p-5 pt-0 relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-800 border-2 border-white dark:border-navy-900 shadow-md -mt-7 mb-3">
                  {comp.logoUrl ? (
                    <img src={comp.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gold-400">
                      {comp.name.slice(0, 2).toUpperCase()}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors">
                  {comp.name}
                </h3>
                <span className="text-[11px] font-semibold text-gold-500 block mt-0.5">
                  {comp.segment}
                </span>

                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {comp.city} - {comp.state}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {comp.description}
                </p>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-navy-800 text-[11px] text-slate-400">
                  <span>Maçom proprietário: </span>
                  <strong className="text-slate-700 dark:text-slate-200">
                    {comp.ownerName || 'Maçom Verificado'}
                  </strong>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                to={`/empresas/${comp.id}`}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-navy-800 hover:bg-gold-400 hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                Ver Página da Empresa <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>

      {/* Modal: Create Company */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="max-w-lg w-full rounded-3xl bg-white dark:bg-navy-900 border border-slate-200 dark:border-navy-850 p-6 sm:p-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-navy-800 pb-3 mb-4">
              <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-gold-500" /> Cadastrar Empresa de Maçom
              </h3>
              <button onClick={() => setShowCreateModal(false)} className="text-slate-400 hover:text-slate-600">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateCompany} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Nome da Empresa *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Silva Tecnologia & Inovação"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Ramo de Atuação / Segmento *
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ex: Tecnologia da Informação, Advocacia, Varejo"
                  value={segment}
                  onChange={(e) => setSegment(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    Cidade
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                    UF
                  </label>
                  <input
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value.toUpperCase())}
                    className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Site Oficial
                </label>
                <input
                  type="url"
                  placeholder="https://..."
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                  className="w-full p-2 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 dark:text-slate-300 mb-1">
                  Descrição da Empresa *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Conte um pouco sobre as atividades e propósito da empresa..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full p-2.5 rounded-xl bg-slate-50 dark:bg-navy-950 border border-slate-200 dark:border-navy-800 text-slate-900 dark:text-white resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-navy-800">
                <button
                  type="button"
                  onClick={() => setShowCreateModal(false)}
                  className="px-4 py-2 text-slate-500 font-semibold"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl font-bold bg-gold-400 hover:bg-gold-300 text-slate-950"
                >
                  Cadastrar Empresa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
