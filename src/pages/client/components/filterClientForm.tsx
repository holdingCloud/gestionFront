import { Grid, TextField, Button, Tooltip, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useFormik } from "formik";

const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'LLAMAR', label: 'Por llamar' },
    { value: 'CONTACTADO', label: 'Contactado' },
    { value: 'VENCIDO', label: 'Vencido' },
];

export const FilterClientForm = ({ onSetCreateModal, handleFilter }: any) => {

    const { handleSubmit, values, handleChange, resetForm, setFieldValue } = useFormik({
        initialValues: { name: '', city: '', status: '' },
        onSubmit: ({ name, city, status }) => {
            handleFilter({ name, city, status });
        },
    });

    const handleClear = () => {
        resetForm();
        handleFilter({ name: '', city: '', status: '' });
    };

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
                padding: 1,
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                flexWrap: 'wrap',
            }}
            item={true}
            xs={12}
        >
            <TextField
                size="small"
                name="name"
                label="Nombre"
                value={values.name}
                onChange={handleChange}
                sx={{ flexGrow: 1, minWidth: 160, m: 0.5 }}
            />

            <TextField
                size="small"
                name="city"
                label="Ciudad"
                value={values.city}
                onChange={handleChange}
                sx={{ flexGrow: 1, minWidth: 160, m: 0.5 }}
            />

            <FormControl size="small" sx={{ minWidth: 160, m: 0.5 }}>
                <InputLabel>Estado</InputLabel>
                <Select
                    name="status"
                    value={values.status}
                    label="Estado"
                    onChange={(e) => setFieldValue('status', e.target.value)}
                >
                    {statusOptions.map(opt => (
                        <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
                    ))}
                </Select>
            </FormControl>

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
                + Nuevo Cliente
            </Button>
        </Grid>
    );
};
