import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useUserStore } from '../../../store';
import { RolConModulos, ModuloType, RoleBody } from '../../../interfaces';

export const useRoles = () => {
    const rolesConModulos = useUserStore(state => state.rolesConModulos);
    const getRolesConModulos = useUserStore(state => state.getRolesConModulos);
    const createRole = useUserStore(state => state.createRole);
    const deleteRole = useUserStore(state => state.deleteRole);
    const replaceRolModulos = useUserStore(state => state.replaceRolModulos);

    const { enqueueSnackbar } = useSnackbar();

    const [createRoleModal, setCreateRoleModal] = useState(false);
    const [modulosDialog, setModulosDialog] = useState(false);
    const [selectedRol, setSelectedRol] = useState<RolConModulos | null>(null);
    const [deleteRoleId, setDeleteRoleId] = useState<number | null>(null);
    const [confirmDeleteOpen, setConfirmDeleteOpen] = useState(false);
    const [savingModulos, setSavingModulos] = useState(false);
    const [creatingRole, setCreatingRole] = useState(false);
    const [loadingRoles, setLoadingRoles] = useState(false);

    const formik = useFormik<{ type: string }>({
        initialValues: { type: '' },
        validationSchema: Yup.object({
            type: Yup.string().trim().required('Requerido').max(50, 'Máximo 50 caracteres'),
        }),
        onSubmit: async ({ type }, { resetForm }) => {
            setCreatingRole(true);
            try {
                await createRole({ type: type.trim().toUpperCase() } as RoleBody);
                await getRolesConModulos();
                enqueueSnackbar('Rol creado exitosamente', { variant: 'success' });
                resetForm();
                setCreateRoleModal(false);
            } catch (e: unknown) {
                const msg = e instanceof Error ? e.message : 'Error al crear rol';
                enqueueSnackbar(msg, { variant: 'error' });
            } finally {
                setCreatingRole(false);
            }
        },
    });

    const handleOpenModulos = (rol: RolConModulos) => {
        setSelectedRol(rol);
        setModulosDialog(true);
    };

    const handleSaveModulos = async (modulos: ModuloType[]) => {
        if (!selectedRol) return;
        setSavingModulos(true);
        try {
            await replaceRolModulos(selectedRol.id, modulos);
            enqueueSnackbar('Módulos actualizados exitosamente', { variant: 'success' });
            setModulosDialog(false);
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Error al guardar módulos';
            enqueueSnackbar(msg, { variant: 'error' });
        } finally {
            setSavingModulos(false);
        }
    };

    const handleDeleteRole = (id: number) => {
        setDeleteRoleId(id);
        setConfirmDeleteOpen(true);
    };

    const onConfirmDeleteRole = async (action: boolean) => {
        setConfirmDeleteOpen(false);
        if (!action || !deleteRoleId) return;
        try {
            await deleteRole(deleteRoleId);
            enqueueSnackbar('Rol eliminado exitosamente', { variant: 'success' });
        } catch (e: unknown) {
            const msg = e instanceof Error ? e.message : 'Error al eliminar rol';
            enqueueSnackbar(msg, { variant: 'error' });
        }
        setDeleteRoleId(null);
    };

    useEffect(() => {
        setLoadingRoles(true);
        getRolesConModulos().finally(() => setLoadingRoles(false));
    }, []);

    return {
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
    };
};
