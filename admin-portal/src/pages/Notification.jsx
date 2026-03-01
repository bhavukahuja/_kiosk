import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/Instance';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Trash2,
  Edit3,
  Loader2,
  AlertCircle,
  Megaphone,
  Fingerprint,
  ChevronRight,
} from 'lucide-react';

const Notification = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    if (!id) return;

    const fetchDetail = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await axiosInstance.get(`/api/announcement/${id}`);
        setData(res.data.announcement || res.data);
      } catch (err) {
        console.error('Fetch Error:', err);
        setError('The requested bulletin could not be retrieved from the server.');
      } finally {
        setLoading(false);
      }
    };

    fetchDetail();
  }, [id]);

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Confirm identity revocation for this notice? It will be removed from all kiosks immediately.'
      )
    )
      return;

    setActionLoading(true);
    try {
      await axiosInstance.delete(`/api/announcement/delete/${id}`);
      navigate('/notifications');
    } catch (err) {
      setError('Administrative deletion failed. System override required.');
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-slate-50/30">
        <div className="relative">
          <div className="w-16 h-16 border-4 border-slate-200 border-t-slate-900 rounded-full animate-spin" />
          <div className="absolute inset-0 flex items-center justify-center">
            <Megaphone size={20} className="text-slate-900" />
          </div>
        </div>
        <span className="mt-6 text-xs font-black text-slate-400 uppercase tracking-[0.5em] animate-pulse">
          Syncing Notice Data
        </span>
      </div>
    );

  if (error || !data)
    return (
      <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col items-center justify-center p-8 sm:p-20 text-center bg-slate-50">
        <div className="w-24 h-24 bg-red-50 rounded-3xl flex items-center justify-center mb-8 border border-red-100">
          <AlertCircle size={48} className="text-red-400" />
        </div>
        <h3 className="text-2xl sm:text-3xl font-black text-slate-800 mb-4">
          {error || 'Bulletin Not Found'}
        </h3>
        <button
          onClick={() => navigate('/notifications')}
          className="px-8 sm:px-10 py-3 sm:py-4 bg-slate-900 text-white rounded-2xl font-black text-base sm:text-lg shadow-xl shadow-blue-900/20 active:scale-95 transition-all"
        >
          Return to Directory
        </button>
      </div>
    );

  const formattedDate = new Date(data.createdAt).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col font-sans bg-slate-50 overflow-hidden">
      <header className="px-6 sm:px-12 py-6 sm:py-8 bg-white border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 z-10 gap-4">
        <div className="flex items-center gap-4 sm:gap-6">
          <button
            onClick={() => navigate(-1)}
            className="group p-3 sm:p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-400 hover:text-slate-900 hover:border-slate-900 transition-all active:scale-95 shrink-0"
          >
            <ArrowLeft size={24} className="group-hover:-translate-x-1 transition-transform" />
          </button>
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <Fingerprint className="text-blue-500" size={14} />
              <span className="text-[10px] sm:text-xs font-black text-slate-400 uppercase tracking-[0.4em]">
                Notice ID: {data._id.slice(-6).toUpperCase()}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
              Bulletin Verification
            </h1>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 sm:gap-4 w-full sm:w-auto">
          <button className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 border-2 border-slate-100 text-slate-400 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-slate-50 transition-all">
            <Edit3 size={16} /> Edit Bulletin
          </button>
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 sm:px-6 py-3 bg-red-50 text-red-500 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all active:scale-95 shadow-lg shadow-red-500/10"
          >
            {actionLoading ? <Loader2 size={16} className="animate-spin" /> : <Trash2 size={16} />}
            Revoke Access
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto p-6 sm:p-12 custom-scrollbar bg-slate-50/20">
        <div className="max-w-5xl mx-auto space-y-10">
          <div className="bg-white rounded-3xl sm:rounded-[44px] shadow-sm border border-slate-200 overflow-hidden relative">
            <div className="absolute top-0 left-0 w-2 h-full bg-slate-900" />

            <div className="p-8 sm:p-12 lg:p-16">
              <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-8 sm:mb-10 pb-6 sm:pb-8 border-b border-slate-50">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                    <Calendar size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Broadcast Date
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-slate-900">{formattedDate}</p>
                  </div>
                </div>
                <div className="hidden sm:block w-px h-10 bg-slate-100" />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center shrink-0">
                    <Clock size={20} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">
                      Network Status
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-emerald-600 flex items-center gap-2">
                      <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                      Live in Kiosks
                    </p>
                  </div>
                </div>
              </div>

              <div className="mb-8 sm:mb-10">
                <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tighter leading-tight">
                  {data.subject}
                </h2>
              </div>

              <div className="relative">
                <p className="text-lg sm:text-xl font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                  {data.message}
                </p>
              </div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-8 opacity-20 py-10">
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
                Encrypted Storage
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-1 h-1 bg-slate-400 rounded-full" />
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.4em]">
                Audit Log #AN-{id.slice(-4)}
              </span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #e2e8f0; 
          border-radius: 20px; 
          border: 2px solid #fcfdfe;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #cbd5e1; }
      `}</style>
    </div>
  );
};

export default Notification;
