import { ChangeEvent, MouseEvent, useEffect, useState } from "react";
import { useSnackbar } from 'notistack';
import { useClientStore, useCompanyStore } from "../../../store";
import { ClientService } from "../../../services";
import { ClientBody, ClientResponse } from "../../../interfaces/client.interface";

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
    const communeIdFilter = undefined as number | undefined;
    const [companyIdFilter, setCompanyIdFilter] = useState<number | undefined>(undefined);

    const [stats, setStats] = useState({ total: 0, nuevos: 0, porLlamar: 0, vencidos: 0, contactados: 0 });
    const [editingClient, setEditingClient] = useState<ClientResponse | null>(null);
    const [updatedId, setUpdatedId] = useState<number | null>(null);
    const [updatedIds, setUpdatedIds] = useState<Set<number>>(new Set());
    const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());
    const [bulkFreqOpen, setBulkFreqOpen] = useState(false);
    const [bulkDeleteOpen, setBulkDeleteOpen] = useState(false);
    const [isBulkSaving, setIsBulkSaving] = useState(false);

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
            const [all, nuevo, llamar, vencido, contactado] = await Promise.all([
                ClientService.getClients({ page: 1, limit: 1 }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'NUEVO' }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'LLAMAR' }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'VENCIDO' }),
                ClientService.getClients({ page: 1, limit: 1, contactStatus: 'CONTACTADO' }),
            ]);
            setStats({
                total: all.total,
                nuevos: nuevo.total,
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
        // Al abrir para "Nuevo cliente" reiniciamos el modo edición.
        if (action) {
            setHiddeButton(true);
            setEditingClient(null);
        }
        setCreateModal(action);
    };

    const handleUpdate = (data: ClientResponse) => {
        setHiddeButton(false);
        setEditingClient(data);
        setDeleteId(data.id);
        setCreateModal(true);
    };

    const cancelUpdate = () => {
        setHiddeButton(true);
        setEditingClient(null);
    };

    // Alta de cliente — el formulario arma el payload y aquí orquestamos la
    // recarga de la tabla, estadísticas y cierre del modal.
    const submitCreate = async (payload: ClientBody) => {
        await createClient(payload as any);
        setPage(0);
        await doFetch(0, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
        await fetchStats();
        enqueueSnackbar('Cliente creado exitosamente', { variant: 'success' });
        setCreateModal(false);
    };

    const submitUpdate = async (id: number, payload: ClientBody) => {
        await updateClient(id, payload);
        await doFetch(page, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
        await fetchStats();
        enqueueSnackbar('Cliente actualizado exitosamente', { variant: 'success' });
        setUpdatedId(id);
        setTimeout(() => setUpdatedId(null), 2500);
        setCreateModal(false);
        setEditingClient(null);
        setHiddeButton(true);
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

    const handleSelectRow = (id: number, checked: boolean) => {
        setSelectedIds(prev => {
            const next = new Set(prev);
            checked ? next.add(id) : next.delete(id);
            return next;
        });
    };

    const handleSelectAll = (checked: boolean) =>
        setSelectedIds(checked ? new Set(allClients.map(c => c.id)) : new Set());

    const clearSelection = () => setSelectedIds(new Set());
    const openBulkFreqModal = () => setBulkFreqOpen(true);
    const closeBulkFreqModal = () => setBulkFreqOpen(false);
    const openBulkDeleteModal = () => setBulkDeleteOpen(true);
    const closeBulkDeleteModal = () => setBulkDeleteOpen(false);

    const bulkDeleteClients = async () => {
        setIsBulkSaving(true);
        const ids = Array.from(selectedIds);
        try {
            const results = await Promise.allSettled(
                ids.map(id => deleteClient(id))
            );
            const succeeded = ids.filter((_, i) => results[i].status === 'fulfilled');
            const failedCount = ids.length - succeeded.length;
            const newPage = allClients.length - succeeded.length <= 0 && page > 0 ? page - 1 : page;
            setPage(newPage);
            await doFetch(newPage, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
            await fetchStats();
            if (succeeded.length > 0) {
                enqueueSnackbar(`${succeeded.length} cliente(s) eliminado(s) exitosamente`, { variant: 'success' });
            }
            if (failedCount > 0) {
                enqueueSnackbar(`${failedCount} cliente(s) no pudieron ser eliminados`, { variant: 'error' });
            }
            clearSelection();
            closeBulkDeleteModal();
        } finally {
            setIsBulkSaving(false);
        }
    };

    const bulkUpdateFrequency = async (frequency: number) => {
        setIsBulkSaving(true);
        const ids = Array.from(selectedIds);
        try {
            const results = await Promise.allSettled(
                ids.map(id => updateClient(id, { frequency } as ClientBody))
            );
            const succeeded = ids.filter((_, i) => results[i].status === 'fulfilled');
            const failedCount = ids.length - succeeded.length;
            await doFetch(page, rowsPerPage, { search: searchFilter, contactStatus: statusFilter, communeId: communeIdFilter, companyId: companyIdFilter });
            await fetchStats();
            if (succeeded.length > 0) {
                setUpdatedIds(new Set(succeeded));
                setTimeout(() => setUpdatedIds(new Set()), 2500);
                enqueueSnackbar(`${succeeded.length} cliente(s) actualizados con frecuencia de ${frequency} días`, { variant: 'success' });
            }
            if (failedCount > 0) {
                enqueueSnackbar(`${failedCount} cliente(s) no pudieron ser actualizados`, { variant: 'error' });
            }
            clearSelection();
            closeBulkFreqModal();
        } finally {
            setIsBulkSaving(false);
        }
    };

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
        count,
        stats,
        rowsPerPage,
        createModal,
        hiddeButton,
        companies,
        editingClient,
        updatedId,
        submitCreate,
        submitUpdate,
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
        updatedIds,
        selectedIds,
        bulkFreqOpen,
        bulkDeleteOpen,
        isBulkSaving,
        handleSelectRow,
        handleSelectAll,
        clearSelection,
        openBulkFreqModal,
        closeBulkFreqModal,
        bulkUpdateFrequency,
        openBulkDeleteModal,
        closeBulkDeleteModal,
        bulkDeleteClients,
    };
};
