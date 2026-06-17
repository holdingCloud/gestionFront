import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";

export interface Region {
    id: number;
    name: string;
}

export interface Commune {
    id: number;
    name: string;
    regionId: number;
}

export class LocationService {
    static getRegions = async (): Promise<Region[]> => {
        try {
            const { data } = await gestionApi.get<Region[]>('/regions');
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data ?? "Error al obtener regiones.");
            throw new Error("Error inesperado al obtener regiones.");
        }
    }

    static getCommunesByRegion = async (regionId: number): Promise<Commune[]> => {
        try {
            const { data } = await gestionApi.get<Commune[]>(`/regions/${regionId}/communes`);
            return data;
        } catch (error: unknown) {
            if (error instanceof AxiosError) throw new Error(error.response?.data ?? "Error al obtener comunas.");
            throw new Error("Error inesperado al obtener comunas.");
        }
    }
}
