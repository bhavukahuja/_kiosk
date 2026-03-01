import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  AlertCircle,
  ChevronLeft,
  Building2,
  BookOpen,
  GraduationCap,
  Layers,
  CheckCircle2,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DepartmentInfo {
  about: string;
  coursesOffered: string[];
}

interface BuildingDetail {
  _id: string;
  name: string;
  code?: string;
  type: string;
  description?: string;
  totalFloors?: number;
  departments?: string[];
  departmentInfo?: DepartmentInfo;
  imageUrl?: string[];
  isAccessible?: boolean;
  hasLift?: boolean;
  contactNumber?: string;
  contactEmail?: string;
}

const DEFAULT_IMAGE =
  'https://images.unsplash.com/photo-1562774053-701939374585?q=80&w=800&auto=format&fit=crop';

const BlockDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [data, setData] = useState<BuildingDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBuilding = async () => {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const res = await axios.get(`/api/building/${id}`);
        setData(res.data.building || res.data);
      } catch (err) {
        console.error('Error fetching building detail:', err);
        setError(t('blockDetail.errorLoading'));
      } finally {
        setLoading(false);
      }
    };
    fetchBuilding();
  }, [id]);

  if (loading)
    return (
      <div className="h-full bg-white rounded-[40px] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-10 h-10 border-2 border-slate-100 border-t-[#002b5c] rounded-full animate-spin" />
          <span className="text-slate-300 font-bold tracking-[0.3em] text-[10px] uppercase">
            {t('blockDetail.loadingBlock')}
          </span>
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-[40px] p-20 text-center border border-slate-100">
        <AlertCircle size={40} className="text-red-300 mb-6" />
        <h3 className="text-xl font-bold text-[#002b5c] mb-8">
          {error || t('blockDetail.blockNotFound')}
        </h3>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-3 bg-[#002b5c] text-white rounded-xl font-bold active:scale-95 transition-all text-sm"
        >
          {t('common.returnToDirectory')}
        </button>
      </div>
    );

  const heroImage =
    Array.isArray(data.imageUrl) && data.imageUrl.length > 0 ? data.imageUrl[0] : DEFAULT_IMAGE;

  const courses = data.departmentInfo?.coursesOffered ?? [];
  const about = data.departmentInfo?.about ?? '';

  return (
    <div className="h-full bg-[#fcfdfe] rounded-[40px] overflow-hidden flex flex-col font-sans relative">
      {/* Header */}
      <header className="shrink-0 px-12 py-10 flex justify-between items-center z-20">
        <button
          onClick={() => navigate(-1)}
          className="group flex items-center gap-3 px-5 py-3 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-slate-300 active:scale-95 transition-all"
        >
          <ChevronLeft size={18} className="text-[#002b5c]" />
          <span className="text-[11px] font-black text-[#002b5c] uppercase tracking-widest">
            {t('common.backToDirectory')}
          </span>
        </button>

        <div className="flex items-center gap-6">
          {data.code && (
            <>
              <div className="flex flex-col items-end">
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.4em] mb-1">
                  {t('common.blockCode')}
                </span>
                <span className="text-sm font-bold text-[#002b5c]">{data.code}</span>
              </div>
              <div className="w-[1px] h-8 bg-slate-200" />
            </>
          )}
          <Building2 className="text-blue-500" size={24} />
        </div>
      </header>

      {/* Scrollable Body */}
      <div className="flex-1 overflow-y-auto custom-scrollbar px-12 lg:px-24 pb-20">
        {/* Hero Section */}
        <section className="flex flex-col lg:flex-row items-center lg:items-end gap-12 mb-20 border-b border-slate-100 pb-16">
          <div className="relative shrink-0">
            <div className="w-64 h-52 bg-white p-3 rounded-[32px] shadow-[0_20px_50px_-10px_rgba(0,0,0,0.1)] border border-slate-100 relative z-10 overflow-hidden">
              <img
                src={heroImage}
                alt={data.name}
                className="w-full h-full object-cover rounded-2xl"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = DEFAULT_IMAGE;
                }}
              />
            </div>
            <div className="absolute -top-4 -left-4 w-20 h-20 bg-slate-50 rounded-2xl -z-0 border border-slate-100" />
          </div>

          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-slate-100 rounded-full mb-4">
              <Layers size={14} className="text-slate-400" />
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {data.type.charAt(0).toUpperCase() + data.type.slice(1)}
                {data.totalFloors ? ` · ${data.totalFloors} ${t('common.floors')}` : ''}
              </span>
            </div>
            <h1 className="text-5xl font-black text-[#002b5c] tracking-tighter leading-none mb-4">
              {data.name}
            </h1>
            {data.description && (
              <p className="text-lg font-medium text-slate-400 italic leading-relaxed max-w-2xl">
                {data.description}
              </p>
            )}
          </div>
        </section>

        {/* About & Courses Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-24 items-start">
          {/* About Department */}
          <div className="space-y-16">
            {about ? (
              <section>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-slate-200" />
                  {t('blockDetail.aboutDepartment')}
                </h4>
                <div className="flex gap-6 items-start">
                  <div className="w-12 h-12 rounded-2xl bg-[#002b5c]/5 flex items-center justify-center text-[#002b5c] shrink-0 mt-1">
                    <BookOpen size={24} />
                  </div>
                  <p className="text-base text-slate-600 leading-relaxed font-medium">{about}</p>
                </div>
              </section>
            ) : (
              <section>
                <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-6 flex items-center gap-4">
                  <span className="w-8 h-[1px] bg-slate-200" />
                  {t('blockDetail.aboutDepartment')}
                </h4>
                <p className="text-sm text-slate-300 italic">{t('common.noDescription')}</p>
              </section>
            )}
          </div>

          {/* Courses Offered */}
          <div className="lg:pl-12 lg:border-l border-slate-100 space-y-16">
            <section>
              <h4 className="text-[10px] font-black text-slate-300 uppercase tracking-[0.5em] mb-8 flex items-center gap-4">
                <span className="w-8 h-[1px] bg-slate-200" />
                {t('common.coursesOffered')}
              </h4>

              {courses.length > 0 ? (
                <div className="space-y-3">
                  {courses.map((course, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-5 p-5 bg-white border border-slate-100 rounded-2xl shadow-sm hover:shadow-md hover:border-[#002b5c]/20 transition-all"
                    >
                      <div className="w-10 h-10 bg-slate-50 rounded-xl flex items-center justify-center text-[#002b5c] shrink-0">
                        <GraduationCap size={20} />
                      </div>
                      <p className="text-sm font-bold text-[#002b5c] leading-snug">{course}</p>
                      <CheckCircle2 size={16} className="text-emerald-400 ml-auto shrink-0" />
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-slate-300 italic">{t('common.noCourses')}</p>
              )}
            </section>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #f1f5f9; 
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #e2e8f0;
        }
      `}</style>
    </div>
  );
};

export default BlockDetail;
