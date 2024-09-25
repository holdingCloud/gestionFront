import { AxiosError } from "axios";
import { gestionApi } from "../api/gestion.api";


///api/upload/single/products

export class UploadService {


    static uploadImage = async (type: string, myFile: any) => {


        try {

            const formData = new FormData();
            formData.append('file', myFile)

            const { data } = await gestionApi.post<{ fileName: string }>(`/upload/single/${type}`, formData);

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