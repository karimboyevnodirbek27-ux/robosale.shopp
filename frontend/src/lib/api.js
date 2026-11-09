import { API_URL } from '../config';

// Saqlangan JWT tokenni olish
export const getToken = () => localStorage.getItem('token');

// fetch wrapper: API_URL ni qo'shadi va tokenni Authorization header'ga qo'shadi.
// FormData yuborilganda Content-Type avtomatik qo'yilmaydi.
export const apiFetch = async (path, options = {}) => {
    const headers = { ...(options.headers || {}) };
    const token = getToken();

    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    const isFormData = options.body instanceof FormData;
    if (options.body && !isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;

    const response = await fetch(`${API_URL}${normalizedPath}`, {
        ...options,
        headers
    });

    // Token muddati tugagan yoki yaroqsiz bo'lsa, login holatini tozalaymiz.
    if (response.status === 401) {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        window.dispatchEvent(new Event('auth:expired'));
    }

    return response;
};

// Javobni JSON sifatida o'qib, xato bo'lsa throw qiladi.
export const readJson = async (response) => {
    let data;
    try {
        data = await response.json();
    } catch {
        throw new Error('Serverdan noto\'g\'ri javob keldi');
    }

    if (!response.ok || data.success === false) {
        throw new Error(data.message || `So'rov xatosi (${response.status})`);
    }

    return data;
};
