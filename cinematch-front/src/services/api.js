import axios from 'axios';

const getSessionUuid = () => {
  let uuid = localStorage.getItem('user_session_uuid');
  if (!uuid) {
    uuid = self.crypto.randomUUID();
    localStorage.setItem('user_session_uuid', uuid);
  }
  return uuid;
};

const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
});

api.interceptors.request.use((config) => {
  const uuid = getSessionUuid();
  config.headers['x-session-uuid'] = uuid;
  return config;
});

export default api;