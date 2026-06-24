import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { ProductResponse, ProductBody, pagination, CreateProductResponse } from "../interfaces";


export class ProductService {


    static getProducts = async ({ page, limit, name }: pagination & { name?: string }): Promise<ProductResponse> => {

        const queryParams: Record<string, unknown> = { page, limit };
        if (name) queryParams.name = name;

        try {
            const { data } = await gestionApi.get<ProductResponse>(`/product`, {
                params: queryParams
            });

            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                const msg = typeof error.response?.data === 'string'
                    ? error.response.data
                    : (error.response?.data?.message ?? 'Error al obtener productos');
                throw new Error(msg);
            }
            throw new Error('Error inesperado al obtener productos');
        }
    }

    static createProduct = async (body: ProductBody) => {


        try {

            const { data } = await gestionApi.post<CreateProductResponse>(`/product`, body);

            return data;
        } catch (error) {
            if (error instanceof AxiosError) {
                console.log(error.response?.data);
                throw new Error(error.response?.data);
            }
            console.log(error);
            throw new Error('Unable to product service');
        }


    }

}