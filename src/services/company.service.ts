import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { Company, CompanyBody } from "../interfaces/company.interface";

export class CompanyService {

    static getCompanies = async (): Promise<Company[]> => {
        try {
            const { data } = await gestionApi.get<Company[]>('/companies');
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al obtener empresas.');
            throw new Error('Error inesperado al obtener empresas.');
        }
    };

    static getCompany = async (id: number): Promise<Company> => {
        try {
            const { data } = await gestionApi.get<Company>(`/companies/${id}`);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al obtener empresa.');
            throw new Error('Error inesperado al obtener empresa.');
        }
    };

    static createCompany = async (body: CompanyBody): Promise<Company> => {
        try {
            const { data } = await gestionApi.post<Company>('/companies', body);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al crear empresa.');
            throw new Error('Error inesperado al crear empresa.');
        }
    };

    static updateCompany = async (id: number, body: Partial<CompanyBody>): Promise<Company> => {
        try {
            const { data } = await gestionApi.patch<Company>(`/companies/${id}`, body);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al actualizar empresa.');
            throw new Error('Error inesperado al actualizar empresa.');
        }
    };

    static deleteCompany = async (id: number): Promise<Company> => {
        try {
            const { data } = await gestionApi.delete<Company>(`/companies/${id}`);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? 'Error al eliminar empresa.');
            throw new Error('Error inesperado al eliminar empresa.');
        }
    };
}
