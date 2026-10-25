// Dynamic API & WebSocket Host Config Generator
// Supports cloud deployment via VITE_BACKEND_URL or automatic runtime detection.

const getCustomBackendUrl = () => {
  if (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_BACKEND_URL) {
    return import.meta.env.VITE_BACKEND_URL.replace(/\/+$/, '');
  }
  return null;
};

const customUrl = getCustomBackendUrl();

const getHostName = () => {
  if (typeof window !== 'undefined' && window.location && window.location.hostname) {
    return window.location.hostname;
  }
  return 'localhost';
};

const getProtocol = () => {
  if (typeof window !== 'undefined' && window.location && window.location.protocol) {
    return window.location.protocol;
  }
  return 'http:';
};

export const API_BASE_URL = customUrl 
  ? customUrl 
  : `${getProtocol()}//${getHostName()}:8000`;

export const WS_BASE_URL = customUrl
  ? `${customUrl.startsWith('https') ? 'wss:' : 'ws:'}//${customUrl.replace(/^https?:\/\//, '')}/ws`
  : `${getProtocol() === 'https:' ? 'wss:' : 'ws:'}//${getHostName()}:8000/ws`;

