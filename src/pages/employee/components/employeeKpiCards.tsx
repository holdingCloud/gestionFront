import { Box, Typography, Skeleton } from "@mui/material";
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import DescriptionOutlinedIcon from '@mui/icons-material/DescriptionOutlined';
import EventBusyOutlinedIcon from '@mui/icons-material/EventBusyOutlined';
import AccountBalanceWalletOutlinedIcon from '@mui/icons-material/AccountBalanceWalletOutlined';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

interface KpiCardProps {
    label: string;
    value: string | number;
    IconComponent: React.ElementType;
    iconColor: string;
    loading: boolean;
    t: (typeof THEME_TOKENS)[keyof typeof THEME_TOKENS];
}

const KpiCard = ({ label, value, IconComponent, iconColor, loading, t }: KpiCardProps) => (
    <Box sx={{
        bgcolor: 'background.paper',
        borderRadius: '16px',
        border: `1px solid ${t.border}`,
        boxShadow: t.shadow,
        p: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        gap: '14px',
    }}>
        <Box sx={{
            width: 44, height: 44, borderRadius: '12px',
            bgcolor: `${iconColor}1a`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
        }}>
            <IconComponent sx={{ fontSize: 22, color: iconColor }} />
        </Box>
        <Box>
            <Typography sx={{
                fontSize: '11.5px', fontWeight: 600, color: t.muted,
                textTransform: 'uppercase', letterSpacing: '0.5px', mb: '2px',
            }}>
                {label}
            </Typography>
            {loading ? (
                <Skeleton width={60} height={28} />
            ) : (
                <Typography sx={{ fontSize: '22px', fontWeight: 800, color: t.ink, lineHeight: 1.2 }}>
                    {value}
                </Typography>
            )}
        </Box>
    </Box>
);

interface Props {
    totalActivos: number;
    contratosVigentes: number;
    ausencias: number;
    costoLiquido: number;
    loading: boolean;
}

export const EmployeeKpiCards = ({ totalActivos, contratosVigentes, ausencias, costoLiquido, loading }: Props) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const fmtCurrency = (n: number) => `$${n.toLocaleString('es-CL')}`;

    return (
        <>
            <KpiCard
                label="Dotación activa"
                value={totalActivos}
                IconComponent={PeopleAltOutlinedIcon}
                iconColor={t.primary}
                loading={loading}
                t={t}
            />
            <KpiCard
                label="Contratos vigentes"
                value={contratosVigentes}
                IconComponent={DescriptionOutlinedIcon}
                iconColor={t.info}
                loading={loading}
                t={t}
            />
            <KpiCard
                label="Ausencias del mes"
                value={ausencias}
                IconComponent={EventBusyOutlinedIcon}
                iconColor={t.warning}
                loading={loading}
                t={t}
            />
            <KpiCard
                label="Costo líquido mes"
                value={fmtCurrency(costoLiquido)}
                IconComponent={AccountBalanceWalletOutlinedIcon}
                iconColor={t.success}
                loading={loading}
                t={t}
            />
        </>
    );
};
