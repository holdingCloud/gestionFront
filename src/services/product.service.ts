import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";
import { ProductResponse, ProductBody, pagination, CreateProductResponse } from "../interfaces";


export class ProductService {


    static getProducts = async ({ skip, take }: pagination): Promise<ProductResponse> => {

        const queryParams = {
            skip,
            take,
            name: ""
        }

        try {
            const { data } = await gestionApi.get<ProductResponse>(`/product`, {
                params: queryParams
            });

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