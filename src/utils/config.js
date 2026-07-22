// Dynamic API & WebSocket Host Config Generator
// Detects window.location.hostname at runtime to handle IP changes across different PCs seamlessly.

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

export const API_BASE_URL = `${getProtocol()}//${getHostName()}:8000`;
export const WS_BASE_URL = `${getProtocol() === 'https:' ? 'wss:' : 'ws:'}//${getHostName()}:8000/ws`;
