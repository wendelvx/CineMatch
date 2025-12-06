import axios from 'axios';

// --- SOLUÇÃO: Gerador de UUID manual (Funciona em HTTP e Celular) ---
const generateUUID = () => {
  // Tenta usar o nativo do navegador primeiro (se tiver HTTPS/Localhost)
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    try {
      return crypto.randomUUID();
    } catch (e) {
      // Se falhar, cai para o manual abaixo
    }
  }

  // Plano B: Matemática pura (Funciona sempre)
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

const getSessionUuid = () => {
  let uuid = localStorage.getItem('user_session_uuid');
  // Se não tiver UUID ou se ele for "undefined" (erro antigo), cria um novo
  if (!uuid || uuid === 'undefined') {
    uuid = generateUUID(); // <--- Usa a nossa função segura
    localStorage.setItem('user_session_uuid', uuid);
  }
  return uuid;
};

const api = axios.create({
  // ⚠️ CONFIRA SE ESTE É O IP DO SEU PC AGORA (use ipconfig para ter certeza)
  baseURL: 'http://192.168.1.4:3000/api', 
});

api.interceptors.request.use((config) => {
  const uuid = getSessionUuid();
  config.headers['x-session-uuid'] = uuid;
  return config;
});


api.interceptors.response.use(
  response => response,
  error => {
    console.error("Erro na API:", error);
    if (error.code === 'ERR_NETWORK') {
      alert("ERRO DE REDE: O celular não alcançou o PC. Verifique o IP.");
    } else if (error.response) {
      alert(`ERRO DO SERVIDOR (${error.response.status}): ${JSON.stringify(error.response.data)}`);
    } else {
      alert(`ERRO DESCONHECIDO: ${error.message}`);
    }
    return Promise.reject(error);
  }
);

export default api;