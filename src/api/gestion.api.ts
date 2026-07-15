import axios from "axios";
import { useAuthStore } from "../store/auth/auth.store";

const gestionApi = axios.create({
    baseURL: import.meta.env.VITE_GESTION_API_URL
});

gestionApi.interceptors.request.use(
    (config) => {
        const token = useAuthStore.getState().accessToken;
        const refreshToken = useAuthStore.getState().refreshToken;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            config.headers['x-refresh-token'] = refreshToken;
        }
        return config;
    }
);

// When the server returns 401, the JWT is expired → clear session immediately
gestionApi.interceptors.response.use(
    (response) => response,
    (error) => {
        // Evita bucle: no re-disparar logout si la petición que falló fue el propio /auth/logout
        if (error.response?.status === 401 && !error.config?.url?.includes('/auth/logout')) {
            useAuthStore.getState().logoutUser();
        }
        return Promise.reject(error);
    }
);

export { gestionApi };
