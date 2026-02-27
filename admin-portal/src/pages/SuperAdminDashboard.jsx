import React, { useState, useEffect, useMemo, useContext } from 'react';
import axios from 'axios';
import { 
  ShieldCheck, 
  UserPlus, 
  Users, 
  Trash2, 
  Mail, 
  User as UserIcon, 
  Lock, 
  Activity,
  Fingerprint,
  UserCheck
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { PageLoader, PageHeader, StatCard, Card, FormInput, Button, SearchInput } from '../components/ui';

const SuperAdminDashboard = () => {
  const [allUsers, setAllUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { user } = useContext(authContext);

  const [newUser, setNewUser] = useState({
    name: '',
    userId: '',
    email: '',
    password: '',
    role: 'user'
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const usersRes = await axios.get('/api/auth/all-users');
      setAllUsers(usersRes.data.users || usersRes.data);
    } catch (err) {
      console.error("Dashboard Sync Error:", err);
      toast.error("Unable to sync with the server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
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
      fetchData();
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
      fetchData();
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete user.");
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

  const stats = useMemo(() => ({
    total: allUsers.length,
    admins: allUsers.filter(u => u.role?.toLowerCase() === 'admin').length,
    users: allUsers.filter(u => u.role?.toLowerCase() === 'user').length,
  }), [allUsers]);

  if (loading) return <PageLoader icon={ShieldCheck} message="Establishing Secure Session..." />;

  const statsData = [
    { label: 'Total Users', value: stats.total, icon: Users, color: 'text-blue-600', bgColor: 'bg-blue-50' },
    { label: 'Admins', value: stats.admins, icon: ShieldCheck, color: 'text-emerald-600', bgColor: 'bg-emerald-50' },
    { label: 'Standard Users', value: stats.users, icon: UserCheck, color: 'text-indigo-600', bgColor: 'bg-indigo-50' },
    { label: 'System Status', value: 'Optimal', icon: Activity, color: 'text-slate-600', bgColor: 'bg-slate-50' }
  ];

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      <PageHeader user={user} roleLabel="Super Admin" />

      {/* Stats */}
      <section className="grid grid-cols-4 gap-4 mb-8">
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
            
            {/* Role Selector */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-2">Role</label>
              <div className="flex gap-2 bg-slate-50 p-1.5 rounded-xl border border-slate-100">
                {['user', 'admin'].map(r => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setNewUser({ ...newUser, role: r })}
                    className={`flex-1 py-2 rounded-lg font-bold text-xs transition-all ${
                      newUser.role === r 
                        ? 'bg-white text-[#002b5c] shadow-sm' 
                        : 'text-slate-400 hover:text-slate-600'
                    }`}
                  >
                    {r.charAt(0).toUpperCase() + r.slice(1)}
                  </button>
                ))}
              </div>
            </div>

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
          headerSubtitle="All registered users"
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
                        <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                          u.role?.toLowerCase() === 'admin' || u.role?.toLowerCase() === 'superadmin'
                            ? 'bg-[#002b5c] text-white' 
                            : 'bg-slate-100 text-slate-500'
                        }`}>
                          {u.role?.toLowerCase() === 'admin' || u.role?.toLowerCase() === 'superadmin' 
                            ? <ShieldCheck size={16} /> 
                            : <UserIcon size={16} />
                          }
                        </div>
                        <div>
                          <p className="text-sm font-semibold text-[#002b5c]">{u.name || 'N/A'}</p>
                          <p className="text-xs text-slate-400">ID: {u.userId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase ${
                        u.role?.toLowerCase() === 'superadmin' 
                          ? 'bg-purple-100 text-purple-600'
                          : u.role?.toLowerCase() === 'admin' 
                            ? 'bg-blue-100 text-blue-600' 
                            : 'bg-slate-100 text-slate-600'
                      }`}>
                        {u.role}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <p className="text-sm text-slate-500">{u.email || 'N/A'}</p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end">
                        {u.role?.toLowerCase() !== 'superadmin' && (
                          <button 
                            onClick={() => handleDeleteUser(u._id)}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                          >
                            <Trash2 size={15} />
                          </button>
                        )}
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
    </div>
  );
};

export default SuperAdminDashboard;