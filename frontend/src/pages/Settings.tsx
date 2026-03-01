import { useState, useEffect } from 'react';
import {
  Settings as SettingsIcon,
  LogOut,
  Monitor,
  RefreshCw,
  Power,
  Plus,
  Minus,
  LogOut as DoorOpen,
  DownloadCloud,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const Settings = () => {
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(0);

  const [appVersion, setAppVersion] = useState('');
  const [updateStatus, setUpdateStatus] = useState('');
  const [newVersion, setNewVersion] = useState<string | null>(null);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [isUpdateDownloaded, setIsUpdateDownloaded] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const [isChecking, setIsChecking] = useState(false);

  useEffect(() => {
    if (window.ipcRenderer) {
      window.ipcRenderer.invoke('get-app-version').then((version: string) => {
        setAppVersion(version);
      });

      const handleUpdateAvailable = (
        _event: Electron.IpcRendererEvent,
        info: { version: string }
      ) => {
        setIsChecking(false);
        setNewVersion(info.version);
        setUpdateStatus(`Ready to download v${info.version}`);
      };

      const handleUpdateNotAvailable = () => {
        setIsChecking(false);
        setUpdateStatus('You are on the latest version.');
      };

      const handleUpdateError = (_event: Electron.IpcRendererEvent, err: string) => {
        setIsChecking(false);
        setIsDownloading(false);
        setUpdateStatus(`Update error: ${err}`);
      };

      const handleDownloadProgress = (_event: Electron.IpcRendererEvent, progress: number) => {
        setDownloadProgress(Math.round(progress));
      };

      const handleUpdateDownloaded = () => {
        setIsDownloading(false);
        setIsUpdateDownloaded(true);
        setUpdateStatus('Update ready to install.');
      };

      window.ipcRenderer.on('update-available', handleUpdateAvailable);
      window.ipcRenderer.on('update-not-available', handleUpdateNotAvailable);
      window.ipcRenderer.on('update-error', handleUpdateError);
      window.ipcRenderer.on('download-progress', handleDownloadProgress);
      window.ipcRenderer.on('update-downloaded', handleUpdateDownloaded);

      return () => {
        if (window.ipcRenderer) {
          window.ipcRenderer.removeAllListeners('update-available');
          window.ipcRenderer.removeAllListeners('update-not-available');
          window.ipcRenderer.removeAllListeners('update-error');
          window.ipcRenderer.removeAllListeners('download-progress');
          window.ipcRenderer.removeAllListeners('update-downloaded');
        }
      };
    }
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
    if (window.ipcRenderer) {
      toast.success('Checking for updates...');
      setUpdateStatus('Checking for updates...');
      setIsChecking(true);
      window.ipcRenderer.send('check-for-updates');
    } else {
      toast.error('Updates only work in Electron environment');
    }
  };

  const handleDownloadUpdate = () => {
    if (window.ipcRenderer) {
      setIsDownloading(true);
      setUpdateStatus('Downloading update...');
      window.ipcRenderer.send('start-download');
    }
  };

  const handleInstallUpdate = () => {
    if (window.ipcRenderer) {
      window.ipcRenderer.send('install-update');
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
                <RefreshCw size={28} />
              </div>
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-slate-800 mb-1">Check for Updates</h3>
                <p className="text-slate-500 font-medium max-w-[400px]">
                  Verify and install the latest software updates for the Kiosk application.
                </p>
                {appVersion && (
                  <div className="text-sm font-bold text-slate-600 mt-1">
                    Current Version:{' '}
                    <span className="bg-slate-100 px-2 py-1 rounded text-slate-700">
                      v{appVersion}
                    </span>
                  </div>
                )}
                {updateStatus && (
                  <p
                    className={`text-sm font-semibold mt-1 ${
                      updateStatus.toLowerCase().includes('error')
                        ? 'text-red-500'
                        : 'text-blue-600'
                    }`}
                  >
                    {updateStatus} {isDownloading && `(${downloadProgress}%)`}
                  </p>
                )}
              </div>
            </div>
            <div className="flex flex-col gap-2">
              {isUpdateDownloaded ? (
                <button
                  onClick={handleInstallUpdate}
                  className="py-3 px-8 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 active:scale-95 transition-all whitespace-nowrap"
                >
                  Restart to Install
                </button>
              ) : newVersion && !updateStatus.includes('latest') ? (
                <button
                  onClick={handleDownloadUpdate}
                  disabled={isDownloading}
                  className="py-3 px-8 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-700 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                >
                  <DownloadCloud size={20} />
                  {isDownloading ? 'Downloading...' : 'Download Update'}
                </button>
              ) : (
                <button
                  onClick={handleCheckUpdates}
                  disabled={isChecking}
                  className="py-3 px-8 bg-slate-100 text-slate-700 font-bold rounded-xl hover:bg-slate-200 active:scale-95 transition-all whitespace-nowrap disabled:opacity-50 flex items-center gap-2"
                >
                  <RefreshCw size={20} className={isChecking ? 'animate-spin' : ''} />
                  {isChecking ? 'Checking...' : 'Check Now'}
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
