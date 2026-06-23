import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useCompanyStore } from "../../../store";

export const useCompany = () => {
    const companies = useCompanyStore(state => state.companies);
    const loading = useCompanyStore(state => state.loading);
    const getCompanies = useCompanyStore(state => state.getCompanies);
    const createCompany = useCompanyStore(state => state.createCompany);
    const updateCompany = useCompanyStore(state => state.updateCompany);
    const deleteCompany = useCompanyStore(state => state.deleteCompany);

    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState(false);
    const [deleteId, setDeleteId] = useState(0);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [nameFilter, setNameFilter] = useState('');
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    const handleChangePage = (_: MouseEvent<HTMLButtonElement> | null, newPage: number) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
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
        setValues({
            name: data.name ?? '',
            description: data.description ?? '',
        });
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    };

    const saveUpdate = async () => {
        await updateCompany(deleteId, values);
        enqueueSnackbar('Empresa actualizada exitosamente', { variant: 'success' });
        setUpdatedId(deleteId);
        setTimeout(() => setUpdatedId(null), 2500);
        setCreateModal(false);
        resetForm();
        setHiddeButton(true);
    };

    const onClose = (action: boolean) => {
        setOpen(false);
        if (action) {
            deleteCompany(deleteId);
            enqueueSnackbar('Empresa eliminada exitosamente', { variant: 'success' });
        }
    };

    const handleFilter = (name: string) => {
        setNameFilter(name);
        setPage(0);
    };

    const filteredCompanies = companies.filter(c =>
        !nameFilter || c.name.toLowerCase().includes(nameFilter.toLowerCase())
    );

    const paginatedCompanies = filteredCompanies.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const { handleSubmit, errors, touched, values, handleBlur, handleChange, setValues, resetForm } = useFormik({
        initialValues: { name: '', description: '' },
        onSubmit: async ({ name, description }, { resetForm }) => {
            await createCompany({ name, ...(description ? { description } : {}) });
            enqueueSnackbar('Empresa creada exitosamente', { variant: 'success' });
            setCreateModal(false);
            resetForm();
        },
        validationSchema: Yup.object({
            name: Yup.string().min(2, 'Mínimo 2 caracteres').max(150, 'Máximo 150 caracteres').required('Requerido'),
            description: Yup.string().max(500, 'Máximo 500 caracteres'),
        }),
        validateOnChange: false,
        validateOnBlur: true,
    });

    useEffect(() => {
        getCompanies();
    }, []);

    return {
        companies: paginatedCompanies,
        loading,
        updatedId,
        page,
        open,
        values,
        count: filteredCompanies.length,
        errors,
        touched,
        rowsPerPage,
        createModal,
        hiddeButton,
        handleSubmit,
        handleChange,
        handleBlur,
        saveUpdate,
        handleUpdate,
        cancelUpdate,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onSetCreateModal,
        handleDelete,
        handleFilter,
    };
};
