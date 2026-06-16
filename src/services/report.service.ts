import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import {
    AvgPurchaseFrequencyResponse,
    ClientPurchaseReportItem,
    DailyKpisResponse,
    InactiveClientItem,
    SalesByProductResponse,
    SalesEvolutionResponse,
    TopClientItem,
} from "../interfaces/report.interface";

export class ReportService {

    static getSalesByProduct = async (params?: {
        startDate?: string;
        endDate?: string;
        communeId?: number;
        companyId?: number;
        period?: 'day' | 'week' | 'month';
    }): Promise<SalesByProductResponse> => {
        try {
            const { data } = await gestionApi.get<SalesByProductResponse>('/reports/sales-by-product', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener ventas por producto.');
            }
            throw new Error('Error inesperado al obtener ventas por producto.');
        }
    };

    static getClientsPurchases = async (params?: {
        startDate?: string;
        endDate?: string;
        communeId?: number;
        companyId?: number;
        clientId?: number;
        orderBy?: 'frequency' | 'purchases' | 'amount';
    }): Promise<ClientPurchaseReportItem[]> => {
        try {
            const { data } = await gestionApi.get<ClientPurchaseReportItem[]>('/reports/clients-purchases', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener compras por cliente.');
            }
            throw new Error('Error inesperado al obtener compras por cliente.');
        }
    };

    static getSalesEvolution = async (params?: {
        startDate?: string;
        endDate?: string;
        communeId?: number;
        companyId?: number;
        period?: 'day' | 'week' | 'month';
    }): Promise<SalesEvolutionResponse> => {
        try {
            const { data } = await gestionApi.get<SalesEvolutionResponse>('/reports/sales-evolution', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener evolución de ventas.');
            }
            throw new Error('Error inesperado al obtener evolución de ventas.');
        }
    };

    static getInactiveClients = async (params?: {
        communeId?: number;
        companyId?: number;
    }): Promise<InactiveClientItem[]> => {
        try {
            const { data } = await gestionApi.get<InactiveClientItem[]>('/reports/inactive-clients', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener clientes inactivos.');
            }
            throw new Error('Error inesperado al obtener clientes inactivos.');
        }
    };

    static getTopClients = async (params?: {
        startDate?: string;
        endDate?: string;
        communeId?: number;
        companyId?: number;
        limit?: number;
    }): Promise<TopClientItem[]> => {
        try {
            const { data } = await gestionApi.get<TopClientItem[]>('/reports/top-clients', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener top clientes.');
            }
            throw new Error('Error inesperado al obtener top clientes.');
        }
    };

    static getAvgPurchaseFrequency = async (params?: {
        startDate?: string;
        endDate?: string;
        communeId?: number;
        companyId?: number;
    }): Promise<AvgPurchaseFrequencyResponse> => {
        try {
            const { data } = await gestionApi.get<AvgPurchaseFrequencyResponse>('/reports/avg-purchase-frequency', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener frecuencia promedio.');
            }
            throw new Error('Error inesperado al obtener frecuencia promedio.');
        }
    };

    static getDailyKpis = async (params?: {
        date?: string;
        communeId?: number;
        companyId?: number;
    }): Promise<DailyKpisResponse> => {
        try {
            const { data } = await gestionApi.get<DailyKpisResponse>('/reports/daily-kpis', { params });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                throw new Error(error.response?.data?.message ?? 'Error al obtener KPIs del día.');
            }
            throw new Error('Error inesperado al obtener KPIs del día.');
        }
    };
}
