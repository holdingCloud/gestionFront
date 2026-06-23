import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useFormik } from "formik";
import * as Yup from 'yup';
import { useClientStore, useCompanyStore } from "../../../store";
import { ClientService } from "../../../services";
import { ClientBody } from "../../../interfaces/client.interface";

interface FilterParams {
    search?: string;
    contactStatus?: string;
    communeId?: number;
    companyId?: number;
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

    const [searchFilter, setSearchFilter] = useState('');
    const [statusFilter, setStatusFilter] = useState('');
    const [communeIdFilter, setCommuneIdFilter] = useState<number | undefined>(undefined);
    const [companyIdFilter, setCompanyIdFilter] = useState<number | undefined>(undefined);

    const [stats, setStats] = useState({ total: 0, porLlamar: 0, vencidos: 0, contactados: 0 });
    const [isSavingUpdate, setIsSavingUpdate] = useState(false);
    const [updatedId, setUpdatedId] = useState<number | null>(null);

    const doFetch = async (pg: number, limit: number, filters: FilterParams) => {
        await getClients({
            page: pg + 1,
            limit,
            search: filters.search || undefined,
            contactStatus: filters.contactStatus || undefined,
            communeId: filters.communeId,
            companyId: filters.companyId,
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
        doFetch(newPage, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
    };

    const handleChangeRowsPerPage = (
        event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const newLimit = parseInt(event.target.value, 10);
        setRowsPerPage(newLimit);
        setPage(0);
        doFetch(0, newLimit, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
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
            calle: data.direccion?.calle ?? '',
            numero: data.direccion?.numero ?? '',
            departamento: data.direccion?.departamento ?? '',
            referencia: data.direccion?.referencia ?? '',
            communeId: data.direccion?.communeId ?? '',
            frequency: data.frequency ?? '',
            companyId: data.companyId ?? '',
        });
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        resetForm();
    };

    const buildDireccionPrincipal = (vals: typeof values) => {
        if (!vals.calle) return undefined;
        return {
            calle: vals.calle,
            ...(vals.numero ? { numero: vals.numero } : {}),
            ...(vals.departamento ? { departamento: vals.departamento } : {}),
            ...(vals.referencia ? { referencia: vals.referencia } : {}),
            ...(vals.communeId ? { communeId: Number(vals.communeId) } : {}),
        };
    };

    const saveUpdate = async () => {
        setIsSavingUpdate(true);
        try {
            const payload: ClientBody = {
                fullname: values.fullname,
                email: values.email,
                phone: values.phone,
                ...(values.companyId ? { companyId: Number(values.companyId) } : {}),
                ...(values.frequency !== '' && values.frequency !== undefined ? { frequency: Number(values.frequency) } : {}),
            };
            const dir = buildDireccionPrincipal(values);
            if (dir) payload.direccionPrincipal = dir;

            await updateClient(deleteId, payload);
            await doFetch(page, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
            await fetchStats();
            enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
            setUpdatedId(deleteId);
            setTimeout(() => setUpdatedId(null), 2500);
            resetForm();
        } finally {
            setIsSavingUpdate(false);
        }
    };

    const onClose = async (action: boolean) => {
        setOpen(false);
        if (action) {
            await deleteClient(deleteId);
            const newPage = allClients.length === 1 && page > 0 ? page - 1 : page;
            setPage(newPage);
            await doFetch(newPage, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
            await fetchStats();
            enqueueSnackbar('Cliente eliminado exitosamente', { variant: 'success' });
        }
    };

    const handleFilter = ({ name, address, status, companyId }: { name: string; address: string; status: string; companyId?: number }) => {
        const search = name.trim() || address.trim() || undefined;
        setSearchFilter(search ?? '');
        setStatusFilter(status);
        setCompanyIdFilter(companyId);
        setPage(0);
        doFetch(0, rowsPerPage, { search, contactStatus: status, communeId: communeIdFilter, companyId });
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
        isSubmitting,
    } = useFormik({
        initialValues: {
            fullname: '',
            email: '',
            phone: '',
            calle: '',
            numero: '',
            departamento: '',
            referencia: '',
            communeId: '' as any,
            frequency: '' as any,
            companyId: '' as any,
        },
        onSubmit: async (vals, { resetForm }) => {
            const freq = vals.frequency !== '' && vals.frequency !== undefined ? Number(vals.frequency) : undefined;
            const compId = vals.companyId !== '' && vals.companyId !== undefined ? Number(vals.companyId) : undefined;

            const payload: ClientBody = {
                fullname: vals.fullname,
                email: vals.email,
                phone: vals.phone,
                ...(freq ? { frequency: freq } : {}),
                ...(compId ? { companyId: compId } : {}),
            };

            const dir = buildDireccionPrincipal(vals);
            if (dir) payload.direccionPrincipal = dir;

            await createClient(payload as any);
            setPage(0);
            await doFetch(0, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
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
            calle: Yup.string().required('Requerido'),
        }),
        validateOnChange: false,
        validateOnBlur: true,
    });

    useEffect(() => {
        doFetch(0, rowsPerPage, {});
        getCompanies();
        fetchStats();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const refreshClients = () =>
        doFetch(page, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });

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
        isSaving: isSubmitting || isSavingUpdate,
        updatedId,
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
        refreshClients,
        purchasesOpen,
        dialogClientId,
        dialogClientName,
        setPurchasesOpen,
        handlePurchases,
    };
};
