import { Box, Skeleton, Typography } from '@mui/material';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

interface StatCardProps {
    label: string;
    value: number;
    iconPath: string;
    iconBg: string;
    iconColor: string;
}

const StatCard = ({ label, value, iconPath, iconBg, iconColor }: StatCardProps) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    return (
        <Box sx={{
            bgcolor: 'background.paper',
            border: `1px solid ${t.border}`,
            borderRadius: '18px',
            padding: '20px',
            boxShadow: t.shadow,
        }}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: '14px' }}>
                <Box sx={{
                    width: 42, height: 42, borderRadius: '12px',
                    background: iconBg,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: iconColor,
                }}>
                    <svg width="21" height="21" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">
                        <path d={iconPath} />
                    </svg>
                </Box>
            </Box>
            <Typography sx={{
                fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                fontWeight: 700, fontSize: '30px', color: 'text.primary',
                letterSpacing: '-0.5px', lineHeight: 1,
            }}>
                {value}
            </Typography>
            <Typography sx={{ fontSize: '13px', color: 'text.secondary', mt: '6px' }}>
                {label}
            </Typography>
        </Box>
    );
};

interface ClientStatCardsProps {
    total: number;
    porLlamar: number;
    vencidos: number;
    contactados: number;
    loading?: boolean;
}

export const ClientStatCards = ({ total, porLlamar, vencidos, contactados, loading }: ClientStatCardsProps) => {
    if (loading) {
        return (
            <>
                {[0, 1, 2, 3].map(i => (
                    <Skeleton key={i} variant="rounded" height={120} sx={{ borderRadius: '18px' }} />
                ))}
            </>
        );
    }

    return (
        <>
            <StatCard
                label="Total clientes"
                value={total}
                iconPath="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8 M22 21v-2a4 4 0 0 0-3-3.87 M16 3.13a4 4 0 0 1 0 7.75"
                iconBg="rgba(14,159,140,.13)"
                iconColor="#0e9f8c"
            />
            <StatCard
                label="Por llamar"
                value={porLlamar}
                iconPath="M22 16.92v3a2 2 0 0 1-2.18 2 19.8 19.8 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.8 19.8 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"
                iconBg="rgba(224,145,63,.14)"
                iconColor="#e0913f"
            />
            <StatCard
                label="Vencidos"
                value={vencidos}
                iconPath="M12 9v4 M12 17h.01 M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                iconBg="rgba(217,88,63,.12)"
                iconColor="#d9583f"
            />
            <StatCard
                label="Contactados"
                value={contactados}
                iconPath="M22 11.1V12a10 10 0 1 1-5.9-9.1 M22 4 12 14.1l-3-3"
                iconBg="rgba(47,158,111,.13)"
                iconColor="#2f9e6f"
            />
        </>
    );
};
