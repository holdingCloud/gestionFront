import { useState } from 'react';
import { Box, Tabs, Tab } from '@mui/material';
import { CreateModal, DeleteModal, UrlBreadCrumbs } from '../../components';
import { useUser } from './hooks/useUser';
import { UserForm } from './components/userForm';
import { FilterUserForm } from './components/filterUserForm';
import { UserTable } from './components/userTable';
import { RolesTab } from './components/rolesTab';
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

const UserPage = () => {
    const [activeTab, setActiveTab] = useState(0);
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const {
        users,
        page,
        open,
        values,
        count,
        errors,
        touched,
        rowsPerPage,
        createModal,
        showPassword,
        hiddeButton,
        roles,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        saveUpdate,
        handleActive,
        handleUpdate,
        cancelUpdate,
        handleClickShowPassword,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onSetCreateModal,
        handleDelete,
        handleFilter,
        isSaving,
    } = useUser();

    return (
        <Box>
            <UrlBreadCrumbs />

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
                    <Tab label="Usuarios" />
                    <Tab label="Roles y Permisos" />
                </Tabs>
            </Box>

            <TabPanel value={activeTab} index={0}>
                <FilterUserForm
                    handleFilter={handleFilter}
                    onSetCreateModal={onSetCreateModal}
                />

                <UserTable
                    count={count}
                    page={page}
                    rowsPerPage={rowsPerPage}
                    handleChangePage={handleChangePage}
                    handleChangeRowsPerPage={handleChangeRowsPerPage}
                    users={users}
                    handleActive={handleActive}
                    handleUpdate={handleUpdate}
                    handleDelete={handleDelete}
                />

                <DeleteModal
                    title="¿Desea eliminar el usuario?"
                    content="Con esta acción borrará al usuario de forma permanente"
                    open={open}
                    onClose={onClose}
                />

                <CreateModal
                    title={hiddeButton ? 'Crear Usuario' : 'Editar Usuario'}
                    open={createModal}
                    onClose={onSetCreateModal}
                >
                    <UserForm
                        onSetCreateModal={onSetCreateModal}
                        handleSubmit={handleSubmit}
                        values={values}
                        touched={touched}
                        handleChange={handleChange}
                        handleBlur={handleBlur}
                        setFieldValue={setFieldValue}
                        errors={errors}
                        showPassword={showPassword}
                        hiddeButton={hiddeButton}
                        handleClickShowPassword={handleClickShowPassword}
                        saveUpdate={saveUpdate}
                        cancelUpdate={cancelUpdate}
                        roles={roles}
                        isSaving={isSaving}
                    />
                </CreateModal>
            </TabPanel>

            <TabPanel value={activeTab} index={1}>
                <RolesTab />
            </TabPanel>
        </Box>
    );
};

export default UserPage;
