import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';

export type ThemeVariant = 'calido' | 'claro' | 'oscuro';

export const THEME_TOKENS = {
    calido: {
        mode: 'light' as const,
        primary: '#0e9f8c',
        primaryDark: '#0b8275',
        brand: '#0f3a4f',
        brand2: '#0c2f40',
        brandink: '#eaf3f2',
        bg: '#f4eee4',
        surface: '#fffdf9',
        surface2: '#faf5ec',
        ink: '#221c15',
        muted: '#7c7264',
        border: '#e7ddcd',
        danger: '#d9583f',
        success: '#2f9e6f',
        warning: '#e0913f',
        info: '#2f6df6',
        shadow: '0 1px 2px rgba(40,28,14,.05), 0 10px 30px rgba(40,28,14,.06)',
        label: 'Cálido',
        swatch: 'linear-gradient(135deg,#0f3a4f,#0e9f8c)',
    },
    claro: {
        mode: 'light' as const,
        primary: '#4f46e5',
        primaryDark: '#4338ca',
        brand: '#16181d',
        brand2: '#101216',
        brandink: '#f6f6f7',
        bg: '#f5f6f7',
        surface: '#ffffff',
        surface2: '#f2f3f5',
        ink: '#15171c',
        muted: '#6b7280',
        border: '#e7e8ec',
        danger: '#dc2626',
        success: '#16a34a',
        warning: '#d97706',
        info: '#2563eb',
        shadow: '0 1px 2px rgba(15,17,20,.05), 0 10px 28px rgba(15,17,20,.06)',
        label: 'Claro',
        swatch: 'linear-gradient(135deg,#16181d,#4f46e5)',
    },
    oscuro: {
        mode: 'dark' as const,
        primary: '#19c3a6',
        primaryDark: '#14b8a6',
        brand: '#0a0d12',
        brand2: '#0a0d12',
        brandink: '#eef1f6',
        bg: '#0e1116',
        surface: '#161b24',
        surface2: '#1c222d',
        ink: '#eef1f6',
        muted: '#9aa4b2',
        border: '#262d39',
        danger: '#ff6b6b',
        success: '#3ddc97',
        warning: '#f0b65c',
        info: '#5b8cff',
        shadow: '0 1px 2px rgba(0,0,0,.4), 0 12px 32px rgba(0,0,0,.45)',
        label: 'Oscuro',
        swatch: 'linear-gradient(135deg,#0e1116,#19c3a6)',
    },
} as const;

interface ThemeState {
    theme: ThemeVariant;
    setTheme: (theme: ThemeVariant) => void;
}

export const useThemeStore = create<ThemeState>()(
    devtools(
        persist(
            (set) => ({
                theme: 'calido',
                setTheme: (theme) => set({ theme }),
            }),
            { name: 'theme-store' }
        )
    )
);
