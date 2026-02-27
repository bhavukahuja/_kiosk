import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { 
  Bell, 
  Plus, 
  Clock, 
  Trash2, 
  ChevronRight, 
  Megaphone,
  RefreshCw
} from 'lucide-react';
import toast from 'react-hot-toast';
import { PageLoader, SearchInput, Button } from '../components/ui';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await axios.get('/api/announcement/all');
      setNotifications(response.data.announcements || []);
    } catch (err) {
      console.error("Fetch Error:", err);
      toast.error("Unable to load announcements.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await axios.delete(`/api/announcement/delete/${id}`);
      toast.success("Announcement deleted!");
      fetchNotifications();
    } catch (err) {
      toast.error("Failed to delete announcement.");
    }
  };

  const filteredNotifications = notifications.filter(n => 
    n.subject.toLowerCase().includes(searchQuery.toLowerCase()) || 
    n.message.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) return <PageLoader message="Loading Announcements..." />;

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      {/* Header */}
      <header className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-indigo-50 rounded-xl flex items-center justify-center text-indigo-500">
            <Megaphone size={24} />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[#002b5c]">Announcements</h1>
            <p className="text-xs text-slate-400">Campus broadcast system</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <SearchInput
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search announcements..."
            className="w-64"
          />
          <Button icon={Plus} onClick={() => navigate('/create-notifications')}>
            Create
          </Button>
          <button 
            onClick={fetchNotifications}
            className="p-2.5 bg-slate-100 text-slate-500 rounded-lg hover:text-[#002b5c] transition-colors"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </header>

      {/* Announcements List */}
      <div className="space-y-4">
        {filteredNotifications.length > 0 ? (
          filteredNotifications.map((item) => (
            <div 
              key={item._id}
              onClick={() => navigate(`/notification/${item._id}`)}
              className="group bg-white p-5 rounded-xl flex items-center gap-4 shadow-sm border border-slate-100 hover:shadow-lg hover:border-blue-100 transition-all cursor-pointer"
            >
              <div className="w-1 h-12 bg-[#002b5c] rounded-full opacity-30 group-hover:opacity-100 transition-opacity" />
              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className="text-sm font-bold text-[#002b5c] group-hover:text-blue-600 transition-colors truncate pr-4">
                    {item.subject}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[10px] text-slate-400 whitespace-nowrap">
                    <Clock size={12} />
                    {new Date(item.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <p className="text-xs text-slate-500 line-clamp-2">{item.message}</p>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button 
                  onClick={(e) => handleDelete(item._id, e)}
                  className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                >
                  <Trash2 size={16} />
                </button>
                <div className="w-8 h-8 bg-slate-50 rounded-lg flex items-center justify-center text-slate-400 group-hover:bg-[#002b5c] group-hover:text-white transition-all">
                  <ChevronRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="py-16 text-center">
            <Bell size={48} className="mx-auto text-slate-200 mb-4" />
            <p className="text-sm font-medium text-slate-400">
              {searchQuery ? `No results for "${searchQuery}"` : "No announcements yet"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;