import { devtools, persist } from "zustand/middleware";
import { AuthService } from "../../services/auth.service";
import type { AuthStatus, User } from "../../interfaces";
import { StateCreator, create } from "zustand";

export interface AuthState {
    status: AuthStatus;
    accessToken?: string;
    refreshToken?: string;
    user?: User;
    error: boolean;
    loginUser: (email: string, password: string) => Promise<void>;
    checkAuthStatus: () => void;
    logoutUser: () => void;
    getUser: () => any;
    setStateError: (status: boolean) => void;
}

const storeApi: StateCreator<AuthState> = (set, get) => ({
    status: 'pending',
    user: undefined,
    error: false,
    loginUser: async (email: string, password: string) => {
        try {
            const { accessToken, refreshToken, user } = await AuthService.login(email, password);
            set({ status: 'authorized', accessToken, refreshToken, user });
        } catch (error) {
            set({ status: 'unauthorized', accessToken: undefined, refreshToken: undefined, user: undefined, error: true });
        }
    },
    checkAuthStatus: async () => {
        try {
            const { accessToken, refreshToken } = await AuthService.checkStatus();
            set({ status: 'authorized', accessToken, refreshToken });
        } catch (error) {
            set({ status: 'unauthorized', accessToken: undefined, refreshToken: undefined, user: undefined });
        }
    },
    logoutUser: () => {
        const { accessToken, refreshToken } = get();
        // Notifica al backend en segundo plano (borra la sesión Redis → isLoged=false).
        // No se hace await para que la UI navegue al login al instante.
        if (accessToken) AuthService.logout(accessToken, refreshToken);
        set({ status: 'unauthorized', accessToken: undefined, refreshToken: undefined, user: undefined });
    },
    getUser: () => {
        return get().user;
    },
    setStateError: (status) => {
        set({ error: status });
    },
})


export const useAuthStore = create<AuthState>()(
    devtools(
        persist(
            storeApi,
            { name: 'auth-store' }
        )
    )
)