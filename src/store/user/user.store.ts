import { devtools } from "zustand/middleware";
import { UserService } from "../../services/user.service";
import { StateCreator, create } from "zustand";
import { Users, userBody } from "../../interfaces";
import { immer } from "zustand/middleware/immer";

export interface UserState {
    users: Users[];
    count: number;
    getUsers: (skip: number, take: number, { }: any) => Promise<void>;
    createUser: (user: userBody) => Promise<void>;
    deleteUser: (id: number) => void;
    changeStatus: (id: number, status: boolean) => void;
    updateUser: (user: Users) => void;

}

const storeApi: StateCreator<UserState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set) => ({
    users: [],
    count: 0,
    getUsers: async (skip, take, filter) => {
        try {
            const { users, count } = await UserService.getUsers({ skip, take }, filter);
            set({ users, count });
        } catch (error) {
            set({ users: undefined, count: 0 })

        }
    },
    createUser: async (user) => {
        try {
            const data = await UserService.createrUser(user);
            set(state => ({
                users: [data, ...state.users],
                count: state.count + 1
            }));
        } catch (error) {
            console.log(error);
        }
    },
    deleteUser: async (id) => {
        try {
            const { success } = await UserService.deleleUser(id);

            if (success) {
                set(state => ({
                    users: state.users.filter(user => user.id != id)
                }));
            }
        } catch (error) {
            console.log(error);
        }
    },
    changeStatus: async (id, status) => {


        try {
            const data = await UserService.changeStatus(id, status);

            console.log(data);
        } catch (error) {
            console.log(error)
        }

    },
    updateUser: async (userData) => {

        const { id, ...user } = userData;

        try {
            const data = await UserService.updateUser(id, user);

            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
})


export const useUserStore = create<UserState>()(
    devtools(
        immer(
            storeApi
        )
    )
)