import { useState, useEffect, type SetStateAction } from 'react';
import {
  Settings as SettingsIcon,
  LogOut,
  Monitor,
  RefreshCw,
  Power,
  Plus,
  Minus,
  LogOut as DoorOpen,
  Github,
  Download,
  CheckCircle2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import type { IpcRendererEvent } from 'electron';

const Settings = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(0);
  const [repoStr, setRepoStr] = useState('mannuvilasara/kiosk-project');
  const [updateStatus, setUpdateStatus] = useState<string>('idle'); // idle, checking, available, downloading, downloaded
  const [downloadProgress, setDownloadProgress] = useState(0);

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer
        .invoke('get-store-val', 'githubRepo')
        .then((val: SetStateAction<string>) => {
          if (val) setRepoStr(val);
        });

      window.ipcRenderer.on('update-available', () => {
        setUpdateStatus('available');
        toast.success('Update available!');
      });

      window.ipcRenderer.on('update-not-available', () => {
        setUpdateStatus('idle');
        toast.success('You are on the latest version.');
      });

      window.ipcRenderer.on('update-error', (_evt: IpcRendererEvent, msg: string) => {
        setUpdateStatus('idle');
        toast.error(`Update error: ${msg}`);
      });

      window.ipcRenderer.on('download-progress', (_evt: IpcRendererEvent, progress: number) => {
        setUpdateStatus('downloading');
        setDownloadProgress(Math.round(progress));
      });

      window.ipcRenderer.on('update-downloaded', () => {
        setUpdateStatus('downloaded');
        toast.success('Update downloaded and ready to install!');
      });
    }

    return () => {
      // Cleanup generic listeners if component unmounts
      if (window.ipcRenderer) {
        window.ipcRenderer.removeAllListeners('update-available');
        window.ipcRenderer.removeAllListeners('update-not-available');
        window.ipcRenderer.removeAllListeners('update-error');
        window.ipcRenderer.removeAllListeners('download-progress');
        window.ipcRenderer.removeAllListeners('update-downloaded');
      }
    };
  }, []);

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
    if (!window.ipcRenderer) {
      toast.error('Updates only work in the standalone Electron environment');
      return;
    }
    setUpdateStatus('checking');
    toast.success('Checking for updates...');
    window.ipcRenderer.send('check-for-updates');
  };

  const handleDownloadUpdate = () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('start-download');
    }
  };

  const handleInstallUpdate = () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('install-update');
    }
  };

  const handleSetRepo = async () => {
    if (window.ipcRenderer) {
      if (!repoStr.includes('/')) {
        toast.error('Repository must be strictly in owner/repo format');
        return;
      }
      await window.ipcRenderer.invoke('set-store-val', 'githubRepo', repoStr);
      toast.success('Repository linked globally updated');
    }
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
                <RefreshCw
                  size={28}
                  className={updateStatus === 'checking' ? 'animate-spin' : ''}
                />
              </div>
              <div className="max-w-md w-full">
                <h3 className="text-xl font-bold text-slate-800 mb-1">Software Update</h3>
                <p className="text-slate-500 font-medium mb-3">
                  Check, download, and install latest software release from cloud.
                </p>
                <div className="flex items-center gap-3">
                  <div className="flex-1 relative">
                    <Github
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
                      size={18}
                    />
                    <input
                      type="text"
                      className="w-full pl-10 pr-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent text-sm font-medium text-slate-700"
                      placeholder="owner/repo"
                      value={repoStr}
                      onChange={(e) => setRepoStr(e.target.value)}
                    />
                  </div>
                  <button
                    onClick={handleSetRepo}
                    className="px-4 py-2 bg-slate-100 text-slate-600 hover:bg-slate-200 font-bold rounded-xl text-sm transition-colors"
                  >
                    Save Root
                  </button>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              {updateStatus === 'idle' && (
                <button
                  onClick={handleCheckUpdates}
                  className="py-3 px-8 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all whitespace-nowrap"
                >
                  Verify Now
                </button>
              )}

              {updateStatus === 'checking' && (
                <span className="py-3 px-8 bg-slate-50 text-slate-400 font-bold rounded-xl cursor-not-allowed whitespace-nowrap">
                  Checking...
                </span>
              )}

              {updateStatus === 'available' && (
                <button
                  onClick={handleDownloadUpdate}
                  className="py-3 px-8 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-emerald-500/30 flex items-center gap-2"
                >
                  <Download size={18} /> Load Content
                </button>
              )}

              {updateStatus === 'downloading' && (
                <div className="flex flex-col items-center">
                  <span className="text-sm font-bold text-emerald-600 mb-1">
                    {downloadProgress}%
                  </span>
                  <div className="w-32 h-2 bg-emerald-100 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-emerald-500 transition-all duration-300"
                      style={{ width: `${downloadProgress}%` }}
                    />
                  </div>
                </div>
              )}

              {updateStatus === 'downloaded' && (
                <button
                  onClick={handleInstallUpdate}
                  className="py-3 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap shadow-lg shadow-blue-500/30 flex items-center gap-2"
                >
                  <CheckCircle2 size={18} /> Apply Install
                </button>
              )}
            </div>
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
