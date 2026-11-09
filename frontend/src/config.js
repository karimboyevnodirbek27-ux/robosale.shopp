// Backend API manzili. Production'da VITE_API_URL env orqali beriladi.
// Masalan: VITE_API_URL=https://robosale-api.onrender.com/api
export const API_URL = (import.meta.env.VITE_API_URL || 'http://localhost:5000/api').replace(/\/$/, '');

// Backend serverning o'zi (rasm URL'larini to'ldirish uchun)
export const SERVER_URL = API_URL.replace(/\/api$/, '');
