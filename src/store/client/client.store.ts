import { devtools, persist } from "zustand/middleware";
import { ClientService } from "../../services";
import type { Client, ClientBody } from "../../interfaces";
import { StateCreator, create } from "zustand";

export interface ClientFetchParams {
    page?: number;
    limit?: number;
    search?: string;
    contactStatus?: string;
    communeId?: number;
}

export interface ClientState {
    clients: Client[];
    count: number;
    error: boolean;
    loading: boolean;
    porLlamarCount: number;
    getClients: (params?: ClientFetchParams) => Promise<void>;
    createClient: (client: ClientBody) => Promise<void>;
    updateClient: (id: number, body: ClientBody) => Promise<void>;
    deleteClient: (id: number) => Promise<void>;
    changeAvailability: (id: number, status: boolean) => Promise<void>;
    setStateError: (status: boolean) => void;
    fetchPorLlamarCount: () => Promise<void>;
}

const storeApi: StateCreator<ClientState> = (set, get) => ({
    clients: [],
    count: 0,
    error: false,
    loading: false,
    porLlamarCount: 0,
    getClients: async (params) => {
        set({ loading: true });
        try {
            const { data, total } = await ClientService.getClients(params);
            set({ clients: data, count: total });
        } catch (error) {
            set({ error: true });
        } finally {
            set({ loading: false });
        }
    },
    createClient: async (client) => {
        try {
            await ClientService.createClient(client);
        } catch (error) {
            console.log(error);
        }
    },
    updateClient: async (id, body) => {
        try {
            await ClientService.updateClient(id, body);
        } catch (error) {
            console.log(error);
        }
    },
    deleteClient: async (id) => {
        try {
            await ClientService.deleteClient(id);
            set(state => ({
                clients: state.clients.filter(c => c.id !== id),
                count: state.count - 1
            }));
        } catch (error) {
            console.log(error);
        }
    },
    changeAvailability: async (id, status) => {
        try {
            const client = get().clients.find(c => c.id === id);
            if (client) {
                await ClientService.updateClient(id, {
                    fullname: client.fullname,
                    phone: client.phone,
                    email: client.email,
                    ...(client.companyId ? { companyId: client.companyId } : {}),
                });
                set(state => ({
                    clients: state.clients.map(c => c.id === id ? { ...c, available: status } : c)
                }));
            }
        } catch (error) {
            console.log(error);
        }
    },
    setStateError: (status) => {
        set({ error: status });
    },
    fetchPorLlamarCount: async () => {
        const count = await ClientService.getLlamarCount();
        set({ porLlamarCount: count });
    },
});

export const useClientStore = create<ClientState>()(
    devtools(
        persist(
            storeApi,
            {
                name: 'client-store',
                partialize: (state) => ({ error: state.error }),
            }
        )
    )
)
