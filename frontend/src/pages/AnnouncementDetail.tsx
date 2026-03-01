import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowLeft, Clock, Calendar, Megaphone } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface Announcement {
  _id: string;
  subject: string;
  message: string;
  createdAt: string;
}

const AnnouncementDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [data, setData] = useState<Announcement | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    setError(null);
    axios
      .get(`/api/announcement/${id}`, { params: { lang: i18n.language } })
      .then((res) => setData(res.data.announcement))
      .catch(() => setError(t('announcements.couldNotLoad')))
      .finally(() => setLoading(false));
  }, [id, i18n.language]);

  if (loading)
    return (
      <div className="h-full bg-white rounded-3xl p-10 animate-pulse border border-gray-100">
        <div className="flex items-center gap-6 mb-10">
          <div className="w-14 h-14 bg-gray-100 rounded-2xl shrink-0" />
          <div className="flex-1 space-y-3">
            <div className="h-7 w-2/3 bg-gray-100 rounded-xl" />
            <div className="h-4 w-1/3 bg-gray-50 rounded-lg" />
          </div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className={`h-5 bg-gray-50 rounded-full ${i === 5 ? 'w-3/5' : 'w-full'}`}
            />
          ))}
        </div>
      </div>
    );

  if (error || !data)
    return (
      <div className="h-full flex flex-col items-center justify-center bg-white rounded-3xl gap-5 border border-gray-100">
        <p className="text-2xl font-bold text-gray-400">{error ?? t('announcements.notFound')}</p>
        <button
          onClick={() => navigate(-1)}
          className="px-8 py-4 bg-[#002b5c] text-white rounded-2xl font-bold text-lg active:scale-95 transition-all"
        >
          {t('announcements.goBack')}
        </button>
      </div>
    );

  const dateObj = new Date(data.createdAt);
  const dateStr = dateObj.toLocaleDateString('en-US', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timeStr = dateObj.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
  });

  return (
    <div className="flex flex-col h-full bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm">
      <div className="shrink-0 bg-[#002b5c] px-8 py-6">
        <div className="flex items-center justify-between mb-5">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-3 bg-white/10 hover:bg-white/20 active:scale-95 transition-all px-5 py-3 rounded-2xl"
          >
            <ArrowLeft size={22} className="text-white" />
            <span className="text-white font-bold text-base tracking-wide">{t('common.back')}</span>
          </button>

          <div className="flex items-center gap-2 bg-blue-500/30 border border-blue-400/30 px-4 py-2 rounded-full">
            <Megaphone size={16} className="text-blue-200" />
            <span className="text-blue-100 text-xs font-black uppercase tracking-widest">
              {t('announcements.officialNotice')}
            </span>
          </div>
        </div>

        <h2 className="text-3xl font-black text-white leading-tight tracking-tight mb-5">
          {data.subject}
        </h2>

        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Calendar size={15} className="text-blue-200" />
            <span className="text-white/80 text-sm font-semibold">{dateStr}</span>
          </div>
          <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
            <Clock size={15} className="text-blue-200" />
            <span className="text-white/80 text-sm font-semibold">{timeStr}</span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-8 py-8">
        <p className="text-gray-700 text-xl leading-relaxed font-medium whitespace-pre-wrap">
          {data.message}
        </p>
      </div>
    </div>
  );
};

export default AnnouncementDetail;
