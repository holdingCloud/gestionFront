import axios from "axios";
import { useAuthStore } from "../store/auth/auth.store";


const gestionApi = axios.create({
    baseURL: 'http://localhost:3000/api'
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
)

export {
    gestionApi
} 