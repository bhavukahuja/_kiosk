import React, { useState } from 'react';
import {
  Settings as SettingsIcon,
  LogOut,
  Monitor,
  RefreshCw,
  Power,
  Plus,
  Minus,
  LogOut as DoorOpen,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(0);

  const handleLogout = () => {
    toast.success('Admin session ended');
    navigate('/');
  };

  const handleCloseKiosk = () => {
    if (
      window.confirm('Are you sure you want to exit the Kiosk mode? This requires app restart.')
    ) {
      if (window.ipcRenderer) {
        window.ipcRenderer.send('quit-app');
      } else {
        toast.error('Unable to close: Not running in Electron environment');
      }
    }
  };

  const handleCheckUpdates = () => {
    toast.success('Checking for updates...');
    // Add logic here to check for updates via electron-updater if implemented
  };

  const adjustZoom = (delta: number) => {
    const newZoom = zoomLevel + delta;
    setZoomLevel(newZoom);
    if (window.ipcRenderer) {
      window.ipcRenderer.send('set-zoom-level', newZoom);
    } else {
      toast.error('UI scaling only works in Electron environment');
    }
  };

  return (
    <div className="w-full h-full bg-slate-50 overflow-hidden flex flex-col p-8 md:p-12 animate-in slide-in-from-bottom-4 duration-500 rounded-3xl shadow-2xl relative">
      <div className="flex items-center justify-between mb-10 pb-6 border-b border-slate-200">
        <div className="flex items-center gap-4 text-slate-800">
          <div className="p-3 bg-blue-100/50 rounded-2xl border border-blue-100">
            <SettingsIcon size={36} className="text-blue-600" />
          </div>
          <div>
            <h1 className="text-3xl font-black tracking-tight">System Settings</h1>
            <p className="text-slate-500 font-medium tracking-wide">Administrator Controls</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-6 py-4 bg-slate-200/50 text-slate-700 hover:bg-slate-200 hover:text-slate-900 rounded-2xl font-bold transition-all active:scale-95"
        >
          <LogOut size={22} />
          Lock Settings
        </button>
      </div>

      <div className="flex-1 overflow-y-auto pr-4 custom-scrollbar">
        <div className="flex flex-col gap-4 max-w-4xl mx-auto w-full">
          {/* Check for Updates */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-emerald-50 rounded-2xl text-emerald-600 group-hover:scale-110 transition-transform">
                <RefreshCw size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Check for Updates</h3>
                <p className="text-slate-500 font-medium">
                  Verify and install the latest software updates for the Kiosk application.
                </p>
              </div>
            </div>
            <button
              onClick={handleCheckUpdates}
              className="py-3 px-8 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all whitespace-nowrap"
            >
              Check Now
            </button>
          </div>

          {/* Display config */}
          <div className="bg-white border border-slate-200 p-6 rounded-3xl flex items-center justify-between hover:shadow-md transition-shadow group">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-blue-50 rounded-2xl text-blue-600 group-hover:scale-110 transition-transform">
                <Monitor size={28} />
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800 mb-1">Display Options</h3>
                <p className="text-slate-500 font-medium">
                  Adjust UI scaling factor for the Kiosk terminal.
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button
                onClick={() => adjustZoom(-0.5)}
                className="p-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                title="Decrease Scale"
              >
                <Minus size={20} className="stroke-[3]" />
              </button>
              <div className="w-12 text-center font-bold text-slate-700">
                {zoomLevel > 0 ? '+' : ''}
                {zoomLevel}
              </div>
              <button
                onClick={() => adjustZoom(0.5)}
                className="p-3 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all"
                title="Increase Scale"
              >
                <Plus size={20} className="stroke-[3]" />
              </button>
            </div>
          </div>

          {/* Exit Kiosk */}
          <div className="bg-red-50/50 border border-red-200 p-6 rounded-3xl flex items-center justify-between hover:shadow-lg transition-all group mt-6">
            <div className="flex items-center gap-6">
              <div className="p-4 bg-red-100/80 rounded-2xl text-red-600 group-hover:scale-110 shadow-sm transition-transform">
                <Power size={28} />
              </div>
              <div>
                <h3 className="text-xl font-extrabold text-red-900 mb-1">Exit Kiosk Mode</h3>
                <p className="text-red-700/80 font-medium">
                  Gracefully terminate the application and return to the host operating system.
                </p>
              </div>
            </div>
            <button
              onClick={handleCloseKiosk}
              className="py-3 px-8 bg-red-600 text-white font-bold rounded-xl hover:bg-red-700 shadow-xl shadow-red-600/30 active:scale-95 transition-all whitespace-nowrap flex items-center gap-2"
            >
              Exit
              <DoorOpen size={20} className="stroke-[2.5]" />
            </button>
          </div>
        </div>
      </div>

      <div className="absolute bottom-6 right-8 text-right">
        <p className="text-slate-400 font-bold tracking-widest text-sm uppercase">
          Campus 360 Ecosystem
        </p>
        <p className="text-slate-300 font-medium text-xs mt-1">v1.0.0-beta</p>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 8px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 20px; }
      `}</style>
    </div>
  );
};

export default Settings;
