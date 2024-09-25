import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { UserResponse, Users, pagination, userBody, userFilter } from "../interfaces";


export class UserService {


    static getUsers = async ({ skip, take }: pagination, { fullname, email }: userFilter): Promise<UserResponse> => {

        try {


            const queryParams = {
                skip,
                take,
                fullName: fullname,
                email
            }

            const { data } = await gestionApi.get<UserResponse>(`/user`, {
                params: queryParams
            });
            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable get users');
        }
    }

    static getUser = async (id: number): Promise<UserResponse> => {

        try {
            const { data } = await gestionApi.get<UserResponse>(`/user/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to login');
        }
    }

    static createrUser = async (user: userBody): Promise<Users> => {

        try {
            const { data } = await gestionApi.post<Users>(`/user/`, user);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to login');
        }
    }

    static updateUser = async (id: number, user: userBody): Promise<Users> => {

        try {
            const { data } = await gestionApi.put<Users>(`/user/${id}`, user);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to login');
        }
    }

    static changeStatus = async (id: number, status: boolean): Promise<Users> => {
        try {
            const { data } = await gestionApi.patch<Users>(`/user/${id}`, { status });

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to login');
        }
    }

    static deleleUser = async (id: number): Promise<{ message: string, success: boolean }> => {

        try {
            const { data } = await gestionApi.delete<{ message: string, success: boolean }>(`/user/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to login');
        }
    }
}