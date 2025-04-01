import { Grid, TextField, Button, Tooltip } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useFormik } from "formik";

export const FilterEmployeeForm = ({ onSetCreateModal, handleFilter }: any) => {

    const {
        handleSubmit,
        errors,
        touched,
        values,
        handleBlur,
        handleChange,
        resetForm,
    } = useFormik({
        initialValues: {
            fullName: '',
            email: '',
        },
        onSubmit: ({ fullName, email }) => {
            handleFilter(fullName, email);
        },
        /* validationSchema: Yup.object({
             fullName: Yup.string().required('Requerido'),
             email: Yup.string().email('debe ser un email valido').required('Requerido')
         })*/
    });

    const handleClear = () => {
        resetForm();
        handleFilter('', '');
    }



    return (
        <Grid
            component="form"
            onSubmit={handleSubmit}
            sx={{
                bgcolor: '#FFF',
                borderRadius: 2,
                boxShadow: 10,
                borderColor: '#ccc',
                margin: 1,
                padding: 2,
                display: 'flex',
                justifyContent: 'center',
                '& .MuiTextField-root': {
                    m: 1,
                    width: '20ch',
                },
                '& .MuiButton-root': {
                    m: 1,
                },
            }}
            item={true}
            xs={12} sm={12} md={12} lg={12}

        >


            <TextField
                fullWidth
                size="small"
                name="fullName"
                label="Nombre completo"
                value={values.fullName}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.fullName && Boolean(errors.fullName)}
                helperText={touched.fullName && errors.fullName}

            />

            <TextField
                fullWidth
                size="small"
                name="email"
                label="Email"
                value={values.email}
                onChange={handleChange}
                onBlur={handleBlur}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}

            />
            <Tooltip title="Buscar" sx={{ cursor: "pointer" }} >
                <Button variant="outlined" type="submit"><SearchIcon /> </Button>
            </Tooltip>
            <Tooltip title="Limpiar" sx={{ cursor: "pointer" }} >
                <Button variant="outlined" color="error" onClick={handleClear}><SearchOffIcon /> </Button>
            </Tooltip>

            <Button variant="contained" onClick={() => onSetCreateModal(true)}>Crear Empleado</Button>
        </Grid>
    )
}

