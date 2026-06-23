import { Grid } from "@mui/material";
import { CreateModal, DeleteModal } from "../../components";
import { useCompany } from "./hooks/useCompany";
import { CompanyForm } from "./components/companyForm";
import { CompanyTable } from "./components/companyTable";
import { FilterCompanyForm } from "./components/filterCompanyForm";

const CompanyPage = () => {
    const {
        companies,
        loading,
        page,
        open,
        values,
        count,
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
        updatedId,
    } = useCompany();

    return (
        <Grid container>
            <DeleteModal
                title="¿Desea eliminar la empresa?"
                content="Con esta acción borrará la empresa de forma permanente"
                open={open}
                onClose={onClose}
            />

            <CreateModal
                title={hiddeButton ? 'Nueva Empresa' : 'Editar Empresa'}
                open={createModal}
                onClose={onSetCreateModal}
            >
                <CompanyForm
                    onSetCreateModal={onSetCreateModal}
                    handleSubmit={handleSubmit}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    errors={errors}
                    hiddeButton={hiddeButton}
                    saveUpdate={saveUpdate}
                    cancelUpdate={cancelUpdate}
                />
            </CreateModal>

            <FilterCompanyForm
                onSetCreateModal={onSetCreateModal}
                handleFilter={handleFilter}
            />

            <CompanyTable
                companies={companies}
                loading={loading}
                updatedId={updatedId}
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />
        </Grid>
    );
};

export default CompanyPage;
