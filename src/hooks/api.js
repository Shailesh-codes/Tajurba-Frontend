import axios from 'axios';

const api = import.meta.env.VITE_BACKEND_URL;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.headers.common['Accept'] = 'application/json';
axios.defaults.headers.post['Content-Type'] = 'application/json';

export default api;