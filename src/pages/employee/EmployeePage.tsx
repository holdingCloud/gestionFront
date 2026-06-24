import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { CreateModal, DeleteModal, UrlBreadCrumbs } from '../../components';
import { useEmployee } from './hooks/useEmployee';
import { EmployeeForm } from './components/employeeForm';
import { FilterEmployeeForm } from './components/filterEmployeeForm';
import { EmployeeTable } from './components/employeeTable';
import { EmployeeKpiCards } from './components/employeeKpiCards';
import { EmpleadoFichaDrawer } from './components/empleadoFichaDrawer';
import { LiquidacionDrawer } from './components/liquidacionDrawer';
import { LiquidacionesModule } from './components/liquidacionesModule';
import { LibroRemuneraciones } from './components/libroRemuneraciones';
import { AsistenteRRHH } from './components/asistenteRRHH';
import { Employees } from '../../interfaces/employee.interface';
import { useThemeStore, THEME_TOKENS } from '../../store/theme/theme.store';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

const TabPanel = ({ children, value, index }: TabPanelProps) => (
    <div role="tabpanel" hidden={value !== index}>
        {value === index && <Box>{children}</Box>}
    </div>
);

const EmployeePage = () => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [activeTab, setActiveTab] = useState(0);
    const [fichaOpen, setFichaOpen] = useState(false);
    const [fichaEmployee, setFichaEmployee] = useState<Employees | null>(null);
    const [liqDrawerOpen, setLiqDrawerOpen] = useState(false);
    const [liqEmployee, setLiqEmployee] = useState<Employees | null>(null);
    const [asistenteOpen, setAsistenteOpen] = useState(false);

    const {
        employees,
        page,
        open,
        count,
        rowsPerPage,
        values,
        errors,
        touched,
        hiddeButton,
        loading,
        updatedId,
        saveUpdate,
        cancelUpdate,
        createModal,
        handleSubmit,
        handleBlur,
        handleChange,
        handleFilter,
        handleChangePage,
        handleChangeRowsPerPage,
        handleUpdate,
        handleActive,
        handleDelete,
        onSetCreateModal,
        setFieldValue,
        onClose,
    } = useEmployee();

    const handleViewFicha = (emp: Employees) => {
        setFichaEmployee(emp);
        setFichaOpen(true);
    };

    const handleEditFromFicha = () => {
        if (!fichaEmployee) return;
        setFichaOpen(false);
        handleUpdate(fichaEmployee);
    };

    const handleVerLiquidacion = (emp: Employees) => {
        setLiqEmployee(emp);
        setLiqDrawerOpen(true);
    };

    const safeEmployees = employees ?? [];
    const totalActivos = safeEmployees.filter(e => e.available).length;
    const costoLiquido = safeEmployees.reduce((acc, e) => {
        const base = e.salary ?? 0;
        const gratif = Math.round(Math.min(base * 0.25, 81674));
        const bono = 50000 + 80000 + 50000;
        const totalHaberes = base + gratif + bono;
        const descuentos = Math.round(base * 0.176);
        return acc + (totalHaberes - descuentos);
    }, 0);

    return (
        <Box>
            <UrlBreadCrumbs />

            {/* Module tabs */}
            <Box sx={{
                mx: 1, mb: 1,
                bgcolor: 'background.paper',
                borderRadius: '18px',
                border: `1px solid ${t.border}`,
                boxShadow: t.shadow,
                overflow: 'hidden',
            }}>
                <Tabs
                    value={activeTab}
                    onChange={(_, v) => setActiveTab(v)}
                    sx={{
                        px: 2,
                        '& .MuiTab-root': {
                            fontWeight: 700, fontSize: '13px',
                            textTransform: 'none', minHeight: 48,
                        },
                        '& .MuiTabs-indicator': { bgcolor: t.primary },
                        '& .Mui-selected': { color: `${t.primary} !important` },
                    }}
                >
                    <Tab label="Empleados" />
                    <Tab label="Liquidaciones" />
                    <Tab label="Libro Remuneraciones" />
                </Tabs>
            </Box>

            {/* Tab 0: Empleados list */}
            <TabPanel value={activeTab} index={0}>
                {/* KPI cards */}
                <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(4, 1fr)',
                    gap: '14px',
                    px: '8px', pt: '8px', pb: '14px',
                }}>
                    <EmployeeKpiCards
                        totalActivos={totalActivos}
                        contratosVigentes={totalActivos}
                        ausencias={0}
                        costoLiquido={costoLiquido}
                        loading={loading}
                    />
                </Box>

                {/* Filter bar */}
                <FilterEmployeeForm
                    handleFilter={handleFilter}
                    onSetCreateModal={onSetCreateModal}
                />

                {/* Asistente RRHH button */}
                <Box sx={{ px: '8px', pb: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                    <Box
                        onClick={() => setAsistenteOpen(true)}
                        sx={{
                            display: 'inline-flex', alignItems: 'center', gap: '6px',
                            px: '14px', py: '7px', borderRadius: '10px',
                            background: `linear-gradient(135deg,${t.primary},${t.brand})`,
                            color: '#fff', fontWeight: 700, fontSize: '13px',
                            cursor: 'pointer', userSelect: 'none',
                            boxShadow: `0 4px 14px ${t.primary}44`,
                            transition: 'opacity .15s', '&:hover': { opacity: 0.9 },
                        }}
                    >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                            <line x1="12" y1="17" x2="12.01" y2="17" />
                        </svg>
                        Asistente RRHH
                    </Box>
                </Box>

                {/* Table */}
                <EmployeeTable
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    data={safeEmployees}
                    loading={loading}
                    updatedId={updatedId}
                    handleActive={handleActive}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                    onViewFicha={handleViewFicha}
                />

                {/* Modals */}
                <DeleteModal
                    title="¿Desea eliminar al empleado?"
                    content="Con esta acción borrará al empleado de forma permanente"
                    open={open}
                    onClose={onClose}
                />

                <CreateModal
                    title={hiddeButton ? 'Crear Empleado' : 'Editar Empleado'}
                    open={createModal}
                    onClose={onSetCreateModal}
                >
                    <EmployeeForm
                        onSetCreateModal={onSetCreateModal}
                        handleSubmit={handleSubmit}
                        values={values}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        errors={errors}
                        hiddeButton={hiddeButton}
                        saveUpdate={saveUpdate}
                        cancelUpdate={cancelUpdate}
                        setFieldValue={setFieldValue}
                    />
                </CreateModal>
            </TabPanel>

            {/* Tab 1: Liquidaciones */}
            <TabPanel value={activeTab} index={1}>
                <LiquidacionesModule
                    employees={safeEmployees}
                    loading={loading}
                    onVerLiquidacion={handleVerLiquidacion}
                />
            </TabPanel>

            {/* Tab 2: Libro Remuneraciones */}
            <TabPanel value={activeTab} index={2}>
                <LibroRemuneraciones
                    employees={safeEmployees}
                    loading={loading}
                />
            </TabPanel>

            {/* Ficha drawer */}
            <EmpleadoFichaDrawer
                open={fichaOpen}
                onClose={() => setFichaOpen(false)}
                employee={fichaEmployee}
                onEdit={handleEditFromFicha}
            />

            {/* Liquidación drawer */}
            <LiquidacionDrawer
                open={liqDrawerOpen}
                onClose={() => setLiqDrawerOpen(false)}
                employee={liqEmployee}
            />

            {/* Asistente RRHH */}
            <AsistenteRRHH
                open={asistenteOpen}
                onClose={() => setAsistenteOpen(false)}
            />
        </Box>
    );
};

export default EmployeePage;
