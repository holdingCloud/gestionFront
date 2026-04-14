import { Container } from "@mui/material";
import { CreateModal, DeleteModal, UrlBreadCrumbs } from "../../components";


import { EmployeeTable } from "./components/employeeTable";
import { FilterEmployeeForm } from "./components/filterEmployeeForm";
import { EmployeeForm } from "./components/employeeForm";
import { useEmployee } from "./hooks/useEmployee";



export const EmployeePage = () => {

    const {
        //Properties
        employees,
        page,
        open,
        count,
        rowsPerPage,
        values,
        errors,
        touched,
        hiddeButton,
        //Methods
        saveUpdate,
        cancelUpdate,
        createModal,
        handleSubmit,
        handleBlur,
        handleChange,
        handleFilter,
        handleChangePage,
        handleChangeRowsPerPage,
        handleUpdate,
        handleActive,
        handleDelete,
        onSetCreateModal,
        setFieldValue,
        onClose
    } = useEmployee();


    return (
        <Container
            maxWidth={false} disableGutters>

            <UrlBreadCrumbs />

            <FilterEmployeeForm
                handleFilter={handleFilter}
                onSetCreateModal={onSetCreateModal}

            />

            <EmployeeTable
                count={count}
                page={page}
                rowsPerPage={rowsPerPage}
                handleChangePage={handleChangePage}
                handleChangeRowsPerPage={handleChangeRowsPerPage}
                data={employees}
                handleActive={handleActive}
                handleUpdate={handleUpdate}
                handleDelete={handleDelete}
            />

            <DeleteModal
                title={'¿Desea Eliminar al empleoado?'}
                content={'Con esta acción borrara al emeplado de forma permanente'}
                open={open}
                onClose={onClose} />

            <CreateModal
                title={'Crear Empleado'}
                open={createModal}
                onClose={onSetCreateModal}
            >
                <EmployeeForm
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
                    setFieldValue={setFieldValue}
                />
            </CreateModal>

        </Container>
    )
}


export default EmployeePage;