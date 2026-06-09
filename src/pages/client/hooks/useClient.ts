import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useClientStore } from "../../../store";

export const useClient = () => {

    const allClients = useClientStore(state => state.clients);
    const getClients = useClientStore(state => state.getClients);
    const createClient = useClientStore(state => state.createClient);
    const deleteClient = useClientStore(state => state.deleteClient);
    const updateClient = useClientStore(state => state.updateClient);

    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [nameFilter, setNameFilter] = useState('');
    const [cityFilter, setCityFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [purchasesOpen, setPurchasesOpen] = useState(false);
    const [dialogClientId, setDialogClientId] = useState<number>(0);
    const [dialogClientName, setDialogClientName] = useState<string>('');

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
        setPage(0);
    };

    const handleDelete = (id: number) => {
        setDeleteId(id);
        setOpen(true);
    };

    const onSetCreateModal = (action: boolean) => {
        setCreateModal(action);
    };

    const handleUpdate = ({ ...data }: any) => {
        setHiddeButton(false);
        setCreateModal(true);
        setDeleteId(data.id);
        setValues({
            fullname: data.fullname ?? '',
            email: data.email ?? '',
            phone: data.phone ?? '',
            city: data.city ?? '',
            address: data.address ?? '',
        });
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    };

    const saveUpdate = () => {
        const dataUpdate = { id: deleteId, ...values };
        updateClient(dataUpdate as any);
        enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
        resetForm();
        setTimeout(() => { getClients(); }, 1000);
    };

    const onClose = (action: boolean) => {
        setOpen(false);
        if (action) {
            deleteClient(deleteId);
            enqueueSnackbar('Cliente eliminado exitosamente', { variant: 'success' });
        }
    };

    const handleFilter = ({ name, city, status }: { name: string; city: string; status: string }) => {
        setNameFilter(name);
        setCityFilter(city);
        setStatusFilter(status);
        setPage(0);
    };

    const handlePurchases = (id: number, name: string) => {
        setDialogClientId(id);
        setDialogClientName(name);
        setPurchasesOpen(true);
    };

    const safeClients = Array.isArray(allClients) ? allClients : [];

    const filteredClients = safeClients.filter(c => {
        const matchName = !nameFilter || (c.fullname ?? '').toLowerCase().includes(nameFilter.toLowerCase());
        const matchCity = !cityFilter || (c.city ?? '').toLowerCase().includes(cityFilter.toLowerCase());
        const matchStatus = !statusFilter || c.contactStatus === statusFilter;
        return matchName && matchCity && matchStatus;
    });

    const paginatedClients = filteredClients.slice(
        page * rowsPerPage,
        page * rowsPerPage + rowsPerPage
    );

    const stats = {
        total: safeClients.length,
        porLlamar: safeClients.filter(c => c.contactStatus === 'LLAMAR').length,
        vencidos: safeClients.filter(c => c.contactStatus === 'VENCIDO').length,
        contactados: safeClients.filter(c => c.contactStatus === 'CONTACTADO').length,
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
            fullname: '',
            email: '',
            phone: '',
            city: '',
            address: '',
            frequency: '' as any,
        },
        onSubmit: ({ fullname, email, phone, city, address, frequency }, { resetForm }) => {
            const freq = frequency !== '' && frequency !== undefined ? Number(frequency) : undefined;
            createClient({ fullname, email, phone, city, address, ...(freq ? { frequency: freq } : {}) });
            enqueueSnackbar('Cliente creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            fullname: Yup.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres').required('Requerido'),
            email: Yup.string().email('Debe ser un email válido').required('Requerido'),
            phone: Yup.string()
                .matches(/^\+56 9 \d{8}$/, 'Formato inválido. Ej: +56 9 95720483')
                .required('Requerido'),
            city: Yup.string().required('Requerido'),
            address: Yup.string().required('Requerido'),
        })
    });

    useEffect(() => {
        getClients();
    }, []);

    return {
        clients: paginatedClients,
        page,
        open,
        values,
        count: filteredClients.length,
        stats,
        errors,
        touched,
        rowsPerPage,
        createModal,
        hiddeButton,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        saveUpdate,
        handleUpdate,
        cancelUpdate,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onSetCreateModal,
        handleDelete,
        handleFilter,
        purchasesOpen,
        dialogClientId,
        dialogClientName,
        setPurchasesOpen,
        handlePurchases,
    };
};
