import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { Chapter } from '../types';
import { Landmark, MapPin, Users, Search, ArrowRight } from 'lucide-react';

export const ChaptersPage: React.FC = () => {
  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedState, setSelectedState] = useState('all');

  useEffect(() => {
    setChapters(api.getChapters());
  }, []);

  const filteredChapters = chapters.filter((c) => {
    if (searchTerm.trim()) {
      const q = searchTerm.toLowerCase();
      const matchName = c.name.toLowerCase().includes(q);
      const matchCity = c.city.toLowerCase().includes(q);
      const matchNum = c.number.toString().includes(q);
      if (!matchName && !matchCity && !matchNum) return false;
    }
    if (selectedState !== 'all' && c.state !== selectedState) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2.5">
          <Landmark className="w-6 h-6 text-gold-500" /> Capítulos da Ordem DeMolay
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Comunidades capitulares, projetos sociais, liderança jovem e eventos.
        </p>
      </div>

      {/* Filter and Search */}
      <div className="p-4 rounded-2xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 shadow-xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Buscar por nome do capítulo, cidade ou número..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-900 dark:text-white focus:outline-none"
          />
        </div>

        <select
          value={selectedState}
          onChange={(e) => setSelectedState(e.target.value)}
          className="text-xs px-3 py-2 rounded-xl border border-slate-200 dark:border-navy-800 bg-slate-50 dark:bg-navy-950 text-slate-700 dark:text-slate-300 focus:outline-none"
        >
          <option value="all">Todos os Estados</option>
          <option value="RO">Rondônia (RO)</option>
          <option value="SP">São Paulo (SP)</option>
          <option value="DF">Distrito Federal (DF)</option>
        </select>
      </div>

      {/* Chapters Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredChapters.map((ch) => (
          <article
            key={ch.id}
            className="rounded-3xl border border-slate-200/80 dark:border-navy-850 bg-white dark:bg-navy-900/60 overflow-hidden shadow-xs hover:border-gold-500/30 transition-all flex flex-col justify-between group"
          >
            <div>
              {/* Banner / Header */}
              <div className="h-28 bg-gradient-to-r from-navy-900 to-navy-800 relative overflow-hidden">
                {ch.bannerUrl && (
                  <img src={ch.bannerUrl} alt="" className="w-full h-full object-cover opacity-40" />
                )}
                <div className="absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-navy-950/80 text-gold-400 border border-gold-500/20 backdrop-blur-xs">
                  Nº {ch.number}
                </div>
              </div>

              {/* Logo & Info */}
              <div className="p-5 pt-0 relative">
                <div className="w-14 h-14 rounded-2xl overflow-hidden bg-navy-800 border-2 border-white dark:border-navy-900 shadow-md -mt-7 mb-3">
                  {ch.logoUrl ? (
                    <img src={ch.logoUrl} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center font-bold text-gold-400">
                      C{ch.number}
                    </div>
                  )}
                </div>

                <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-gold-500 transition-colors">
                  {ch.name}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5" /> {ch.city} - {ch.state}
                </p>

                <p className="text-xs text-slate-600 dark:text-slate-300 mt-3 line-clamp-2 leading-relaxed">
                  {ch.history || 'Capítulo da Ordem DeMolay comprometido com a liderança juvenil.'}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-slate-400 mt-4">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>{ch.activeMembersCount || 0} DeMolays ativos</span>
                </div>
              </div>
            </div>

            <div className="p-5 pt-0">
              <Link
                to={`/capitulos/${ch.id}`}
                className="w-full py-2.5 rounded-xl text-xs font-bold text-center bg-slate-100 dark:bg-navy-800 hover:bg-gold-400 hover:text-slate-950 text-slate-800 dark:text-slate-200 transition-all flex items-center justify-center gap-1.5"
              >
                Conhecer o Capítulo <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
};
