export const API_HOST = 'http://192.168.1.164:8058';
export const API_ENDPOINTS = {
    BASE_URL: API_HOST,
    LOGIN: `${API_HOST}/auth/login`,
    GOOGLE_LOGIN: `${API_HOST}/auth/google`,
    APPLE_LOGIN: `${API_HOST}/auth/apple`,
    USER_INFO: `${API_HOST}/users/me`,
    SCHEDULE: `${API_HOST}/items/schedule`,
    TASKS: `${API_HOST}/items/tasks`,
    FILES: `${API_HOST}/files`,
};
