import { Grid, TextField, Button, Tooltip, MenuItem, Select, FormControl, InputLabel } from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete";
import SearchIcon from '@mui/icons-material/Search';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useFormik } from "formik";
import { useEffect, useState } from "react";
import { LocationService, Commune } from "../../../services";

const VALPARAISO_NAME = 'Región de Valparaíso';

const statusOptions = [
    { value: '', label: 'Todos' },
    { value: 'LLAMAR', label: 'Por llamar' },
    { value: 'CONTACTADO', label: 'Contactado' },
    { value: 'VENCIDO', label: 'Vencido' },
];

export const FilterClientForm = ({ onSetCreateModal, handleFilter }: any) => {
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);

    useEffect(() => {
        LocationService.getRegions()
            .then(regions => {
                const valp = regions.find(r => r.name === VALPARAISO_NAME);
                return valp ? LocationService.getCommunesByRegion(valp.id) : [];
            })
            .then(setCommunes)
            .catch(() => {});
    }, []);

    const { handleSubmit, values, handleChange, resetForm, setFieldValue } = useFormik({
        initialValues: { name: '', address: '', communeId: undefined as number | undefined, status: '' },
        onSubmit: ({ name, address, communeId, status }) => {
            handleFilter({ name, address, communeId, status });
        },
    });

    const handleClear = () => {
        resetForm();
        setSelectedCommune(null);
        handleFilter({ name: '', address: '', communeId: undefined, status: '' });
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
                sx={{ flexGrow: 1, minWidth: 150, m: 0.5 }}
            />

            <TextField
                size="small"
                name="address"
                label="Dirección"
                value={values.address}
                onChange={handleChange}
                sx={{ flexGrow: 1, minWidth: 150, m: 0.5 }}
            />

            <Autocomplete
                size="small"
                options={communes}
                getOptionLabel={(o) => o.name}
                value={selectedCommune}
                isOptionEqualToValue={(o, v) => o.id === v.id}
                onChange={(_, newVal) => {
                    setSelectedCommune(newVal);
                    setFieldValue('communeId', newVal?.id ?? undefined);
                }}
                renderInput={(params) => (
                    <TextField {...params} label="Comuna" />
                )}
                sx={{ flexGrow: 1, minWidth: 180, m: 0.5 }}
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
