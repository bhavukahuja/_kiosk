import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '../utils/Instance';
import {
  ArrowLeft,
  Clock,
  Calendar,
  Trash2,
  Loader2,
  AlertCircle,
  Bug,
  Fingerprint,
  CheckCircle2,
  Settings,
  Cpu,
  Wifi,
  MoreHorizontal,
} from 'lucide-react';

const Ticket = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'text-red-500', bg: 'bg-red-50' },
    { value: 'in-progress', label: 'In-Progress', color: 'text-blue-500', bg: 'bg-blue-50' },
    { value: 'resolved', label: 'Resolved', color: 'text-emerald-500', bg: 'bg-emerald-50' },
    { value: 'closed', label: 'Closed', color: 'text-slate-400', bg: 'bg-slate-100' },
  ];

  const fetchTicketDetail = async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await axiosInstance.get(`/api/help-ticket/${id}`);
      setData(res.data.ticket || res.data);
    } catch (err) {
      console.error('Fetch Error:', err);
      setError('The incident record could not be retrieved from the central registry.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTicketDetail();
  }, [id]);

  const handleUpdateStatus = async (newStatus) => {
    setActionLoading(true);
    try {
      await axiosInstance.put(`/api/help-ticket/update-status/${id}`, { status: newStatus });
      setData((prev) => ({ ...prev, status: newStatus }));
    } catch (err) {
      setError('Administrative status update failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async () => {
    if (
      !window.confirm(
        'Permanent Deletion: This action will expunge the record from the database. Proceed?'
      )
    )
      return;
    setActionLoading(true);
    try {
      await axiosInstance.delete(`/api/help-ticket/delete/${id}`);
      navigate('/help-requests');
    } catch (err) {
      setError('Deletion failed. System override required.');
    } finally {
      setActionLoading(false);
    }
  };

  const getCategoryIcon = (cat) => {
    switch (cat?.toLowerCase()) {
      case 'software':
        return <Settings size={18} />;
      case 'hardware':
        return <Cpu size={18} />;
      case 'network':
        return <Wifi size={18} />;
      default:
        return <MoreHorizontal size={18} />;
    }
  };

  if (loading)
    return (
      <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col items-center justify-center bg-slate-50">
        <Loader2 size={32} className="text-slate-900 animate-spin mb-4" />
        <span className="text-xs font-black text-slate-300 uppercase tracking-widest">
          Syncing Data
        </span>
      </div>
    );
  return (
    <div className="lg:ml-64 mt-20 h-[calc(100vh-5rem)] flex flex-col font-sans bg-slate-50 overflow-hidden">
      <header className="px-6 sm:px-12 py-6 sm:py-8 border-b border-slate-100 flex flex-col sm:flex-row items-start sm:items-center justify-between shrink-0 gap-4">
        <div className="flex items-center gap-4 sm:gap-8">
          <button
            onClick={() => navigate(-1)}
            className="p-2 hover:bg-slate-50 rounded-full transition-all text-slate-400 hover:text-slate-900"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="flex flex-col">
            <span className="text-xs font-black text-slate-300 uppercase tracking-widest leading-none mb-1">
              Ticket ID: {data._id.slice(-6).toUpperCase()}
            </span>
            <h1 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Help Desk Briefing
            </h1>
          </div>
        </div>

        <div className="flex items-center gap-4 w-full sm:w-auto">
          <button
            onClick={handleDelete}
            disabled={actionLoading}
            className="flex items-center justify-center gap-2 px-5 py-2.5 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-xs uppercase tracking-widest w-full sm:w-auto"
          >
            {actionLoading ? <Loader2 size={14} className="animate-spin" /> : <Trash2 size={14} />}
            Delete Ticket
          </button>
        </div>
      </header>

      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="max-w-4xl mx-auto py-8 sm:py-16 px-6 sm:px-12">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8 mb-8 sm:mb-12 pb-6 sm:pb-8 border-b border-slate-50 text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="text-xs font-bold">
                {new Date(data.createdAt).toLocaleDateString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Clock size={16} />
              <span className="text-xs font-bold">
                {new Date(data.createdAt).toLocaleTimeString()}
              </span>
            </div>
            <div className="flex items-center gap-2">
              {getCategoryIcon(data.category)}
              <span className="text-xs font-bold uppercase tracking-widest">{data.category}</span>
            </div>
          </div>

          <div className="mb-12 sm:mb-16">
            <h2 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight mb-6 sm:mb-8">
              {data.subject}
            </h2>
            <div className="bg-slate-50 rounded-3xl sm:rounded-4xl p-6 sm:p-10 border border-slate-100">
              <p className="text-lg sm:text-xl font-medium text-slate-600 leading-relaxed whitespace-pre-wrap">
                {data.description}
              </p>
            </div>
          </div>

          <div className="pt-8 sm:pt-12 border-t border-slate-100">
            <h3 className="text-xs font-black text-slate-300 uppercase tracking-[0.4em] mb-6 sm:mb-8">
              System Lifecycle Management
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {statusOptions.map((opt) => {
                const isActive = data.status === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleUpdateStatus(opt.value)}
                    disabled={actionLoading}
                    className={`
                      relative group flex flex-col items-center justify-center p-6 rounded-3xl border-2 transition-all duration-300
                      ${
                        isActive
                          ? `${opt.bg} ${opt.color} border-current shadow-lg`
                          : 'bg-white border-slate-100 text-slate-400 hover:border-slate-200'
                      }
                      ${actionLoading ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer active:scale-95'}
                    `}
                  >
                    {isActive && <CheckCircle2 size={16} className="absolute top-4 right-4" />}
                    <span className="text-xs font-black uppercase tracking-widest">
                      {opt.label}
                    </span>
                    <span
                      className={`text-[8px] font-bold mt-1 opacity-60 ${isActive ? '' : 'hidden group-hover:block'}`}
                    >
                      {isActive ? 'Current State' : 'Change Status'}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <footer className="p-8 border-t border-slate-50 flex justify-center grayscale opacity-30">
        <div className="flex items-center gap-4">
          <Bug size={14} />
          <span className="text-[9px] font-black uppercase tracking-[0.6em]">
            System Support Interface
          </span>
        </div>
      </footer>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { 
          background: #f1f5f9; 
          border-radius: 20px; 
        }
      `}</style>
    </div>
  );
};

export default Ticket;
