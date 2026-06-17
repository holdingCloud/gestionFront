import { devtools } from "zustand/middleware";
import { UserService } from "../../services/user.service";
import { StateCreator, create } from "zustand";
import { Users, UserBody, UserFilter } from "../../interfaces";

export interface UserState {
    users: Users[];
    count: number;
    getUsers: (page: number, limit: number, filter: UserFilter) => Promise<void>;
    createUser: (user: UserBody) => Promise<void>;
    deleteUser: (id: number) => Promise<void>;
    changeStatus: (id: number, status: boolean) => Promise<void>;
    updateUser: (id: number, user: Partial<UserBody>) => Promise<void>;
}

const storeApi: StateCreator<UserState, [["zustand/devtools", never]]> = (set) => ({
    users: [],
    count: 0,
    getUsers: async (page, limit, filter) => {
        try {
            const { data, total } = await UserService.getUsers({ page: page + 1, limit }, filter);
            set({ users: data, count: total });
        } catch {
            set({ users: [], count: 0 });
        }
    },
    createUser: async (user) => {
        try {
            await UserService.createUser(user);
        } catch (error) {
            console.log(error);
        }
    },
    deleteUser: async (id) => {
        try {
            await UserService.deleteUser(id);
            set(state => ({
                users: state.users.filter(u => u.id !== id),
                count: state.count - 1,
            }));
        } catch (error) {
            console.log(error);
        }
    },
    changeStatus: async (id, status) => {
        try {
            await UserService.changeStatus(id, status);
            set(state => ({
                users: state.users.map(u => u.id === id ? { ...u, isActive: status } : u),
            }));
        } catch (error) {
            console.log(error);
        }
    },
    updateUser: async (id, user) => {
        try {
            await UserService.updateUser(id, user);
        } catch (error) {
            console.log(error);
        }
    },
});

export const useUserStore = create<UserState>()(
    devtools(storeApi)
);
