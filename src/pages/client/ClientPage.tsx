import { Container, Grid } from "@mui/material";
import { CreateModal, DeleteModal, UrlBreadCrumbs } from "../../components";
import { useClient } from "./hooks/useClient";
import { ClientForm } from "./components/clientForm";
import { FilterClientForm } from "./components/filterClientForm";
import { ClientTable } from "./components/clientTable";
import { ClientStatCards } from "./components/clientStatCards";
import { ClientPurchasesDialog } from "./components/clientPurchasesDialog";

const ClientPage = () => {

    const {
        clients,
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
        purchasesOpen,
        dialogClientId,
        dialogClientName,
        setPurchasesOpen,
        handlePurchases,
    } = useClient();

    return (
        <Container maxWidth={false} disableGutters>

            <UrlBreadCrumbs />

            <Grid container spacing={1} sx={{ px: 1, pt: 1 }}>
                <ClientStatCards
                    total={stats.total}
                    porLlamar={stats.porLlamar}
                    vencidos={stats.vencidos}
                    contactados={stats.contactados}
                />
            </Grid>

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
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
                handlePurchases={handlePurchases}
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
                />
            </CreateModal>

            <ClientPurchasesDialog
                open={purchasesOpen}
                clientId={dialogClientId}
                clientName={dialogClientName}
                onClose={() => setPurchasesOpen(false)}
            />

        </Container>
    );
};

export default ClientPage;
