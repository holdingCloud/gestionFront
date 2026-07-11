import { useState } from 'react';
import { Box, Button, Typography } from '@mui/material';
import SystemUpdateAltOutlinedIcon from '@mui/icons-material/SystemUpdateAltOutlined';
import DeleteForeverOutlinedIcon from '@mui/icons-material/DeleteForeverOutlined';
import CloseOutlinedIcon from '@mui/icons-material/CloseOutlined';
import { CreateModal, DeleteModal, UrlBreadCrumbs } from '../../components';
import { useClient } from './hooks/useClient';
import { ClientForm } from './components/clientForm';
import { FilterClientForm } from './components/filterClientForm';
import { ClientTable } from './components/clientTable';
import { ClientStatCards } from './components/clientStatCards';
import { ClientPurchasesDialog } from './components/clientPurchasesDialog';
import { BulkFrequencyModal } from './components/bulkFrequencyModal';
import { AiWhatsappPanel } from '../../components/ai-panel/AiWhatsappPanel';
import { ClientResponse } from '../../interfaces/client.interface';
import { useThemeStore, THEME_TOKENS } from '../../store/theme/theme.store';

const ClientPage = () => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [aiOpen, setAiOpen] = useState(false);
    const [aiClient, setAiClient] = useState<ClientResponse | null>(null);

    const openAiPanel = (client: ClientResponse) => {
        setAiClient(client);
        setAiOpen(true);
    };

    const {
        clients,
        loading,
        page,
        open,
        count,
        stats,
        rowsPerPage,
        createModal,
        hiddeButton,
        editingClient,
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
        companies,
        updatedId,
        updatedIds,
        selectedIds,
        bulkFreqOpen,
        isBulkSaving,
        handleSelectRow,
        handleSelectAll,
        clearSelection,
        openBulkFreqModal,
        closeBulkFreqModal,
        bulkUpdateFrequency,
        bulkDeleteOpen,
        openBulkDeleteModal,
        closeBulkDeleteModal,
        bulkDeleteClients,
    } = useClient();

    return (
        <Box>
            <UrlBreadCrumbs />

            {/* Stat cards — 4-column grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(5, 1fr)',
                gap: '14px',
                px: '8px',
                pt: '8px',
                pb: '14px',
            }}>
                <ClientStatCards
                    total={stats.total}
                    nuevos={stats.nuevos}
                    porLlamar={stats.porLlamar}
                    vencidos={stats.vencidos}
                    contactados={stats.contactados}
                    loading={loading}
                />
            </Box>

            <FilterClientForm
                handleFilter={handleFilter}
                onSetCreateModal={onSetCreateModal}
                companies={companies}
            />

            {/* Bulk selection action bar */}
            {selectedIds.size > 0 && (
                <Box sx={{
                    mx: 1, mb: 1, px: 2, py: 1,
                    bgcolor: 'background.paper',
                    borderRadius: '12px',
                    border: `1px solid ${t.primary}44`,
                    boxShadow: `0 2px 10px ${t.primary}22`,
                    display: 'flex', alignItems: 'center', gap: 2,
                }}>
                    <Box sx={{
                        px: '10px', py: '3px', borderRadius: '20px',
                        bgcolor: `${t.primary}18`,
                        color: t.primary, fontWeight: 700, fontSize: '13px',
                    }}>
                        {selectedIds.size} seleccionado{selectedIds.size !== 1 ? 's' : ''}
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ flex: 1 }}>
                        Aplicar acción masiva
                    </Typography>
                    <Button
                        variant="contained"
                        size="small"
                        startIcon={<SystemUpdateAltOutlinedIcon fontSize="small" />}
                        onClick={openBulkFreqModal}
                        disableElevation
                        sx={{
                            textTransform: 'none', fontWeight: 700, borderRadius: '8px',
                            bgcolor: '#0e9f8c', '&:hover': { bgcolor: '#0b8a79' },
                        }}
                    >
                        Actualizar frecuencia
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        startIcon={<DeleteForeverOutlinedIcon fontSize="small" />}
                        onClick={openBulkDeleteModal}
                        sx={{ textTransform: 'none', fontWeight: 700, borderRadius: '8px' }}
                    >
                        Eliminar seleccionados
                    </Button>
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<CloseOutlinedIcon fontSize="small" />}
                        onClick={clearSelection}
                        sx={{
                            textTransform: 'none', fontWeight: 600, borderRadius: '8px',
                            borderColor: t.border, color: 'text.secondary',
                        }}
                    >
                        Limpiar selección
                    </Button>
                </Box>
            )}

            <ClientTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                clients={clients}
                loading={loading}
                updatedId={updatedId}
                updatedIds={updatedIds}
                selectedIds={selectedIds}
                onSelectRow={handleSelectRow}
                onSelectAll={handleSelectAll}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                handlePurchases={handlePurchases}
                onAiMessage={openAiPanel}
            />

            <DeleteModal
                title={'¿Desea eliminar el cliente?'}
                content={'Con esta acción borrará al cliente de forma permanente'}
                open={open}
                onClose={onClose}
            />

            <CreateModal
                title={hiddeButton ? 'Crear Cliente' : 'Editar Cliente'}
                open={createModal}
                onClose={onSetCreateModal}
            >
                <ClientForm
                    onSetCreateModal={onSetCreateModal}
                    hiddeButton={hiddeButton}
                    editingClient={editingClient}
                    onCreate={submitCreate}
                    onUpdate={submitUpdate}
                    cancelUpdate={cancelUpdate}
                    companies={companies}
                />
            </CreateModal>

            <ClientPurchasesDialog
                open={purchasesOpen}
                clientId={dialogClientId}
                clientName={dialogClientName}
                onClose={() => setPurchasesOpen(false)}
                onRefresh={refreshClients}
            />

            <AiWhatsappPanel
                open={aiOpen}
                onClose={() => setAiOpen(false)}
                client={aiClient}
            />

            <BulkFrequencyModal
                open={bulkFreqOpen}
                selectedCount={selectedIds.size}
                isSaving={isBulkSaving}
                onClose={closeBulkFreqModal}
                onConfirm={bulkUpdateFrequency}
            />

            <DeleteModal
                title={`¿Eliminar ${selectedIds.size} cliente${selectedIds.size !== 1 ? 's' : ''}?`}
                content="Esta acción es permanente y no se puede deshacer."
                open={bulkDeleteOpen}
                onClose={async (confirmed) => {
                    if (confirmed) await bulkDeleteClients();
                    else closeBulkDeleteModal();
                }}
            />
        </Box>
    );
};

export default ClientPage;
