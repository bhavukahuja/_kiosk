import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import axios from 'axios';
import './index.css';
import './i18n';
import App from './App.tsx';
import { HashRouter } from 'react-router-dom';

// Always prefix API requests with the backend URL when running in production (Electron),
// since relative paths don't work on the file:// protocol.
if (import.meta.env.PROD) {
  axios.defaults.baseURL = 'http://localhost:3000';
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HashRouter>
      <App />
    </HashRouter>
  </StrictMode>
);
