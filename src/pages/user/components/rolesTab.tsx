import { Box, Button, Typography } from '@mui/material';
import { DeleteModal } from '../../../components';
import { useRoles } from '../hooks/useRoles';
import { RolesTable } from './rolesTable';
import { ModulosDialog } from './modulosDialog';
import { CreateRoleModal } from './createRoleModal';
import { useAuthStore } from '../../../store';

export const RolesTab = () => {
    const user = useAuthStore(state => state.user);
    const canManageModulos = user?.role === 'SUPER_ADMIN';

    const {
        rolesConModulos,
        createRoleModal,
        setCreateRoleModal,
        modulosDialog,
        setModulosDialog,
        selectedRol,
        confirmDeleteOpen,
        savingModulos,
        creatingRole,
        loadingRoles,
        formik,
        handleOpenModulos,
        handleSaveModulos,
        handleDeleteRole,
        onConfirmDeleteRole,
    } = useRoles();

    return (
        <Box>
            <Box sx={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                mx: 1, mb: 1, mt: 0.5,
            }}>
                <Typography sx={{ fontWeight: 700, fontSize: '14px', color: 'text.primary' }}>
                    Roles del sistema
                </Typography>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={() => setCreateRoleModal(true)}
                    sx={{
                        borderRadius: '10px', textTransform: 'none', fontWeight: 700,
                        bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                        fontSize: '13px',
                    }}
                >
                    Crear Rol
                </Button>
            </Box>

            <RolesTable
                rolesConModulos={rolesConModulos}
                onGestionarModulos={handleOpenModulos}
                onDeleteRole={handleDeleteRole}
                canManageModulos={canManageModulos}
                loading={loadingRoles}
            />

            <ModulosDialog
                open={modulosDialog}
                onClose={() => setModulosDialog(false)}
                rol={selectedRol}
                onSave={handleSaveModulos}
                saving={savingModulos}
            />

            <CreateRoleModal
                open={createRoleModal}
                onClose={() => setCreateRoleModal(false)}
                formik={formik}
                creating={creatingRole}
            />

            <DeleteModal
                title="¿Desea eliminar el rol?"
                content="Con esta acción borrará el rol de forma permanente. No es posible eliminar un rol que tenga usuarios asignados."
                open={confirmDeleteOpen}
                onClose={onConfirmDeleteRole}
            />
        </Box>
    );
};
