import { io } from 'socket.io-client';

// Single shared socket instance — connect() called explicitly with the JWT token
let socket = null;

export function getSocket() {
  if (!socket) {
    socket = io({ autoConnect: false });
  }
  return socket;
}

export function connectSocket() {
  const token = localStorage.getItem('token');
  const s = getSocket();
  s.auth = { token };
  if (!s.connected) s.connect();
  return s;
}

export function disconnectSocket() {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
}
