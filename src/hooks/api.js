import axios from "axios";

const api = import.meta.env.VITE_BACKEND_URL || "http://localhost:7070/api/v1";

export default api;
