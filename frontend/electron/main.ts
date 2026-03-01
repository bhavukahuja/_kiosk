import { app, BrowserWindow, ipcMain } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import Store from 'electron-store';
import { autoUpdater } from 'electron-updater';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize electron store
const store = new Store({
  defaults: {
    githubRepo: 'mannuvilasara/kiosk-bfgi',
  },
});

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ └── main.js
// │
process.env.DIST = path.join(__dirname, '../dist');
process.env.VITE_PUBLIC = app.isPackaged
  ? process.env.DIST
  : path.join(process.env.DIST, '../public');

// Suppress common Wayland and dbus console errors on Linux
if (process.platform === 'linux') {
  app.commandLine.appendSwitch('log-level', '3');
}

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - SystemJS only
const VITE_DEV_SERVER_URL = process.env['VITE_DEV_SERVER_URL'];

function createWindow() {
  win = new BrowserWindow({
    width: 800,
    height: 600,
    kiosk: false, // Full screen kiosk mode, set true in production
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: true,
      contextIsolation: false,
    },
  });

  // win.setMenu(null)

  // Test active push message to Renderer-process.
  win.webContents.on('did-finish-load', () => {
    win?.webContents.send('main-process-message', new Date().toLocaleString());
  });

  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST!, 'index.html'));
  }
}

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
    win = null;
  }
});

ipcMain.on('quit-app', () => {
  app.quit();
});

ipcMain.on('set-zoom-level', (_event, level: number) => {
  if (win) {
    win.webContents.setZoomLevel(level);
  }
});

// Settings & Store IPC
ipcMain.handle('get-store-val', (_event, key: string) => {
  return store.get(key);
});

ipcMain.handle('set-store-val', (_event, key: string, val: string | number | boolean | object) => {
  store.set(key, val);
  return store.get(key);
});

// Auto Update logic
function setupAutoUpdater() {
  autoUpdater.logger = console;
  autoUpdater.autoDownload = false;
  autoUpdater.allowPrerelease = false;

  const configureRepo = () => {
    const repo = store.get('githubRepo') as string;
    if (repo && repo.includes('/')) {
      const [owner, name] = repo.split('/');
      autoUpdater.setFeedURL({
        provider: 'github',
        owner: owner,
        repo: name,
      });
    }
  };

  configureRepo();

  ipcMain.on('check-for-updates', () => {
    configureRepo();
    autoUpdater.checkForUpdates().catch((err) => {
      win?.webContents.send('update-error', err?.message);
    });
  });

  autoUpdater.on('update-available', (info) => {
    win?.webContents.send('update-available', info);
  });

  autoUpdater.on('update-not-available', (info) => {
    win?.webContents.send('update-not-available', info);
  });

  autoUpdater.on('error', (err) => {
    win?.webContents.send('update-error', err?.message);
  });

  autoUpdater.on('download-progress', (progressObj) => {
    win?.webContents.send('download-progress', progressObj.percent);
  });

  autoUpdater.on('update-downloaded', () => {
    win?.webContents.send('update-downloaded');
  });

  ipcMain.on('install-update', () => {
    autoUpdater.quitAndInstall();
  });

  ipcMain.on('start-download', () => {
    autoUpdater.downloadUpdate();
  });
}

app.whenReady().then(() => {
  createWindow();
  setupAutoUpdater();
});

