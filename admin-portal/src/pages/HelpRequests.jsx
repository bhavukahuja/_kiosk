import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { 
  LifeBuoy, 
  Trash2, 
  AlertCircle, 
  CheckCircle2, 
  MessageSquare,
  Cpu,
  Wifi,
  Settings,
  Activity,
  History,
  ChevronDown
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PageLoader, StatCard, Card, SearchInput } from '../components/ui';

const HelpRequests = () => {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const { navigate } = useContext(authContext)

  const categories = [
    { value: 'all', label: 'All Reports', icon: LifeBuoy },
    { value: 'software', label: 'Software', icon: Settings, color: 'text-blue-500' },
    { value: 'hardware', label: 'Hardware', icon: Cpu, color: 'text-amber-500' },
    { value: 'network', label: 'Network', icon: Wifi, color: 'text-indigo-500' },
    { value: 'other', label: 'Other', icon: AlertCircle, color: 'text-slate-500' },
  ];

  const statusOptions = [
    { value: 'open', label: 'Open', color: 'text-red-600', bg: 'bg-red-50', dot: 'bg-red-500' },
    { value: 'in-progress', label: 'In-Progress', color: 'text-blue-600', bg: 'bg-blue-50', dot: 'bg-blue-500' },
    { value: 'resolved', label: 'Resolved', color: 'text-emerald-600', bg: 'bg-emerald-50', dot: 'bg-emerald-500' },
    { value: 'closed', label: 'Closed', color: 'text-slate-500', bg: 'bg-slate-100', dot: 'bg-slate-400' },
  ];

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await axios.get('/api/help-ticket/all');
      setTickets(res.data.tickets || res.data || []);
    } catch (err) {
      console.error("Ticket Sync Error:", err);
      toast.error("Unable to load tickets.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    setActionLoading(true);
    try {
      await axios.put(`/api/help-ticket/update-status/${id}`, { status: newStatus });
      setTickets(prev => prev.map(t => t._id === id ? { ...t, status: newStatus } : t));
      toast.success("Status updated!");
    } catch (err) {
      toast.error("Failed to update status.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this ticket?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/help-ticket/delete/${id}`);
      toast.success("Ticket deleted!");
      fetchTickets();
    } catch (err) {
      toast.error("Failed to delete ticket.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter(t => {
      const matchesSearch = t.subject?.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           t.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || t.category === selectedCategory;
      const matchesStatus = selectedStatus === "all" || t.status === selectedStatus;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [tickets, searchQuery, selectedCategory, selectedStatus]);

  const stats = useMemo(() => ({
    total: tickets.length,
    open: tickets.filter(t => t.status === 'open' || !t.status).length,
    active: tickets.filter(t => t.status === 'in-progress').length,
    resolved: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
  }), [tickets]);

  const getStatusConfig = (status) => {
    const config = statusOptions.find(opt => opt.value === (status || 'open'));
    return config || statusOptions[0];
  };

  if (loading) return <PageLoader message="Loading Tickets..." />;

  const statsData = [
    { label: 'Total', value: stats.total, icon: MessageSquare, color: 'text-slate-600', bgColor: 'bg-slate-50' },
    { label: 'Open', value: stats.open, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50' },
    { label: 'In Progress', value: stats.active, icon: Activity, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Resolved', value: stats.resolved, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50' }
  ];

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      {/* Stats */}
      <section className="grid grid-cols-4 gap-4 mb-6">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </section>

      {/* Tickets Card */}
      <Card
        headerIcon={LifeBuoy}
        headerTitle="Help Tickets"
        headerSubtitle="Support requests"
        headerAction={
          <div className="flex items-center gap-2">
            <div className="flex gap-1 bg-slate-100 p-1 rounded-lg">
              {['all', 'open', 'in-progress', 'resolved'].map(st => (
                <button 
                  key={st}
                  onClick={() => setSelectedStatus(st)}
                  className={`px-3 py-1.5 rounded-md text-[10px] font-bold capitalize transition-all ${selectedStatus === st ? 'bg-white text-[#002b5c] shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
                >
                  {st}
                </button>
              ))}
            </div>
            <SearchInput value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} placeholder="Search..." className="w-48" />
          </div>
        }
      >
        {/* Category Filter */}
        <div className="px-5 py-3 border-b border-slate-50 flex gap-2">
          {categories.map((cat) => (
            <button key={cat.value} onClick={() => setSelectedCategory(cat.value)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat.value ? 'bg-[#002b5c] text-white' : 'bg-slate-50 text-slate-500 hover:bg-slate-100'
              }`}
            >{cat.label}</button>
          ))}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50 border-b border-slate-100">
              <tr className="text-left">
                <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Ticket</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Category</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Date</th>
                <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredTickets.length > 0 ? filteredTickets.map((ticket) => {
                const status = getStatusConfig(ticket.status);
                return (
                  <tr key={ticket._id} className="hover:bg-slate-50/50 transition-colors cursor-pointer"
                    onClick={e => {
                      if (e.target.tagName !== 'SELECT' && e.target.tagName !== 'OPTION' && !e.target.closest('button')) {
                        navigate(`/ticket/${ticket._id}`);
                      }
                    }}
                  >
                    <td className="px-6 py-4 max-w-xs">
                      <div className="flex items-start gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                          ticket.category === 'network' ? 'bg-indigo-50 text-indigo-500' : 
                          ticket.category === 'hardware' ? 'bg-amber-50 text-amber-500' : 'bg-slate-50 text-slate-400'
                        }`}>
                          {ticket.category === 'hardware' ? <Cpu size={14} /> : ticket.category === 'software' ? <Settings size={14} /> : ticket.category === 'network' ? <Wifi size={14} /> : <AlertCircle size={14} />}
                        </div>
                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-[#002b5c] truncate">{ticket.subject}</p>
                          <p className="text-xs text-slate-400 line-clamp-1">{ticket.description}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs font-semibold text-slate-500 capitalize">{ticket.category}</span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="relative inline-block">
                        <select 
                          value={ticket.status || 'open'}
                          onChange={(e) => handleUpdateStatus(ticket._id, e.target.value)}
                          disabled={actionLoading}
                          className={`appearance-none px-3 py-1.5 pr-7 rounded-lg text-[10px] font-bold uppercase cursor-pointer transition-all outline-none ${status.bg} ${status.color}`}
                          onClick={e => e.stopPropagation()}
                        >
                          {statusOptions.map(opt => (
                            <option key={opt.value} value={opt.value}>{opt.label}</option>
                          ))}
                        </select>
                        <ChevronDown size={12} className={`absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none ${status.color}`} />
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="text-xs text-slate-500">{new Date(ticket.createdAt).toLocaleDateString()}</span>
                    </td>
                    <td className="px-6 py-4">
                      <button 
                        onClick={e => { e.stopPropagation(); handleDelete(ticket._id); }}
                        className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={15} />
                      </button>
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} className="py-12 text-center">
                    <History size={40} className="mx-auto text-slate-200 mb-3" />
                    <p className="text-sm font-medium text-slate-400">
                      {searchQuery || selectedCategory !== 'all' || selectedStatus !== 'all' ? "No matching tickets" : "No tickets yet"}
                    </p>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};

export default HelpRequests;