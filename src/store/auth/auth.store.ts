import { devtools, persist } from "zustand/middleware";
import { AuthService } from "../../services/auth.service";
import type { AuthStatus, User } from "../../interfaces";
import { StateCreator, create } from "zustand";

export interface AuthState {
    status: AuthStatus;
    token?: string;
    user?: User;
    error: boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    checkAuthStatus: () => void;
    logoutUser: () => void;
    getUser: () => any;
    setStateError: (status: boolean) => void;
    reNewSession: () => void;
}

const storeApi: StateCreator<AuthState> = (set, get) => ({
    status: 'pending',
    user: undefined,
    error: false,
    loginUser: async (email: string, password: string) => {
        try {
            const { token, user } = await AuthService.login(email, password);
            set({ status: 'authorized', token, user })
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined, error: true });
        }
    },
    checkAuthStatus: async () => {
        try {
            const { token } = await AuthService.checkStatus();
            set({ status: 'authorized', token });
        } catch (error) {
            set({ status: 'unauthorized', token: undefined, user: undefined });
        }
    },
    logoutUser: () => {
        set({ status: 'unauthorized', token: undefined, user: undefined });
    },
    getUser: () => {
        return get().user;
    },
    setStateError: (status) => {
        set({ error: status });
    },
    reNewSession: async () => {
        const id = get().user?.id;
        if (id) {
            try {
                const { token } = await AuthService.reNewSession(id);
                console.log(token)
                set({ status: 'authorized', token });
            } catch (error) {
                set({ status: 'unauthorized', token: undefined, user: undefined });
            }
        }

    }

})


export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi,
            { name: 'auth-store' }
        )
    )
)