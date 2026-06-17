import { Grid, Paper, Typography, Box } from "@mui/material"
import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import PhoneOutlinedIcon from '@mui/icons-material/PhoneOutlined';
import WarningAmberOutlinedIcon from '@mui/icons-material/WarningAmberOutlined';
import CheckCircleOutlinedIcon from '@mui/icons-material/CheckCircleOutlined';

interface StatCardProps {
    label: string;
    value: number;
    icon: React.ReactNode;
    valueColor: string;
}

const StatCard = ({ label, value, icon, valueColor }: StatCardProps) => (
    <Grid item={true} xs={12} sm={6} md={3}>
        <Paper
            sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                padding: 2,
                borderRadius: 3,
                boxShadow: 10,
            }}
        >
            <Box sx={{ color: valueColor, display: "flex", alignItems: "center" }}>
                {icon}
            </Box>
            <Box>
                <Typography variant="body2" color="text.secondary" sx={{ fontWeight: 600, letterSpacing: 1, fontSize: 11 }}>
                    {label}
                </Typography>
                <Typography variant="h4" sx={{ color: valueColor, fontWeight: 700 }}>
                    {value}
                </Typography>
            </Box>
        </Paper>
    </Grid>
);

interface ClientStatCardsProps {
    total: number;
    porLlamar: number;
    vencidos: number;
    contactados: number;
}

export const ClientStatCards = ({ total, porLlamar, vencidos, contactados }: ClientStatCardsProps) => (
    <>
        <StatCard label="TOTAL" value={total} valueColor="text.primary" icon={<PeopleAltOutlinedIcon sx={{ fontSize: 40 }} />} />
        <StatCard label="POR LLAMAR" value={porLlamar} valueColor="#ed6c02" icon={<PhoneOutlinedIcon sx={{ fontSize: 40, color: '#ed6c02' }} />} />
        <StatCard label="VENCIDOS" value={vencidos} valueColor="#d32f2f" icon={<WarningAmberOutlinedIcon sx={{ fontSize: 40, color: '#d32f2f' }} />} />
        <StatCard label="CONTACTADOS" value={contactados} valueColor="#2e7d32" icon={<CheckCircleOutlinedIcon sx={{ fontSize: 40, color: '#2e7d32' }} />} />
    </>
);
