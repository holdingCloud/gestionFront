import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

interface ThemeState {
    primaryColor: string;
    mode: 'light' | 'dark';
    setPrimaryColor: (color: string) => void;
    setMode: (mode: 'light' | 'dark') => void;
}

export const useThemeStore = create<ThemeState>()(
    devtools(
        persist(
            (set) => ({
                primaryColor: '#1d2b75',
                mode: 'light',
                setPrimaryColor: (color) => set({ primaryColor: color }),
                setMode: (mode) => set({ mode }),
            }),
            { name: 'theme-store' }
        )
    )
);
