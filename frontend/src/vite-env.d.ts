/// <reference types="vite/client" />
/// <reference types="node" />

interface Window {
    ipcRenderer: import('electron').ipcRenderer;
}