import { Grid, TextField, Button, Tooltip, Box } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useFormik } from "formik";
import { useThemeStore, THEME_TOKENS } from "../../../store/theme/theme.store";

export const FilterUserForm = ({ onSetCreateModal, handleFilter, activeCount = 0, onlyOnline = false, toggleOnlyOnline }: any) => {

    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

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
                bgcolor: 'background.paper',
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

            {/* Contador de usuarios en sesión (global) */}
            <Box sx={{
                display: 'inline-flex', alignItems: 'center', gap: '7px',
                px: 1.5, m: 1, borderRadius: '10px',
                bgcolor: `${t.success}18`, border: `1.5px solid ${t.success}44`,
                color: t.success, fontSize: '13px', fontWeight: 700, whiteSpace: 'nowrap',
            }}>
                <Box sx={{
                    width: 8, height: 8, borderRadius: '50%', bgcolor: t.success,
                    boxShadow: `0 0 0 3px ${t.success}30`,
                }} />
                {activeCount} en sesión
            </Box>

            {/* Filtro: solo usuarios en sesión (página actual) */}
            <Tooltip title="Mostrar solo usuarios en sesión (página actual)" sx={{ cursor: "pointer" }}>
                <Button
                    variant={onlyOnline ? "contained" : "outlined"}
                    color="success"
                    onClick={toggleOnlyOnline}
                    sx={{ textTransform: 'none', fontWeight: 700 }}
                >
                    Solo en sesión
                </Button>
            </Tooltip>

            <Button variant="contained" onClick={() => onSetCreateModal(true)}>Crear Usuario</Button>
        </Grid>
    )
}

