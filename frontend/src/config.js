export const BASE_URL = window.location.hostname === 'localhost' 
  ? 'http://localhost:4000' 
  : (import.meta.env.VITE_API_URL || 'https://skillconnect-major.onrender.com');
