import { useState, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import {
  Building2,
  Search,
  ChevronRight,
  AlertCircle,
  Navigation,
  Layers,
} from 'lucide-react';

interface BuildingBlock {
  _id: string;
  name: string;
  code: string;
  type: string;
  description: string;
  imageUrl: string[];
  totalFloors: number;
  departments: string[];
  coordinates: { lat: number; lng: number };
  isAccessible: boolean;
  hasLift: boolean;
  openTime: string;
  closeTime: string;
  contactEmail: string;
  contactNumber: string;
}

/**
 * Blocks Component
 * Fixed: Added strict Type guards for API responses to prevent "blocks.filter is not a function" errors.
 * Fixed: Removed environment-specific metadata checks to ensure cross-platform stability.
 */
const Blocks = () => {
  const [blocks, setBlocks] = useState<BuildingBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const navigate = useNavigate();
  const { t } = useTranslation();

  const DEFAULT_IMAGE =
    'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop';

  const fetchBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get('/api/building/all');

      /**
       * CRASH PREVENTION:
       * Defensive check to ensure we are always working with an array.
       * Handles nested objects like { buildings: [...] } or direct array responses.
       */
      let data = response.data?.buildings || response.data?.blocks || response.data;

      if (!Array.isArray(data)) {
        console.error('API Error: Expected array but received:', typeof data);
        data = [];
      }

      setBlocks(data);
    } catch (err) {
      console.error('Kiosk Blocks Fetch Error:', err);
      setError(t('blocks.unableToSync'));
      setBlocks([]); // Ensure blocks is empty array on error to prevent filter crash
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBlocks();
  }, []);

  // useMemo ensures we only recalculate when dependencies actually change
  const filteredBlocks = useMemo(() => {
    if (!Array.isArray(blocks)) return [];

    return blocks.filter((block) => {
      const name = String(block?.name || '').toLowerCase();
      const code = String(block?.code || '').toLowerCase();
      const query = searchQuery.toLowerCase();
      return name.includes(query) || code.includes(query);
    });
  }, [blocks, searchQuery]);

  /**
   * Helper to resolve the correct image source.
   * Prevents crashes if path is non-string or malformed.
   */
  const resolveImageSrc = (images: string | string[] | undefined) => {
    const path = Array.isArray(images) ? images[0] : images;
    if (typeof path !== 'string' || !path) return DEFAULT_IMAGE;
    if (path.startsWith('http') || path.startsWith('data:')) return path;
    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    return normalizedPath;
  };

  if (loading)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-100 border-t-[#002b5c] rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Building2 size={20} className="text-[#002b5c]" />
          </div>
        </div>
        <p className="mt-6 text-[10px] font-black text-slate-400 uppercase tracking-[0.4em] animate-pulse">
          {t('blocks.mappingInfrastructure')}
        </p>
      </div>
    );

  return (
    <div className="flex flex-col h-full bg-[#f8fafc] rounded-3xl shadow-2xl overflow-hidden border border-slate-200/60 font-sans relative">
      {/* 1. Header */}
      <div className="p-8 pb-7 bg-white border-b border-slate-100 shrink-0 z-10 shadow-sm">
        <div className="flex justify-between items-center">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Navigation className="text-[#002b5c]/40" size={14} />
              <span className="text-[#002b5c] font-black text-[9px] tracking-[0.3em] uppercase opacity-40">
                {t('blocks.spatialRegistry')}
              </span>
            </div>
            <h2 className="text-3xl font-black text-[#002b5c] tracking-tight leading-none">
              {t('blocks.buildingDirectory')}
            </h2>
          </div>

          {/* Search Bar */}
          <div className="flex items-center gap-3 bg-slate-50 p-1 rounded-2xl border border-slate-200 w-96 transition-all focus-within:border-[#002b5c] focus-within:bg-white focus-within:ring-4 focus-within:ring-[#002b5c]/5 shadow-inner">
            <Search className="ml-4 text-slate-300" size={20} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t('blocks.searchPlaceholder')}
              className="bg-transparent py-2.5 pr-4 text-sm font-bold text-[#002b5c] w-full placeholder:text-slate-300 outline-none"
            />
          </div>
        </div>
      </div>

      {/* 2. Main Grid View */}
      <div className="flex-1 overflow-y-auto p-8 custom-scrollbar bg-slate-50/10">
        {error ? (
          <div className="h-full flex flex-col items-center justify-center text-center">
            <AlertCircle size={40} className="text-red-200 mb-4" />
            <h3 className="text-xl font-black text-slate-800 mb-4">{error}</h3>
            <button
              onClick={fetchBlocks}
              className="px-8 py-3 bg-[#002b5c] text-white rounded-xl font-black text-sm uppercase tracking-widest active:scale-95 transition-all shadow-lg"
            >
              {t('common.retryConnection')}
            </button>
          </div>
        ) : filteredBlocks.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
            {filteredBlocks.map((block) => (
              <div
                key={block._id}
                onClick={() => navigate(`/block/${block._id}`)}
                className="group bg-white rounded-3xl flex flex-col shadow-sm border border-slate-100 hover:border-[#002b5c]/30 hover:shadow-xl transition-all duration-500 cursor-pointer active:scale-[0.98] overflow-hidden"
              >
                <div className="h-44 relative overflow-hidden bg-slate-200">
                  <img
                    src={resolveImageSrc(block.imageUrl)}
                    alt={block.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-80" />

                  <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/20 px-3 py-1 rounded-lg text-white text-[8px] font-black uppercase tracking-widest">
                    {block.type || t('common.facility')}
                  </div>

                  <div className="absolute bottom-4 left-6 text-white">
                    <p className="text-2xl font-black tracking-tight leading-none uppercase italic">
                      {block.code || 'N/A'}
                    </p>
                    <p className="text-[8px] font-bold uppercase tracking-[0.2em] opacity-60">
                      {t('common.blockCode')}
                    </p>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-black text-[#002b5c] tracking-tight mb-2 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {block.name}
                  </h3>
                  <p className="text-slate-400 text-xs font-medium line-clamp-2 mb-6 leading-relaxed">
                    {block.description ||
                      t('blocks.defaultDescription')}
                  </p>

                  <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-4">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400">
                        <Layers size={14} />
                      </div>
                      <div>
                        <p className="text-[8px] font-black text-slate-300 uppercase tracking-widest leading-none mb-0.5">
                          {t('blocks.scale')}
                        </p>
                        <p className="text-xs font-bold text-[#002b5c]">
                          {block.totalFloors || 0} {t('common.levels')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 text-[#002b5c] font-black text-[9px] uppercase tracking-widest group-hover:gap-2.5 transition-all opacity-40 group-hover:opacity-100">
                      {t('common.details')} <ChevronRight size={12} strokeWidth={4} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center opacity-30 text-slate-400 grayscale py-20">
            <div className="p-8 bg-white rounded-full shadow-inner mb-6">
              <Building2 size={60} strokeWidth={1} />
            </div>
            <h3 className="text-xl font-black uppercase tracking-widest text-[#002b5c]">
              {t('blocks.noMatches')}
            </h3>
            <p className="text-sm font-bold mt-2">{t('blocks.adjustSearch')}</p>
          </div>
        )}
      </div>

      {/* 3. Footer */}
      <div className="p-5 bg-white border-t border-slate-100 flex justify-center items-center gap-8 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-1 h-1 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(34,197,94,0.4)]" />
          <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
            {t('blocks.operationalStatus')}
          </span>
        </div>
        <div className="w-px h-3 bg-slate-200" />
        <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em]">
          {t('blocks.kioskNode')}
        </span>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Blocks;
