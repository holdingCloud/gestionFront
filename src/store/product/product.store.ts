import { devtools } from "zustand/middleware";

import { StateCreator, create } from "zustand";
import { ProductBody, Products, Users, userBody } from "../../interfaces";
import { immer } from "zustand/middleware/immer";
import { ProductService } from "../../services/product.service";

export interface ProductState {
    products: Products[];
    count: number;
    getProducts: (skip: number, take: number) => Promise<void>;
    createProduct: (product: ProductBody) => Promise<void>;
    deleteProduct: (id: number) => void;
    updateProduct: (user: Users) => void;

}

const storeApi: StateCreator<ProductState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    products: [],
    count: 0,
    getProducts: async (skip, take) => {
        try {
            const { products, count } = await ProductService.getProducts({ skip, take });
            set({ products, count });
        } catch (error) {
            set({ products: undefined, count: 0 })

        }
    },
    createProduct: async (product) => {
        try {
            const { payload } = await ProductService.createProduct(product);

            set(state => ({
                products: [payload, ...state.products],
                count: state.count + 1
            }));
        } catch (error) {
            console.log(error);
        }
    },
    deleteProduct: async (id) => {
        try {
            // const { success } = await UserService.deleleUser(id);
            //
            // if (success) {
            //     set(state => ({
            //         users: state.users.filter(user => user.id != id)
            //     }));
            // }
        } catch (error) {
            console.log(error);
        }
    },
    updateProduct: async (userData) => {

        //  const { id, ...user } = userData;

        try {

        } catch (error) {
            console.log(error)
        }
    }
})


export const useProductStore = create<ProductState>()(
    devtools(
        immer(
            storeApi
        )
    )
)