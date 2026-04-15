import { ChangeEvent, MouseEvent, useEffect, useState } from "react"
import { useEmployeeStore } from "../../../store/employee/employee.store";
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useSnackbar } from "notistack";

export const useEmployee = () => {

    const employees = useEmployeeStore(state => state.employees);
    const count = useEmployeeStore(state => state.count);
    const getEmployees = useEmployeeStore(state => state.getEmployees);
    const deleteEmployee = useEmployeeStore(state => state.deleteEmployee);

    const { enqueueSnackbar } = useSnackbar();

    const [createModal, setCreateModal] = useState(false);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [open, setOpen] = useState<boolean>(false);
    const [filter, setFilter] = useState<{ fullname: string, email: string }>({ fullname: "", email: "" });
    const [page, setPage] = useState(1);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        event?.preventDefault();
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(1);
    };

    const handleFilter = (fullname: string, email: string) => {
        setFilter({ fullname, email });
        setPage(1);
        setRowsPerPage(0);
    }

    const onSetCreateModal = (action: boolean) => {
        setCreateModal(action);
    }

    const saveUpdate = () => {

        /*  const dataUpdate = {
              id: deleteId,
              ...values
          }*/

        //updateEmployee(dataUpdate);
        enqueueSnackbar('Usuario actualizado exitosamente', { variant: 'success' });
        resetForm();

        setTimeout(() => {
            getEmployees(page, rowsPerPage, {});
        }, 1000)

    }

    const handleUpdate = ({ ...data }: any) => {
        setHiddeButton(false);
        setCreateModal(true);
        setDeleteId(data.id);
        setValues({ ...data });
    }

    const handleActive = (_id: number, _status: boolean) => {
        //changeStatus(id, status);
        enqueueSnackbar('El estado usuario actualizado exitosamente', { variant: 'success' });
        setTimeout(() => {
            //getUsers(skip, rowsPerPage, filter);
        }, 1000)
    }

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    }


    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    }

    const onClose = (action: boolean) => {
        setOpen(false);
        if (action) {
            deleteEmployee(deleteId);
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
        setFieldValue
    } = useFormik({
        initialValues: {
            rut: '',
            fullName: '',
            email: '',
            salary: 0,
            hireDate: '',
            city: '',
            address: '',
            type: ''

        },
        onSubmit: ({ rut, fullName, email, salary, hireDate, city, address, type }, { resetForm }) => {
            //createEmployee({ rut, fullName, email, salary, hireDate, city, address, type });
            console.log(rut, fullName, email, salary, hireDate, city, address, type)
            console.log("HOLA")
            enqueueSnackbar('Usuario creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            rut: Yup.string().min(9).max(11, 'Debe de tener minimo 11  y maximo 11 caracteres').required('Requerido'),
            fullName: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            email: Yup.string().email('debe ser un email valido').required('Requerido'),
            salary: Yup.number().min(11).required('Requerido'),
            hireDate: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            city: Yup.string().min(10).max(30, 'Debe de tener minimo 10  y maximo 30 caracteres').required('Requerido'),
            address: Yup.string().min(10).max(50, 'Debe ingresar la dirección').required('Requerido'),
            type: Yup.string().required('Seleccione una opción'),
        })
    });



    useEffect(() => {
        getEmployees(page, rowsPerPage, filter);
    }, [page, rowsPerPage, filter]);

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
        setFieldValue,
        onClose

    }
}
