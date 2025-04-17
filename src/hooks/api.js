import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add request interceptor to include token from both sources
api.interceptors.request.use(
  (config) => {
    // Try to get token from cookie first
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find(cookie => cookie.trim().startsWith('token='));
    let token = tokenCookie ? tokenCookie.split('=')[1] : null;

    // Fallback to localStorage if no cookie token
    if (!token) {
      token = localStorage.getItem("token");
    }

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle 401/403 errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Don't automatically logout on auth errors
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      console.warn('Auth error but maintaining session:', error);
      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
