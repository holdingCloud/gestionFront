import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useAuthStore, useUserStore } from "../../../store";

export const useUser = () => {


    const users = useUserStore(state => state.users);
    const count = useUserStore(state => state.count);
    const getUsers = useUserStore(state => state.getUsers);
    const createUser = useUserStore(state => state.createUser);
    const deleteUser = useUserStore(state => state.deleteUser);
    const changeStatus = useUserStore(state => state.changeStatus);
    const updateUser = useUserStore(state => state.updateUser);
    const checkAuthStatus = useAuthStore(state => state.checkAuthStatus);


    const { enqueueSnackbar } = useSnackbar();

    const [showPassword, setShowPassword] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [skip, setSkip] = useState(0);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [filter, setFilter] = useState<{ fullname: string, email: string }>({ fullname: "", email: "" });

    const handleClickShowPassword = () => {
        setShowPassword(!showPassword);
    };


    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        event?.preventDefault();
        setPage(newPage);
        setSkip(rowsPerPage * newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
    };

    const onCloseDialog = () => {
        setOpenDialog(false);
    }

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    }

    const onSetCreateModal = (action: boolean) => {
        setCreateModal(action);
    }

    const handleUpdate = ({ password, passwordConfirmation, ...data }: any) => {
        setHiddeButton(false);
        setCreateModal(true);
        setDeleteId(data.id);
        setValues({ ...data, password: "", passwordConfirmation: "" });
    }

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    }

    const saveUpdate = () => {

        const dataUpdate = {
            id: deleteId,
            isActive: true,
            ...values
        }
        const { passwordConfirmation, ...updateValues } = dataUpdate;

        updateUser(updateValues);
        enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
        resetForm();

        setTimeout(() => {
            getUsers(skip, rowsPerPage, {});
        }, 1000)

    }

    const onClose = (action: boolean) => {
        setOpen(false);
        if (action) {
            deleteUser(deleteId);
            enqueueSnackbar('Usuario eliminado exitosamente', { variant: 'success' });
        }
    }

    const handleActive = (id: number, status: boolean) => {
        changeStatus(id, status);
        enqueueSnackbar('El estado usuario actualizado exitosamente', { variant: 'success' });

        setTimeout(() => {
            getUsers(skip, rowsPerPage, filter);
        }, 1000)
    }


    const handleFilter = (fullname: string, email: string) => {
        setFilter({ fullname, email });
        setSkip(0);
        setRowsPerPage(10);
    }


    const {
        handleSubmit,
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        setValues,
        resetForm,
    } = useFormik({
        initialValues: {
            userName: '',
            fullName: '',
            email: '',
            avatar: '',
            password: '',
            passwordConfirmation: '',
        },
        onSubmit: ({ fullName, userName, email, avatar, password }, { resetForm }) => {
            createUser({ userName, fullName, email, avatar, password });
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            userName: Yup.string().max(15, 'Debe de tener 15 caracteres o menos').required('Requerido'),
            fullName: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            email: Yup.string().email('debe ser un email valido').required('Requerido'),
            avatar: Yup.string().max(10, 'Ingrese imagen'),
            password: Yup.string().min(6, 'La contraseña debe tener más de 6 caracteres').max(30, 'la contraseña tiene un largo maximo de 30 caracteres').required().notOneOf(['it-jr'], 'Esta opción no es permitida'),
            passwordConfirmation: Yup.string().min(6, 'La contraseña debe tener más de 6 caracteres').max(30, 'la contraseña tiene un largo maximo de 30 caracteres').oneOf([Yup.ref('password')], 'La contraseñas no son iguales')
        })
    });


    useEffect(() => {
        getUsers(skip, rowsPerPage, filter);
        checkAuthStatus();

    }, [page, rowsPerPage, filter]);


    return {
        //Propierties
        users,
        page,
        open,
        values,
        count,
        errors,
        touched,
        rowsPerPage,
        openDialog,
        createModal,
        showPassword,
        hiddeButton,
        //Methods
        handleSubmit,
        handleChange,
        handleBlur,
        saveUpdate,
        handleActive,
        handleUpdate,
        cancelUpdate,
        handleClickShowPassword,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onCloseDialog,
        onSetCreateModal,
        handleDelete,
        handleFilter,

    }
}
