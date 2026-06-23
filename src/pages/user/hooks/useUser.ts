import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useUserStore } from "../../../store";
import { UserFilter } from "../../../interfaces";

export const useUser = () => {

    const users = useUserStore(state => state.users);
    const count = useUserStore(state => state.count);
    const roles = useUserStore(state => state.roles);
    const getUsers = useUserStore(state => state.getUsers);
    const getRoles = useUserStore(state => state.getRoles);
    const createUser = useUserStore(state => state.createUser);
    const deleteUser = useUserStore(state => state.deleteUser);
    const changeStatus = useUserStore(state => state.changeStatus);
    const updateUser = useUserStore(state => state.updateUser);

    const { enqueueSnackbar } = useSnackbar();

    const [showPassword, setShowPassword] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [filter, setFilter] = useState<UserFilter>({ fullName: '', email: '' });

    const handleClickShowPassword = () => setShowPassword(prev => !prev);

    const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    };

    const onSetCreateModal = (action: boolean) => {
        setCreateModal(action);
    };

    const handleUpdate = (data: any) => {
        setHiddeButton(false);
        setCreateModal(true);
        setDeleteId(data.id);
        const matchedRole = roles.find(r => r.type === data.rol);
        setValues({
            fullName: data.fullName ?? '',
            email: data.email ?? '',
            imagen: data.imagen ?? '',
            password: '',
            passwordConfirmation: '',
            rol: matchedRole?.id ?? '',
        });
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    };

    const saveUpdate = async () => {
        const payload: any = {
            fullName: values.fullName,
            email: values.email,
            imagen: values.imagen,
            rol: Number(values.rol),
        };
        if (values.password) payload.password = values.password;

        await updateUser(deleteId, payload);
        await getUsers(page, rowsPerPage, filter);
        enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
        resetForm();
    };

    const onClose = async (action: boolean) => {
        setOpen(false);
        if (action) {
            await deleteUser(deleteId);
            enqueueSnackbar('Usuario eliminado exitosamente', { variant: 'success' });
        }
    };

    const handleActive = async (id: number, status: boolean) => {
        await changeStatus(id, status);
        enqueueSnackbar('Estado del usuario actualizado exitosamente', { variant: 'success' });
    };

    const handleFilter = (fullName: string, email: string) => {
        const newFilter = { fullName, email };
        setFilter(newFilter);
        setPage(0);
    };

    const {
        handleSubmit,
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        setValues,
        resetForm,
        setFieldValue,
    } = useFormik({
        initialValues: {
            fullName: '',
            email: '',
            imagen: '',
            password: '',
            passwordConfirmation: '',
            rol: '' as any,
        },
        onSubmit: async ({ fullName, email, imagen, password, rol }, { resetForm }) => {
            await createUser({ fullName, email, imagen, password, rol: Number(rol) });
            await getUsers(0, rowsPerPage, filter);
            setPage(0);
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            fullName: Yup.string().min(3, 'Mínimo 3 caracteres').max(200, 'Máximo 200 caracteres').required('Requerido'),
            email: Yup.string().email('Debe ser un email válido').required('Requerido'),
            imagen: Yup.string().required('Requerido'),
            password: Yup.string()
                .required('Requerido')
                .min(9, 'Mínimo 9 caracteres')
                .max(30, 'Máximo 30 caracteres')
                .test('letras', 'Debe contener al menos 4 letras', v => (v?.match(/[a-zA-Z]/g) ?? []).length >= 4)
                .test('numeros', 'Debe contener al menos 4 números', v => (v?.match(/[0-9]/g) ?? []).length >= 4)
                .test('simbolo', 'Debe contener al menos 1 símbolo (!@#$%^&*...)', v => /[^a-zA-Z0-9]/.test(v ?? '')),
            passwordConfirmation: Yup.string()
                .oneOf([Yup.ref('password')], 'Las contraseñas no coinciden')
                .required('Requerido'),
            rol: Yup.number().required('Requerido').typeError('Selecciona un rol'),
        }),
    });

    useEffect(() => {
        getUsers(page, rowsPerPage, filter);
    }, [page, rowsPerPage, filter]);

    useEffect(() => {
        getRoles();
    }, []);

    return {
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
    };
};
