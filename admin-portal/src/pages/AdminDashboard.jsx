import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { 
  Users, 
  Mail, 
  User as UserIcon, 
  GraduationCap,
  Bell,
  AlertCircle,
  CheckCircle2,
  UserPlus,
  Lock,
  Fingerprint,
  Trash2,
  Edit3,
  Save
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { PageLoader, PageHeader, StatCard, Card, FormInput, Button, Modal, SearchInput } from '../components/ui';

const AdminDashboard = () => {
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [allUsers, setAllUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editingUser, setEditingUser] = useState(null);
  const [editFormData, setEditFormData] = useState({ name: '', email: '', userId: '' });
  const [stats, setStats] = useState({
    totalFaculty: 0,
    totalAnnouncements: 0,
    openTickets: 0,
    resolvedTickets: 0,
    totalUsers: 0
  });
  const { user } = useContext(authContext);
  const navigate = useNavigate();

  const [newUser, setNewUser] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    role: 'user'
  });

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const [facultyRes, announcementsRes, ticketsRes, usersRes] = await Promise.all([
        axios.get('/api/faculty/all'),
        axios.get('/api/announcement/all'),
        axios.get('/api/help-ticket/all'),
        axios.get('/api/auth/all-users')
      ]);

      const faculty = facultyRes.data.faculties || facultyRes.data || [];
      const announcements = announcementsRes.data.announcements || [];
      const tickets = ticketsRes.data.tickets || ticketsRes.data || [];
      const users = usersRes.data.users || usersRes.data || [];
      
      const filteredUsers = users.filter(u => u.role !== 'superAdmin' && u.role !== 'admin');
      setAllUsers(filteredUsers);

      setStats({
        totalFaculty: faculty.length,
        totalAnnouncements: announcements.length,
        openTickets: tickets.filter(t => t.status === 'open' || !t.status).length,
        resolvedTickets: tickets.filter(t => t.status === 'resolved' || t.status === 'closed').length,
        totalUsers: filteredUsers.length
      });
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      toast.error("Unable to sync with the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleCreateUser = async (e) => {
    e.preventDefault();
    if (!newUser.userId || !newUser.password) {
      toast.error("User ID and Password are required");
      return;
    }
    setActionLoading(true);
    try {
      await axios.post('/api/auth/create-user', newUser);
      setNewUser({ name: '', userId: '', email: '', password: '', role: 'user' });
      toast.success("User created successfully!");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to create user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    setActionLoading(true);
    try {
      await axios.delete(`/api/auth/delete/${userId}`);
      toast.success("User deleted successfully!");
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser(userToEdit);
    setEditFormData({
      name: userToEdit.name || '',
      email: userToEdit.email || '',
      userId: userToEdit.userId || ''
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    if (!editingUser) return;
    setActionLoading(true);
    try {
      await axios.put(`/api/auth/update/${editingUser._id}`, editFormData);
      toast.success("User updated successfully!");
      setEditingUser(null);
      fetchDashboardData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update user.");
    } finally {
      setActionLoading(false);
    }
  };

  const filteredUsers = useMemo(() => {
    return allUsers.filter(u => 
      u.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
      u.userId?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email?.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [allUsers, searchQuery]);

  if (loading) return <PageLoader message="Loading Dashboard..." />;

  const statsData = [
    { label: 'Users', value: stats.totalUsers, icon: Users, color: 'text-purple-600', bgColor: 'bg-purple-50' },
    { label: 'Faculty', value: stats.totalFaculty, icon: GraduationCap, color: 'text-blue-600', bgColor: 'bg-blue-50', onClick: () => navigate('/faculty') },
    { label: 'Announcements', value: stats.totalAnnouncements, icon: Bell, color: 'text-indigo-600', bgColor: 'bg-indigo-50', onClick: () => navigate('/notifications') },
    { label: 'Open Tickets', value: stats.openTickets, icon: AlertCircle, color: 'text-red-600', bgColor: 'bg-red-50', onClick: () => navigate('/help-requests') },
    { label: 'Resolved', value: stats.resolvedTickets, icon: CheckCircle2, color: 'text-emerald-600', bgColor: 'bg-emerald-50', onClick: () => navigate('/help-requests') }
  ];

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      <PageHeader user={user} roleLabel="Admin" />

      {/* Stats */}
      <section className="grid grid-cols-5 gap-4 mb-8">
        {statsData.map((stat, i) => (
          <StatCard key={i} {...stat} />
        ))}
      </section>

      {/* Main Content */}
      <div className="grid grid-cols-3 gap-6">
        {/* Create User Form */}
        <Card 
          headerIcon={UserPlus} 
          headerTitle="Create User" 
          headerSubtitle="Register new identity"
          className="h-fit"
        >
          <form onSubmit={handleCreateUser} className="p-5 space-y-4">
            <FormInput
              label="Full Name"
              name="name"
              icon={UserIcon}
              value={newUser.name}
              onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
              placeholder="John Doe"
              size="small"
            />
            <FormInput
              label="User ID"
              name="userId"
              icon={Fingerprint}
              value={newUser.userId}
              onChange={(e) => setNewUser({ ...newUser, userId: e.target.value })}
              placeholder="user_001"
              size="small"
            />
            <FormInput
              label="Email"
              name="email"
              type="email"
              icon={Mail}
              value={newUser.email}
              onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
              placeholder="user@campus.edu"
              size="small"
            />
            <FormInput
              label="Password"
              name="password"
              type="password"
              icon={Lock}
              value={newUser.password}
              onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
              placeholder="••••••••"
              size="small"
            />
            <Button type="submit" loading={actionLoading} icon={UserPlus} fullWidth>
              Create User
            </Button>
          </form>
        </Card>

        {/* Users List */}
        <Card 
          className="col-span-2"
          headerIcon={Users} 
          headerTitle="User Directory" 
          headerSubtitle="Registered users"
          headerAction={
            <SearchInput 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search users..."
              className="w-56"
            />
          }
        >
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-100">
                <tr className="text-left">
                  <th className="px-6 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">User</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-[10px] font-bold text-slate-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-right text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filteredUsers.length > 0 ? filteredUsers.map((u) => (
                  <tr key={u._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-slate-100 rounded-lg flex items-center justify-center text-slate-500">
                          <UserIcon size={16} />
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#002b5c]">{u.name || 'N/A'}</p>
                          <p className="text-xs text-slate-400">ID: {u.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className="px-2 py-1 rounded-md text-[10px] font-bold uppercase bg-slate-100 text-slate-600">
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-500">{u.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => handleEditUser(u)}
                          className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        >
                          <Edit3 size={15} />
                        </button>
                        <button 
                          onClick={() => handleDeleteUser(u._id)}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="py-12 text-center">
                      <Users size={40} className="mx-auto text-slate-200 mb-3" />
                      <p className="text-sm font-medium text-slate-400">
                        {searchQuery ? `No results for "${searchQuery}"` : 'No users registered'}
                      </p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Edit User Modal */}
      <Modal 
        isOpen={!!editingUser} 
        onClose={() => setEditingUser(null)}
        title="Edit User"
        subtitle="Modify user details"
        icon={Edit3}
      >
        <form onSubmit={handleUpdateUser} className="space-y-5">
          <FormInput
            label="Full Name"
            name="name"
            icon={UserIcon}
            value={editFormData.name}
            onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
          />
          <FormInput
            label="User ID"
            name="userId"
            icon={Fingerprint}
            value={editFormData.userId}
            disabled
          />
          <FormInput
            label="Email"
            name="email"
            type="email"
            icon={Mail}
            value={editFormData.email}
            onChange={(e) => setEditFormData({ ...editFormData, email: e.target.value })}
          />
          <div className="flex gap-3 pt-2">
            <Button variant="secondary" onClick={() => setEditingUser(null)} fullWidth>
              Cancel
            </Button>
            <Button type="submit" loading={actionLoading} icon={Save} fullWidth>
              Save Changes
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;