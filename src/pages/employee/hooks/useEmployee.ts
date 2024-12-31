import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useEmployeeStore } from "../../../store/employee/employee.store";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "notistack";

export const useEmployee = () => {

    const employees = useEmployeeStore(state => state.employees);
    const count = useEmployeeStore(state => state.count);
    const getEmployees = useEmployeeStore(state => state.getEmployees);


    const { enqueueSnackbar } = useSnackbar();

    const [createModal, setCreateModal] = useState(false);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [open, setOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<{ fullname: string, email: string }>({ fullname: "", email: "" });
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [skip, setSkip] = useState(0);

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

    const handleFilter = (fullname: string, email: string) => {
        setFilter({ fullname, email });
        setSkip(0);
        setRowsPerPage(0);
    }

    const onSetCreateModal = (action: boolean) => {
        setCreateModal(action);
    }

    const saveUpdate = () => {


        enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
        resetForm();

        setTimeout(() => {
            getEmployees(skip, rowsPerPage, {});
        }, 1000)

    }

    const handleUpdate = ({ password, passwordConfirmation, ...data }: any) => {
        setHiddeButton(false);
        setCreateModal(true);
        //setDeleteId(data.id);
        setValues({ ...data, password: "", passwordConfirmation: "" });
    }

    const handleActive = (id: number, status: boolean) => {
        //changeStatus(id, status);
        enqueueSnackbar('El estado usuario actualizado exitosamente', { variant: 'success' });

        setTimeout(() => {
            //getUsers(skip, rowsPerPage, filter);
        }, 1000)
    }

    const handleDelete = (id: number) => {
        // setDeleteId(id);
        setOpen(true);
    }


    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    }

    const onClose = (action: boolean) => {
        setOpen(false);
        if (action) {
            //deleteUser(deleteId);
            enqueueSnackbar('Usuario eliminado exitosamente', { variant: 'success' });
        }
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
            fullName: '',
        },
        onSubmit: ({ fullName }, { resetForm }) => {
            //createUser({ userName, fullName, email, avatar, password });
            console.log(fullName)
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            rut: Yup.string().min(11).max(12, 'Debe de tener minimo 11  y maximo 11 caracteres').required('Requerido'),
            fullName: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            email: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            salary: Yup.number().min(11).required('Requerido'),
            hireDate: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            city: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            address: Yup.string().min(10).max(50, 'Debe ingresar la dirección').required('Requerido'),
            type: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
        })
    });



    useEffect(() => {
        getEmployees(skip, rowsPerPage, filter);
    }, [skip, rowsPerPage, filter]);

    return {
        //Properties
        employees,
        page,
        open,
        count,
        rowsPerPage,
        values,
        errors,
        touched,
        hiddeButton,
        createModal,
        //Methods
        getEmployees,
        saveUpdate,
        cancelUpdate,
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
        onClose

    }
}