import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { 
  User as UserIcon, 
  Bell,
  Ticket,
  Clock,
  CheckCircle2,
  ChevronRight,
  Calendar,
  Eye,
  Megaphone
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageLoader, PageHeader, StatCard, Card, Button } from '../components/ui';

const UserDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    totalAnnouncements: 0,
    myTickets: 0,
    resolvedTickets: 0
  });
  const [recentAnnouncements, setRecentAnnouncements] = useState([]);
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [announcementsRes, ticketsRes] = await Promise.all([
        axios.get('/api/announcement/all'),
        axios.get('/api/help-ticket/all')
      ]);

      const announcements = announcementsRes.data.announcements || [];
      const tickets = ticketsRes.data.tickets || ticketsRes.data || [];

      setStats({
        totalAnnouncements: announcements.length,
        myTickets: tickets.length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length
      });

      setRecentAnnouncements(announcements.slice(0, 5));
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      toast.error("Unable to sync with the server.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  if (loading) return <PageLoader message="Loading Dashboard..." />;

  const statsData = [
    { label: 'Announcements', value: stats.totalAnnouncements, icon: Bell, color: 'text-indigo-600', bgColor: 'bg-indigo-50', onClick: () => navigate('/notifications') },
    { label: 'Help Tickets', value: stats.myTickets, icon: Ticket, color: 'text-amber-600', bgColor: 'bg-amber-50', onClick: () => navigate('/help-requests') },
    { label: 'Resolved', value: stats.resolvedTickets, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', onClick: () => navigate('/help-requests') }
  ];

  const quickActions = [
    { label: 'View Announcements', icon: Bell, route: '/notifications', color: 'bg-indigo-50 text-indigo-600' },
    { label: 'Browse Faculty', icon: UserIcon, route: '/faculty', color: 'bg-blue-50 text-blue-600' },
    { label: 'Help Tickets', icon: Ticket, route: '/help-requests', color: 'bg-amber-50 text-amber-600' }
  ];

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      <PageHeader user={user} roleLabel="User" />

      {/* Stats */}
      <section className="grid grid-cols-3 gap-4 mb-8">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </section>

      {/* Recent Announcements */}
      <Card
        headerIcon={Megaphone}
        headerTitle="Latest Announcements"
        headerSubtitle="Campus broadcasts and updates"
        headerAction={
          <Button variant="primary" size="small" onClick={() => navigate('/notifications')}>
            View All <ChevronRight size={14} />
          </Button>
        }
        className="mb-6"
      >
        <div className="p-5">
          {recentAnnouncements.length > 0 ? (
            <div className="space-y-3">
              {recentAnnouncements.map((announcement) => (
                <div 
                  key={announcement._id}
                  onClick={() => navigate(`/notification/${announcement._id}`)}
                  className="p-4 bg-slate-50/50 rounded-xl hover:bg-slate-50 transition-all cursor-pointer group flex items-center gap-4"
                >
                  <div className="w-1 h-12 bg-[#002b5c] rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-sm text-[#002b5c] mb-1 group-hover:text-blue-600 transition-colors truncate">
                      {announcement.subject}
                    </h3>
                    <p className="text-xs text-slate-500 line-clamp-1 mb-1">{announcement.message}</p>
                    <div className="flex items-center gap-3 text-[10px] text-slate-400">
                      <div className="flex items-center gap-1">
                        <Calendar size={10} />
                        {new Date(announcement.createdAt).toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock size={10} />
                        {new Date(announcement.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </div>
                    </div>
                  </div>
                  <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center text-slate-300 group-hover:bg-[#002b5c] group-hover:text-white transition-all shadow-sm shrink-0">
                    <Eye size={14} />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-12 text-center">
              <Bell size={40} className="mx-auto text-slate-200 mb-3" />
              <h3 className="text-sm font-medium text-slate-400 mb-1">No Announcements</h3>
              <p className="text-xs text-slate-400">Check back later for campus updates</p>
            </div>
          )}
        </div>
      </Card>

      {/* Quick Actions */}
      <Card
        headerIcon={ChevronRight}
        headerTitle="Quick Actions"
        headerSubtitle="Navigate quickly"
      >
        <div className="p-5">
          <div className="grid grid-cols-3 gap-4">
            {quickActions.map((action, i) => (
              <button
                key={i}
                onClick={() => navigate(action.route)}
                className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl hover:bg-[#002b5c] hover:text-white transition-all group"
              >
                <div className={`w-10 h-10 ${action.color} rounded-lg flex items-center justify-center group-hover:bg-white/20 group-hover:text-white transition-all`}>
                  <action.icon size={18} />
                </div>
                <span className="font-semibold text-sm">{action.label}</span>
                <ChevronRight size={16} className="ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
              </button>
            ))}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default UserDashboard;