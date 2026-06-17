import { Box, Tab, Tabs } from '@mui/material';
import { UrlBreadCrumbs } from '../../components';
import { useReports } from './hooks/useReports';
import { SalesEvolutionReport } from './components/SalesEvolutionReport';
import { SalesByProductReport } from './components/SalesByProductReport';
import { ClientPurchasesReport } from './components/ClientPurchasesReport';
import { InactiveClientsReport } from './components/InactiveClientsReport';
import { TopClientsReport } from './components/TopClientsReport';
import { AvgFrequencyReport } from './components/AvgFrequencyReport';

const tabs = [
    { label: 'Evolución de Ventas', component: <SalesEvolutionReport /> },
    { label: 'Ventas por Producto', component: <SalesByProductReport /> },
    { label: 'Compras por Cliente', component: <ClientPurchasesReport /> },
    { label: 'Clientes Inactivos', component: <InactiveClientsReport /> },
    { label: 'Top Clientes', component: <TopClientsReport /> },
    { label: 'Frecuencia Promedio', component: <AvgFrequencyReport /> },
];

export const ReportsPage = () => {
    const { activeTab, handleTabChange } = useReports();

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <UrlBreadCrumbs />

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="scrollable"
                    scrollButtons="auto"
                >
                    {tabs.map((tab, i) => (
                        <Tab key={i} label={tab.label} />
                    ))}
                </Tabs>
            </Box>

            <Box
                sx={{
                    bgcolor: 'background.paper',
                    borderRadius: 2,
                    boxShadow: 3,
                    p: 3,
                }}
            >
                {tabs[activeTab]?.component}
            </Box>
        </Box>
    );
};

export default ReportsPage;
