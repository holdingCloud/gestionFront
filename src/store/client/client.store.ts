import { devtools, persist } from "zustand/middleware";
import { ClientService } from "../../services";
import type { Client, ClientBody, ClientResponse } from "../../interfaces";
import { StateCreator, create } from "zustand";

export interface ClientState {
    clients: Client[];
    count: number;
    error: boolean;
    loading: boolean;
    porLlamarCount: number;
    getClients: () => Promise<void>;
    createClient: (client: ClientBody) => Promise<void>;
    updateClient: (client: ClientResponse) => Promise<void>;
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
    getClients: async () => {
        set({ loading: true });
        try {
            const { data, total } = await ClientService.getClients();
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
            await get().getClients();
        } catch (error) {
            console.log(error);
        }
    },
    updateClient: async (clientData) => {
        const { id, createdAt, updatedAt, contactStatus, frequencies, clientProductFrequencies, commune, company, available, ...body } = clientData as any;
        try {
            await ClientService.updateClient(id, body);
            await get().getClients();
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
                const { createdAt, updatedAt, contactStatus, frequencies, clientProductFrequencies, commune, company, available, id: _id, ...body } = client as any;
                await ClientService.updateClient(id, { ...body, available: status });
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
