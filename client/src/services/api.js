import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

export function setStudentToken(token) {
  if (token) {
    localStorage.setItem('student_token', token);
  } else {
    localStorage.removeItem('student_token');
  }
}

export function getStudentToken() {
  return localStorage.getItem('student_token');
}

export function setAdminToken(token) {
  if (token) {
    localStorage.setItem('admin_token', token);
  } else {
    localStorage.removeItem('admin_token');
  }
}

export function getAdminToken() {
  return localStorage.getItem('admin_token');
}

api.interceptors.request.use((config) => {
  const isAdminCall = config.url?.startsWith('/admin');
  const token = isAdminCall ? getAdminToken() : getStudentToken();
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';
    if (status === 401 && url.startsWith('/admin') && !url.endsWith('/admin/login')) {
      setAdminToken(null);
      if (window.location.pathname.startsWith('/admin')) {
        window.location.href = '/admin/login';
      }
    }
    return Promise.reject(error);
  }
);

export default api;
