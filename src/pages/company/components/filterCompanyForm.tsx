import { Grid, TextField, Button, Tooltip } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useFormik } from "formik";

export const FilterCompanyForm = ({ onSetCreateModal, handleFilter }: any) => {
    const { values, handleChange, handleSubmit, resetForm } = useFormik({
        initialValues: { name: '' },
        onSubmit: ({ name }) => handleFilter(name),
    });

    const handleClear = () => {
        resetForm();
        handleFilter('');
    };

    return (
        <Grid
            component="form"
            onSubmit={handleSubmit}
            sx={{
                bgcolor: 'background.paper',
                borderRadius: 2,
                boxShadow: 10,
                margin: 1,
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
            }}
            item xs={12}
        >
            <TextField
                size="small"
                name="name"
                label="Nombre empresa"
                value={values.name}
                onChange={handleChange}
                sx={{ flexGrow: 1, minWidth: 200, m: 0.5 }}
            />
            <Tooltip title="Buscar">
                <Button variant="outlined" type="submit" size="small" sx={{ minWidth: 40, p: '6px' }}>
                    <SearchIcon fontSize="small" />
                </Button>
            </Tooltip>
            <Tooltip title="Limpiar">
                <Button variant="outlined" color="error" onClick={handleClear} size="small" sx={{ minWidth: 40, p: '6px' }}>
                    <SearchOffIcon fontSize="small" />
                </Button>
            </Tooltip>
            <Button variant="contained" onClick={() => onSetCreateModal(true)} size="small" sx={{ whiteSpace: 'nowrap', mr: 0.5 }}>
                + Nueva Empresa
            </Button>
        </Grid>
    );
};
