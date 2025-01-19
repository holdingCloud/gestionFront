import { AxiosError } from 'axios';
import { gestionApi } from '../api/gestion.api';
import { pagination } from '../interfaces/pagination.interface';
import { employeeBody, EmployeeResponse, Employees } from '../interfaces/employee.interface';


export class EmployeeService {


    static getEmployees = async ({ skip, take }: pagination) => {
        try {
            const queryParams = {
                skip,
                take
            }

            const { data } = await gestionApi.get<EmployeeResponse>(`/employee`, {
                params: queryParams
            });

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            throw new Error("Unable get employees");
        }

    }

    static getEmployee = async (id: number) => {

        try {

            const { data } = await gestionApi.get(`/employee/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable get employee');
        }

    }


    static createrEmployee = async (employee: employeeBody) => {

        try {
            const { data } = await gestionApi.post(`/employee/`, employee);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to employee');
        }
    }

    static updateEmployee = async (employee: Employees) => {

        const { id } = employee;

        try {
            const { data } = await gestionApi.put(`/employee/${id}`, employee);

            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to employee');
        }
    }

    static changeStatus = async (id: number, status: boolean) => {
        try {
            const { data } = await gestionApi.patch(`/empployee/${id}`, { status });

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to employee');
        }
    }


    static deleteEmployee = async (id: number): Promise<{ message: string, success: boolean }> => {

        try {
            const { data } = await gestionApi.delete<{ message: string, success: boolean }>(`/employee/${id}`);

            return data;

        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to employee');
        }
    }


}