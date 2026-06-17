import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useClientStore, useCompanyStore } from "../../../store";
import { ClientService } from "../../../services";

interface FilterParams {
    search?: string;
    contactStatus?: string;
    communeId?: number;
}

export const useClient = () => {

    const allClients = useClientStore(state => state.clients);
    const count = useClientStore(state => state.count);
    const loading = useClientStore(state => state.loading);
    const getClients = useClientStore(state => state.getClients);
    const createClient = useClientStore(state => state.createClient);
    const deleteClient = useClientStore(state => state.deleteClient);
    const updateClient = useClientStore(state => state.updateClient);

    const companies = useCompanyStore(state => state.companies);
    const getCompanies = useCompanyStore(state => state.getCompanies);

    const { enqueueSnackbar } = useSnackbar();

    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [createModal, setCreateModal] = useState(false);
    const [open, setOpen] = useState<boolean>(false);
    const [deleteId, setDeleteId] = useState<number>(0);
    const [hiddeButton, setHiddeButton] = useState(true);
    const [purchasesOpen, setPurchasesOpen] = useState(false);
    const [dialogClientId, setDialogClientId] = useState<number>(0);
    const [dialogClientName, setDialogClientName] = useState<string>('');

    // Server-side filter state
    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [communeIdFilter, setCommuneIdFilter] = useState<number | undefined>(undefined);

    // Global counts (unfiltered, for stat cards)
    const [stats, setStats] = useState({ total: 0, porLlamar: 0, vencidos: 0, contactados: 0 });

    const doFetch = async (pg: number, limit: number, filters: FilterParams) => {
        await getClients({
            page: pg + 1,
            limit,
            search: filters.search || undefined,
            contactStatus: filters.contactStatus || undefined,
            communeId: filters.communeId,
        });
    };

    const fetchStats = async () => {
        try {
            const [all, llamar, vencido, contactado] = await Promise.all([
                ClientService.getClients({ page: 1, limit: 1 }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'LLAMAR' }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'VENCIDO' }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'CONTACTADO' }),
            ]);
            setStats({
                total: all.total,
                porLlamar: llamar.total,
                vencidos: vencido.total,
                contactados: contactado.total,
            });
        } catch {
            // ignore
        }
    };

    const handleChangePage = (
        event: MouseEvent<HTMLButtonElement> | null,
        newPage: number,
    ) => {
        event?.preventDefault();
        setPage(newPage);
        doFetch(newPage, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter });
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newLimit = parseInt(event.target.value, 10);
        setRowsPerPage(newLimit);
        setPage(0);
        doFetch(0, newLimit, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter });
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
            address: data.address ?? '',
            n_depto_casa: data.n_depto_casa ?? '',
            referencia: data.referencia ?? '',
            communeId: data.communeId ?? '',
            frequency: data.frequency ?? '',
            companyId: data.companyId ?? '',
        });
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    };

    const saveUpdate = async () => {
        const dataUpdate = { id: deleteId, ...values };
        await updateClient(dataUpdate as any);
        await doFetch(page, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter });
        await fetchStats();
        enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
        resetForm();
    };

    const onClose = async (action: boolean) => {
        setOpen(false);
        if (action) {
            await deleteClient(deleteId);
            const newPage = allClients.length === 1 && page > 0 ? page - 1 : page;
            setPage(newPage);
            await doFetch(newPage, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter });
            await fetchStats();
            enqueueSnackbar('Cliente eliminado exitosamente', { variant: 'success' });
        }
    };

    const handleFilter = ({ name, communeId, status }: { name: string; communeId: number | undefined; status: string }) => {
        setSearchFilter(name);
        setCommuneIdFilter(communeId);
        setStatusFilter(status);
        setPage(0);
        doFetch(0, rowsPerPage, { search: name, contactStatus: status, communeId });
    };

    const handlePurchases = (id: number, name: string) => {
        setDialogClientId(id);
        setDialogClientName(name);
        setPurchasesOpen(true);
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
            address: '',
            n_depto_casa: '',
            referencia: '',
            communeId: '' as any,
            frequency: '' as any,
            companyId: '' as any,
        },
        onSubmit: async ({ fullname, email, phone, address, n_depto_casa, referencia, communeId, frequency, companyId }, { resetForm }) => {
            const freq = frequency !== '' && frequency !== undefined ? Number(frequency) : undefined;
            const cid = communeId !== '' && communeId !== undefined ? Number(communeId) : undefined;
            const compId = companyId !== '' && companyId !== undefined ? Number(companyId) : undefined;
            await createClient({
                fullname, email, phone, address,
                ...(n_depto_casa ? { n_depto_casa } : {}),
                ...(referencia ? { referencia } : {}),
                ...(cid ? { communeId: cid } : {}),
                ...(freq ? { frequency: freq } : {}),
                ...(compId ? { companyId: compId } : {}),
            });
            setPage(0);
            await doFetch(0, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter });
            await fetchStats();
            enqueueSnackbar('Cliente creado exitosamente', { variant: 'success' });
            resetForm();
        },
        validationSchema: Yup.object({
            fullname: Yup.string().min(3, 'Mínimo 3 caracteres').max(100, 'Máximo 100 caracteres').required('Requerido'),
            email: Yup.string().email('Debe ser un email válido').required('Requerido'),
            phone: Yup.string()
                .matches(/^\+56 9 \d{8}$/, 'Formato inválido. Ej: +56 9 95720483')
                .required('Requerido'),
            address: Yup.string().required('Requerido'),
        })
    });

    useEffect(() => {
        doFetch(0, rowsPerPage, {});
        getCompanies();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return {
        clients: allClients,
        loading,
        page,
        open,
        values,
        count,
        stats,
        errors,
        touched,
        rowsPerPage,
        createModal,
        hiddeButton,
        companies,
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
