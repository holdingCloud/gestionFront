import {
    Container,
} from "@mui/material";
import {
    CreateModal,
    DeleteModal,
    DialogModal,
    UrlBreadCrumbs
} from "../../components";
import { useUser } from "./hooks/useUser";
import { UserForm } from "./components/userForm";
import { FilterUserForm } from "./components/filterUserForm";
import { UserTable } from "./components/userTable";

const UserPage = () => {


    const {
        //Propierties
        users,
        page,
        open,
        values,
        count,
        errors,
        touched,
        rowsPerPage,
        openDialog,
        createModal,
        showPassword,
        hiddeButton,
        //Methods
        handleSubmit,
        handleChange,
        handleBlur,
        saveUpdate,
        handleActive,
        handleUpdate,
        cancelUpdate,
        handleClickShowPassword,
        handleChangePage,
        handleChangeRowsPerPage,
        onClose,
        onCloseDialog,
        onSetCreateModal,
        handleDelete,
        handleFilter,
    } = useUser();



    return (
        <Container
            maxWidth={false} disableGutters>

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
                title={'¿Desea Eliminar el usuario?'}
                content={'Con esta acción borrara al usuario de forma permanente'}
                open={open}
                onClose={onClose} />
            <DialogModal
                title={'¡Adevertencia!'}
                content={'Para cambiar la clave del usuario debera digitarla en caso contrario no lo haga para mantener la que ya tiene'}
                open={openDialog}
                onClose={onCloseDialog} />

            <CreateModal
                title={'Crear Usuario'}
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
                    errors={errors}
                    showPassword={showPassword}
                    hiddeButton={hiddeButton}
                    handleClickShowPassword={handleClickShowPassword}
                    saveUpdate={saveUpdate}
                    cancelUpdate={cancelUpdate}
                />
            </CreateModal>
        </Container>

    )
}

export default UserPage;