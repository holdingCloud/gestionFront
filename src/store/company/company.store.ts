import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { StateCreator, create } from "zustand";
import { Company, CompanyBody } from "../../interfaces/company.interface";
import { CompanyService } from "../../services/company.service";

export interface CompanyState {
    companies: Company[];
    loading: boolean;
    getCompanies: () => Promise<void>;
    createCompany: (body: CompanyBody) => Promise<void>;
    updateCompany: (id: number, body: Partial<CompanyBody>) => Promise<void>;
    deleteCompany: (id: number) => Promise<void>;
}

const storeApi: StateCreator<CompanyState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    companies: [],
    loading: false,
    getCompanies: async () => {
        set({ loading: true });
        try {
            const data = await CompanyService.getCompanies();
            set({ companies: data });
        } catch {
            set({ companies: [] });
        } finally {
            set({ loading: false });
        }
    },
    createCompany: async (body) => {
        try {
            const created = await CompanyService.createCompany(body);
            set(state => { state.companies = [created, ...state.companies]; });
        } catch (error) {
            console.log(error);
        }
    },
    updateCompany: async (id, body) => {
        try {
            const updated = await CompanyService.updateCompany(id, body);
            set(state => {
                const idx = state.companies.findIndex(c => c.id === id);
                if (idx !== -1) state.companies[idx] = updated;
            });
        } catch (error) {
            console.log(error);
        }
    },
    deleteCompany: async (id) => {
        try {
            await CompanyService.deleteCompany(id);
            set(state => { state.companies = state.companies.filter(c => c.id !== id); });
        } catch (error) {
            console.log(error);
        }
    },
});

export const useCompanyStore = create<CompanyState>()(
    devtools(
        immer(storeApi)
    )
);
