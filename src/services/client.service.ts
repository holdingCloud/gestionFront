import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { ClientBody, ClientFrequency, ClientPaginatedResponse, ClientPurchase, ClientPurchasePaginatedResponse, ClientResponse, PurchaseBody, PurchaseStatus } from "../interfaces/client.interface";

export class ClientService {

    static getClients = async (params?: {
        page?: number;
        limit?: number;
        search?: string;
        contactStatus?: string;
        communeId?: number;
    }): Promise<ClientPaginatedResponse> => {
        try {
            const { page = 1, limit = 20, ...filters } = params ?? {};
            const { data } = await gestionApi.get<ClientPaginatedResponse>('/clients/', {
                params: { page, limit, ...filters },
            });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Request failed while fetching clients."
                );
            }
            throw new Error("Unexpected error while fetching clients.");
        }
    }

    static getClient = async (id: number): Promise<ClientResponse> => {
        try {
            const { data } = await gestionApi.get<ClientResponse>(`/clients/${id}`);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Request failed while fetching client."
                );
            }
            throw new Error("Unexpected error while fetching client.");
        }
    }

    static createClient = async (client: ClientBody): Promise<ClientResponse> => {
        try {
            const { data } = await gestionApi.post<ClientResponse>(`/clients/`, client);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Request failed while creating client."
                );
            }
            throw new Error("Unexpected error while creating client.");
        }
    }

    static updateClient = async (id: number, client: ClientBody): Promise<ClientResponse> => {
        try {
            const { data } = await gestionApi.patch<ClientResponse>(`/clients/${id}`, client);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Request failed while updating client."
                );
            }
            throw new Error("Unexpected error while updating client.");
        }
    }

    static deleteClient = async (id: number): Promise<void> => {
        try {
            await gestionApi.delete(`/clients/${id}`);
        } catch (error: unknown) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(
                    typeof error.response?.data === "string"
                        ? error.response.data
                        : "Request failed while deleting client."
                );
            }
            throw new Error("Unexpected error while deleting client.");
        }
    }

    static getLlamarCount = async (): Promise<number> => {
        try {
            const { data } = await gestionApi.get<ClientPaginatedResponse>(`/clients/?page=1&limit=1&contactStatus=LLAMAR`);
            return data.total;
        } catch {
            return 0;
        }
    }

    static getClientPurchases = async (
        clientId: number,
        params?: { page?: number; limit?: number; product?: string; startDate?: string; endDate?: string }
    ): Promise<ClientPurchasePaginatedResponse> => {
        try {
            const { data } = await gestionApi.get<ClientPurchasePaginatedResponse>(
                `/clients/${clientId}/purchases`,
                { params: { page: 1, limit: 50, ...params } }
            );
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data ?? "Error al obtener compras.");
            throw new Error("Error inesperado al obtener compras.");
        }
    }

    static registerClientPurchase = async (clientId: number, body: PurchaseBody): Promise<ClientPurchase> => {
        try {
            const { data } = await gestionApi.post<ClientPurchase>(`/clients/${clientId}/purchases`, body);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? "Error al registrar compra.");
            throw new Error("Error inesperado al registrar compra.");
        }
    }

    static getClientFrequency = async (clientId: number): Promise<ClientFrequency[]> => {
        try {
            const { data } = await gestionApi.get<ClientFrequency[]>(`/clients/${clientId}/frequency`);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data ?? "Error al obtener frecuencia.");
            throw new Error("Error inesperado al obtener frecuencia.");
        }
    }

    static updatePurchaseStatus = async (clientId: number, purchaseId: number, purchaseStatus: Exclude<PurchaseStatus, 'PENDIENTE'>): Promise<ClientPurchase> => {
        try {
            const { data } = await gestionApi.patch<ClientPurchase>(`/clients/${clientId}/purchases/${purchaseId}/status`, { purchaseStatus });
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data?.message ?? "Error al actualizar estado de compra.");
            throw new Error("Error inesperado al actualizar estado de compra.");
        }
    }
}
