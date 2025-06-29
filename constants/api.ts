export const API_HOST = "https://admin.tanseeq.pro";
export const HOST = "https://tanseeq.pro";
export const DEFAULT_HOME = "DEFAULT_HOME";
export const API_ENDPOINTS = {
    BASE_URL: API_HOST,
    LOGIN: `${API_HOST}/auth/login`,
    GOOGLE_LOGIN: `${API_HOST}/auth/google`,
    APPLE_LOGIN: `${API_HOST}/auth/apple`,
    USER_INFO: `${API_HOST}/users/me`,
    SCHEDULE: `${API_HOST}/items/schedule`,
    TASKS: `${API_HOST}/items/tasks`,
    FILES: `${API_HOST}/files`,
    HOME: `${API_HOST}/items/properties`,
    HOME_SEARCH: `${API_HOST}/auth/join_home`,
    PROPERTY_USERS: `${API_HOST}/items/properties_directus_users`,
    JOIN_HOME_DEEP: `${HOST}/join/home`,
    VIDEOS: `${API_HOST}/items/videos`,
};
