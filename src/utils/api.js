import { API_BASE_URL, WS_BASE_URL } from './config';

// 1. WebSocket Realtime Broadcaster Listener Manager
let socket = null;
let reconnectTimer = null;

export const initRealtimeWebSocket = (onItemsUpdated, onStudentsUpdated, onConfigUpdated) => {
  if (typeof window === 'undefined') return;

  const connect = () => {
    try {
      socket = new WebSocket(WS_BASE_URL);

      socket.onopen = () => {
        console.log('⚡ [FastAPI WebSocket] Real-time connection established on:', WS_BASE_URL);
        if (reconnectTimer) clearInterval(reconnectTimer);
      };

      socket.onmessage = (event) => {
        try {
          const payload = JSON.parse(event.data);
          if (payload.event === 'items_updated' && onItemsUpdated) {
            onItemsUpdated(payload.data);
          } else if (payload.event === 'students_updated' && onStudentsUpdated) {
            onStudentsUpdated(payload.data);
          } else if (payload.event === 'config_updated' && onConfigUpdated) {
            onConfigUpdated(payload.data);
          }
        } catch (e) {
          console.error('WebSocket parse error:', e);
        }
      };

      socket.onclose = () => {
        console.warn('⚠️ [FastAPI WebSocket] Connection closed. Retrying in 3s...');
        scheduleReconnect();
      };

      socket.onerror = (err) => {
        console.warn('⚠️ [FastAPI WebSocket] Connection error.');
        socket.close();
      };
    } catch (e) {
      scheduleReconnect();
    }
  };

  const scheduleReconnect = () => {
    if (!reconnectTimer) {
      reconnectTimer = setInterval(() => {
        connect();
      }, 3000);
    }
  };

  connect();
};

// 2. REST API Handlers with Fail-safe Fallback
export const fetchItemsFromBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/items`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('FastAPI backend offline. Using local storage fallback.');
  }
  return null;
};

export const pushItemsToBackend = async (items) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const fetchStudentsFromBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`);
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('FastAPI backend offline. Using local storage fallback.');
  }
  return null;
};

export const pushStudentsToBackend = async (students) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/students`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ students })
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const syncDefaultItemsBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/items/sync`, { method: 'POST' });
    if (res.ok) {
      const data = await res.json();
      return data.items;
    }
  } catch (e) {
    return null;
  }
};

export const buyItemFromBackend = async (itemId, studentId) => {
  try {
    const res = await fetch(`${API_BASE_URL}/api/items/buy`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ itemId, studentId })
    });
    if (res.ok) {
      return await res.json();
    }
  } catch (e) {
    console.warn('FastAPI backend offline.');
  }
  return null;
};

