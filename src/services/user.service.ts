import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { UserResponse, Users, UserBody, UserFilter, Role } from "../interfaces";

export class UserService {

    static getUsers = async (
        params: { page: number; limit: number },
        filter: UserFilter
    ): Promise<UserResponse> => {
        try {
            const { data } = await gestionApi.get<UserResponse>('/users', {
                params: { ...params, ...filter },
            });
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al obtener usuarios.');
            throw new Error('Error inesperado al obtener usuarios.');
        }
    };

    static createUser = async (user: UserBody): Promise<Users> => {
        try {
            const { data } = await gestionApi.post<Users>('/users/', user);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al crear usuario.');
            throw new Error('Error inesperado al crear usuario.');
        }
    };

    static updateUser = async (id: number, user: Partial<UserBody>): Promise<Users> => {
        try {
            const { data } = await gestionApi.patch<Users>(`/users/${id}`, user);
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al actualizar usuario.');
            throw new Error('Error inesperado al actualizar usuario.');
        }
    };

    static changeStatus = async (id: number, isActive: boolean): Promise<Users> => {
        try {
            const { data } = await gestionApi.patch<Users>(`/users/${id}`, { isActive });
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al cambiar estado.');
            throw new Error('Error inesperado al cambiar estado.');
        }
    };

    static deleteUser = async (id: number): Promise<void> => {
        try {
            await gestionApi.delete(`/users/${id}`);
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al eliminar usuario.');
            throw new Error('Error inesperado al eliminar usuario.');
        }
    };

    static getRoles = async (): Promise<Role[]> => {
        try {
            const { data } = await gestionApi.get<Role[]>('/roles');
            return data;
        } catch (error) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al obtener roles.');
            throw new Error('Error inesperado al obtener roles.');
        }
    };
}
