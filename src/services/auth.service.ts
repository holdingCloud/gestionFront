import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { User } from "../interfaces";

export interface LoginResponse {
    user: User;
    accessToken: string;
    refreshToken: string;
}


export class AuthService {


    static login = async (email: string, password: string): Promise<LoginResponse> => {

        try {
            const { data } = await gestionApi.post<LoginResponse>('/auth/login', { email, password });
            return { ...data };

        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.error);
            }
            throw new Error('Unable to login');
        }
    }

    static logout = async (accessToken?: string, refreshToken?: string): Promise<void> => {
        try {
            // El backend valida el token contra Redis y borra la sesión activa.
            // Header explícito porque el store se limpia de inmediato; timeout acotado para no colgar el cierre.
            await gestionApi.post('/auth/logout', {}, {
                timeout: 4000,
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                    'x-refresh-token': refreshToken ?? '',
                },
            });
        } catch {
            // Ignoramos errores (token vencido / red): el cierre local ya se realizó.
        }
    }

    static checkStatus = async () => {
        try {
            const { data } = await gestionApi.post<{ accessToken: string, refreshToken: string }>('/auth/refresh');
            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data);
            }
            throw new Error('Unable to login');
        }
    }

}