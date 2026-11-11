import { API_URL, SERVER_URL } from '../config';

// Render bepul planda 15 daqiqa harakatsizlikdan keyin uxlaydi.
// Sahifa ochilishi bilan serverni oldindan "uyg'otamiz" (natija muhim emas).
export const warmupApi = () => {
    try {
        fetch(`${SERVER_URL}/health`, { cache: 'no-store' }).catch(() => { });
    } catch {
        // tarmoq yo'q bo'lsa jim o'tamiz
    }
};

// Saqlangan JWT tokenni olish
export const getToken = () => localStorage.getItem('token');

const DEFAULT_TIMEOUT_MS = 25000;
const RETRY_DELAY_MS = 1500;
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Timeout bilan fetch (abort signal'ni ham hurmat qiladi)
const fetchWithTimeout = async (url, options, timeoutMs, externalSignal) => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeoutMs);

    const onExternalAbort = () => controller.abort();
    if (externalSignal) {
        if (externalSignal.aborted) controller.abort();
        else externalSignal.addEventListener('abort', onExternalAbort, { once: true });
    }

    try {
        return await fetch(url, { ...options, signal: controller.signal });
    } finally {
        clearTimeout(timer);
        if (externalSignal) externalSignal.removeEventListener('abort', onExternalAbort);
    }
};

// fetch wrapper: API_URL ni qo'shadi va tokenni Authorization header'ga qo'shadi.
// FormData yuborilganda Content-Type avtomatik qo'yilmaydi.
export const apiFetch = async (path, options = {}) => {
    const { timeoutMs = DEFAULT_TIMEOUT_MS, ...fetchOptions } = options;
    const headers = { ...(fetchOptions.headers || {}) };
    const token = getToken();

    if (token && !headers.Authorization) {
        headers.Authorization = `Bearer ${token}`;
    }

    const isFormData = fetchOptions.body instanceof FormData;
    if (fetchOptions.body && !isFormData && !headers['Content-Type']) {
        headers['Content-Type'] = 'application/json';
    }

    const normalizedPath = path.startsWith('/') ? path : `/${path}`;
    const url = `${API_URL}${normalizedPath}`;

    // Faqat GET so'rovlarini qayta urinamiz (POST'ni takrorlash xavfli).
    const method = (fetchOptions.method || 'GET').toUpperCase();
    const attempts = method === 'GET' ? 2 : 1;

    let lastError;

    for (let attempt = 0; attempt < attempts; attempt += 1) {
        try {
            const response = await fetchWithTimeout(
                url,
                { ...fetchOptions, headers },
                timeoutMs,
                fetchOptions.signal
            );

            // Token muddati tugagan yoki yaroqsiz bo'lsa, login holatini tozalaymiz.
            if (response.status === 401) {
                localStorage.removeItem('token');
                localStorage.removeItem('user');
                window.dispatchEvent(new Event('auth:expired'));
            }

            return response;
        } catch (error) {
            lastError = error;
            if (attempt < attempts - 1 && !fetchOptions.signal?.aborted) {
                await sleep(RETRY_DELAY_MS);
            }
        }
    }

    throw lastError;
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
