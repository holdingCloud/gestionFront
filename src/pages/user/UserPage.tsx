import { Container } from "@mui/material";
import { CreateModal, DeleteModal, UrlBreadCrumbs } from "../../components";
import { useUser } from "./hooks/useUser";
import { UserForm } from "./components/userForm";
import { FilterUserForm } from "./components/filterUserForm";
import { UserTable } from "./components/userTable";

const UserPage = () => {

    const {
        users,
        page,
        open,
        values,
        count,
        errors,
        touched,
        rowsPerPage,
        createModal,
        showPassword,
        hiddeButton,
        roles,
        handleSubmit,
        handleChange,
        handleBlur,
        setFieldValue,
        saveUpdate,
        handleActive,
        handleUpdate,
        cancelUpdate,
        handleClickShowPassword,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onSetCreateModal,
        handleDelete,
        handleFilter,
    } = useUser();

    return (
        <Container maxWidth={false} disableGutters>

            <UrlBreadCrumbs />

            <FilterUserForm
                handleFilter={handleFilter}
                onSetCreateModal={onSetCreateModal}
            />

            <UserTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                users={users}
                handleActive={handleActive}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />

            <DeleteModal
                title="¿Desea eliminar el usuario?"
                content="Con esta acción borrará al usuario de forma permanente"
                open={open}
                onClose={onClose}
            />

            <CreateModal
                title={hiddeButton ? 'Crear Usuario' : 'Editar Usuario'}
                open={createModal}
                onClose={onSetCreateModal}
            >
                <UserForm
                    onSetCreateModal={onSetCreateModal}
                    handleSubmit={handleSubmit}
                    values={values}
                    touched={touched}
                    handleChange={handleChange}
                    handleBlur={handleBlur}
                    setFieldValue={setFieldValue}
                    errors={errors}
                    showPassword={showPassword}
                    hiddeButton={hiddeButton}
                    handleClickShowPassword={handleClickShowPassword}
                    saveUpdate={saveUpdate}
                    cancelUpdate={cancelUpdate}
                    roles={roles}
                />
            </CreateModal>

        </Container>
    );
};

export default UserPage;
