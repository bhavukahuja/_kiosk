import React, { useState, useContext } from 'react';
import { 
  Settings as SettingsIcon, 
  User, 
  Lock, 
  Mail, 
  Bell, 
  Shield, 
  Eye, 
  EyeOff,
  Save,
  RefreshCw,
  LogOut,
  Fingerprint
} from 'lucide-react';
import { authContext } from '../context/AuthContext';
import { PageLoader, Card, FormInput, Button } from '../components/ui';
import axios from 'axios';
import toast from 'react-hot-toast';

const Settings = () => {
  const { user, setuser, navigate } = useContext(authContext);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.put('/api/auth/update-profile', profileData);
      const updatedUser = { ...user, ...profileData };
      setuser(updatedUser);
      localStorage.setItem('user', JSON.stringify(updatedUser));
      toast.success("Profile updated successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords don't match");
      return;
    }
    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    setLoading(true);
    try {
      await axios.put('/api/auth/change-password', {
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword
      });
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      toast.success("Password changed successfully!");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to change password");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await axios.get('/api/auth/logout');
      setuser(null);
      localStorage.removeItem('user');
      navigate('/login');
      toast.success("Logged out successfully");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="ml-72 mt-24 min-h-[calc(100vh-6rem)] bg-[#f8fafc] p-8">
      {/* Page Title */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-[#002b5c] rounded-xl flex items-center justify-center text-white">
            <SettingsIcon size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-[#002b5c]">Settings</h1>
            <p className="text-sm text-slate-500">Manage your account preferences</p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl space-y-6">
        {/* Profile Settings */}
        <Card 
          headerIcon={User} 
          headerTitle="Profile Information" 
          headerSubtitle="Update your personal details"
        >
          <form onSubmit={handleProfileUpdate} className="p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="Full Name"
                name="name"
                icon={User}
                value={profileData.name}
                onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                placeholder="Your name"
              />
              <FormInput
                label="Email Address"
                name="email"
                type="email"
                icon={Mail}
                value={profileData.email}
                onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                placeholder="your@email.com"
              />
            </div>
            <div className="bg-slate-50 rounded-xl p-4 flex items-center gap-3">
              <Fingerprint size={18} className="text-slate-400" />
              <div>
                <p className="text-sm font-medium text-slate-700">User ID</p>
                <p className="text-xs text-slate-500">{user?.userId || 'N/A'}</p>
              </div>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={loading} icon={Save}>
                Save Changes
              </Button>
            </div>
          </form>
        </Card>

        {/* Password Settings */}
        <Card 
          headerIcon={Lock} 
          headerTitle="Change Password" 
          headerSubtitle="Update your security credentials"
        >
          <form onSubmit={handlePasswordChange} className="p-6 space-y-4">
            <FormInput
              label="Current Password"
              name="currentPassword"
              type={showPassword ? "text" : "password"}
              icon={Lock}
              value={passwordData.currentPassword}
              onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
              placeholder="Enter current password"
            />
            <div className="grid grid-cols-2 gap-4">
              <FormInput
                label="New Password"
                name="newPassword"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Enter new password"
              />
              <FormInput
                label="Confirm Password"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                icon={Lock}
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
              />
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-700"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                {showPassword ? "Hide passwords" : "Show passwords"}
              </button>
            </div>
            <div className="flex justify-end pt-2">
              <Button type="submit" loading={loading} icon={RefreshCw}>
                Update Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Account Info */}
        <Card 
          headerIcon={Shield} 
          headerTitle="Account Information" 
          headerSubtitle="Your account status"
        >
          <div className="p-6">
            <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl mb-4">
              <div>
                <p className="text-sm font-medium text-slate-700">Account Role</p>
                <p className="text-xs text-slate-500">Your access level in the system</p>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                user?.role === 'superAdmin' ? 'bg-purple-100 text-purple-700' :
                user?.role === 'admin' ? 'bg-emerald-100 text-emerald-700' :
                'bg-slate-100 text-slate-700'
              }`}>
                {user?.role || 'User'}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-red-50 rounded-xl">
              <div>
                <p className="text-sm font-medium text-red-700">Sign Out</p>
                <p className="text-xs text-red-500">End your current session</p>
              </div>
              <Button variant="danger" size="small" onClick={handleLogout} icon={LogOut}>
                Logout
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Settings;