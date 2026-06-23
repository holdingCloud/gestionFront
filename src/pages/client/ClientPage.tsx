import { useState } from 'react';
import { Box } from '@mui/material';
import { CreateModal, DeleteModal, UrlBreadCrumbs } from '../../components';
import { useClient } from './hooks/useClient';
import { ClientForm } from './components/clientForm';
import { FilterClientForm } from './components/filterClientForm';
import { ClientTable } from './components/clientTable';
import { ClientStatCards } from './components/clientStatCards';
import { ClientPurchasesDialog } from './components/clientPurchasesDialog';
import { AiWhatsappPanel } from '../../components/ai-panel/AiWhatsappPanel';
import { ClientResponse } from '../../interfaces/client.interface';

const ClientPage = () => {

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
        values,
        count,
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
        refreshClients,
        purchasesOpen,
        dialogClientId,
        dialogClientName,
        setPurchasesOpen,
        handlePurchases,
        companies,
    } = useClient();

    return (
        <Box>
            <UrlBreadCrumbs />

            {/* Stat cards — 4-column grid */}
            <Box sx={{
                display: 'grid',
                gridTemplateColumns: 'repeat(4, 1fr)',
                gap: '14px',
                px: '8px',
                pt: '8px',
                pb: '14px',
            }}>
                <ClientStatCards
                    total={stats.total}
                    porLlamar={stats.porLlamar}
                    vencidos={stats.vencidos}
                    contactados={stats.contactados}
                    loading={loading}
                />
            </Box>

            <FilterClientForm
                handleFilter={handleFilter}
                onSetCreateModal={onSetCreateModal}
            />

            <ClientTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                clients={clients}
                loading={loading}
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
                    handleSubmit={handleSubmit}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    hiddeButton={hiddeButton}
                    saveUpdate={saveUpdate}
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
        </Box>
    );
};

export default ClientPage;
