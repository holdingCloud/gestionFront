import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { User } from "../interfaces";

export interface LoginResponse {
    user: User;
    token: string;
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

    static checkStatus = async () => {
        try {
            const { data } = await gestionApi.get<{ token: string }>('/auth/refreshToken');
            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data);
            }
            throw new Error('Unable to login');
        }
    }

    static reNewSession = async (id: number) => {

        try {

            const { data } = await gestionApi.get<{ token: string }>(`/auth/keepSession/${id}`);
            return data;
        } catch (error) {
            throw new Error('Unable to login');
        }
    }
}