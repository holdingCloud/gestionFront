import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { UserResponse, Users, pagination, UserBody, UserFilter } from "../interfaces";


export class UserService {


    static getUsers = async ({ page, limit }: pagination, { fullName, email }: UserFilter): Promise<UserResponse> => {

        try {


            const queryParams = {
                page,
                limit,
                fullName,
                email
            }

            const { data } = await gestionApi.get<UserResponse>(`/users`, {
                params: queryParams
            });
            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to get users');
        }
    }

    static getUser = async (id: number): Promise<UserResponse> => {

        try {
            const { data } = await gestionApi.get<UserResponse>(`/users/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to get user');
        }
    }

    static createUser = async (user: UserBody): Promise<Users> => {

        try {
            const { data } = await gestionApi.post<Users>(`/users/`, user);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to create user');
        }
    }

    static updateUser = async (id: number, user: UserBody): Promise<Users> => {

        try {
            const { data } = await gestionApi.put<Users>(`/users/${id}`, user);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to update user');
        }
    }

    static changeStatus = async (id: number, status: boolean): Promise<Users> => {
        try {
            const { data } = await gestionApi.patch<Users>(`/users/${id}`, { status });

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to change user status');
        }
    }

    static deleteUser = async (id: number): Promise<{ message: string, success: boolean }> => {

        try {
            const { data } = await gestionApi.delete<{ message: string, success: boolean }>(`/users/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to delete user');
        }
    }
}