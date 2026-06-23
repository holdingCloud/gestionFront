import {
    Box, DialogContent, DialogActions, Button, TextField,
    CircularProgress, Divider, Typography
} from "@mui/material"
import Autocomplete from "@mui/material/Autocomplete";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import PlaceOutlinedIcon from "@mui/icons-material/PlaceOutlined";
import TuneOutlinedIcon from "@mui/icons-material/TuneOutlined";
import { useEffect, useState } from "react";
import { LocationService, Region, Commune } from "../../../services";

const VALPARAISO_NAME = 'Región de Valparaíso';

const formatChileanPhone = (raw: string): string => {
    let digits = raw.replace(/\D/g, '');
    if (digits.startsWith('569')) digits = digits.slice(2);
    else if (digits.startsWith('56')) digits = digits.slice(2);
    digits = digits.slice(0, 9);
    if (!digits) return '';
    const first = digits[0];
    const rest = digits.slice(1);
    if (!rest) return `+56 ${first}`;
    return `+56 ${first} ${rest}`;
};

const SectionLabel = ({ icon, label }: { icon: React.ReactNode; label: string }) => (
    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75, mb: 1.5, mt: 0.5 }}>
        {icon}
        <Typography variant="caption" fontWeight={700} color="text.secondary" letterSpacing={0.8} textTransform="uppercase">
            {label}
        </Typography>
        <Divider sx={{ flex: 1 }} />
    </Box>
);

export const ClientForm = ({
    onSetCreateModal,
    handleSubmit,
    values,
    touched,
    handleChange,
    handleBlur,
    setFieldValue,
    errors,
    hiddeButton,
    saveUpdate,
    cancelUpdate,
    companies,
    isSaving,
}: any) => {
    const [regions, setRegions] = useState<Region[]>([]);
    const [valparaisoRegion, setValparaisoRegion] = useState<Region | null>(null);
    const [communes, setCommunes] = useState<Commune[]>([]);
    const [selectedCommune, setSelectedCommune] = useState<Commune | null>(null);
    const [loadingCommunes, setLoadingCommunes] = useState(false);

    useEffect(() => {
        LocationService.getRegions().then(data => {
            setRegions(data);
            const valp = data.find(r => r.name === VALPARAISO_NAME) ?? null;
            setValparaisoRegion(valp);
            if (valp) {
                setLoadingCommunes(true);
                LocationService.getCommunesByRegion(valp.id)
                    .then(setCommunes)
                    .catch(() => setCommunes([]))
                    .finally(() => setLoadingCommunes(false));
            }
        }).catch(() => setRegions([]));
    }, []);

    useEffect(() => {
        if (!values.communeId || communes.length === 0) {
            setSelectedCommune(null);
            return;
        }
        const match = communes.find(c => c.id === Number(values.communeId)) ?? null;
        setSelectedCommune(match);
    }, [values.communeId, communes]);

    const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFieldValue('phone', formatChileanPhone(e.target.value));
    };

    return (
        <Box component="form" onSubmit={handleSubmit} noValidate autoComplete="off">
            <DialogContent sx={{ pt: 2, pb: 1, px: 3 }}>

                {/* ── Datos de contacto ── */}
                <SectionLabel icon={<PersonOutlineIcon fontSize="small" color="action" />} label="Datos de contacto" />

                <TextField
                    fullWidth size="small" name="fullname" label="Nombre completo"
                    value={values.fullname} onChange={handleChange} onBlur={handleBlur}
                    error={touched.fullname && Boolean(errors.fullname)}
                    helperText={touched.fullname && errors.fullname}
                    sx={{ mb: 2 }}
                />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth size="small" name="email" label="Email"
                        value={values.email} onChange={handleChange} onBlur={handleBlur}
                        error={touched.email && Boolean(errors.email)}
                        helperText={touched.email && errors.email}
                    />
                    <TextField
                        fullWidth size="small" name="phone" label="Teléfono"
                        placeholder="+56 9 XXXXXXXX"
                        value={values.phone}
                        onChange={handlePhoneChange}
                        onBlur={handleBlur}
                        error={touched.phone && Boolean(errors.phone)}
                        helperText={(touched.phone && errors.phone) || 'Ej: +56 9 95720483'}
                        inputProps={{ maxLength: 15 }}
                    />
                </Box>

                <Autocomplete
                    size="small"
                    options={companies ?? []}
                    getOptionLabel={(o: any) => o.name}
                    value={(companies ?? []).find((c: any) => c.id === Number(values.companyId)) ?? null}
                    isOptionEqualToValue={(o: any, v: any) => o.id === v.id}
                    onChange={(_: any, newVal: any) => setFieldValue('companyId', newVal?.id ?? '')}
                    renderInput={(params) => (
                        <TextField {...params} label="Empresa" helperText="Opcional" />
                    )}
                    sx={{ mb: 2 }}
                />

                {/* ── Ubicación ── */}
                <SectionLabel icon={<PlaceOutlinedIcon fontSize="small" color="action" />} label="Ubicación" />

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <Autocomplete
                        size="small"
                        options={regions}
                        getOptionLabel={(o) => o.name}
                        value={valparaisoRegion}
                        disabled
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        renderInput={(params) => (
                            <TextField {...params} label="Región" helperText="Fijada en Valparaíso" />
                        )}
                    />
                    <Autocomplete
                        size="small"
                        options={communes}
                        getOptionLabel={(o) => o.name}
                        value={selectedCommune}
                        loading={loadingCommunes}
                        isOptionEqualToValue={(o, v) => o.id === v.id}
                        onChange={(_, newVal) => {
                            setSelectedCommune(newVal);
                            setFieldValue('communeId', newVal?.id ?? '');
                        }}
                        renderInput={(params) => (
                            <TextField
                                {...params}
                                label="Comuna"
                                helperText="Busca escribiendo"
                                InputProps={{
                                    ...params.InputProps,
                                    endAdornment: (
                                        <>
                                            {loadingCommunes && <CircularProgress size={14} />}
                                            {params.InputProps.endAdornment}
                                        </>
                                    ),
                                }}
                            />
                        )}
                    />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth size="small" name="calle" label="Calle"
                        value={values.calle} onChange={handleChange} onBlur={handleBlur}
                        error={touched.calle && Boolean(errors.calle)}
                        helperText={(touched.calle && errors.calle) || 'Nombre de la calle'}
                    />
                    <TextField
                        size="small" name="numero" label="Número"
                        value={values.numero ?? ''}
                        onChange={handleChange} onBlur={handleBlur}
                        helperText="Opcional"
                        sx={{ width: 110 }}
                    />
                </Box>

                <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 2, mb: 2 }}>
                    <TextField
                        fullWidth size="small" name="departamento" label="Depto / Oficina"
                        value={values.departamento ?? ''}
                        onChange={handleChange} onBlur={handleBlur}
                        helperText="Opcional"
                    />
                    <TextField
                        fullWidth size="small" name="referencia" label="Referencia"
                        value={values.referencia ?? ''}
                        onChange={handleChange} onBlur={handleBlur}
                        helperText="Opcional"
                    />
                </Box>

                {/* ── Configuración ── */}
                <SectionLabel icon={<TuneOutlinedIcon fontSize="small" color="action" />} label="Configuración" />
                <Box sx={{ maxWidth: '50%' }}>
                    <TextField
                        fullWidth size="small" name="frequency" label="Frecuencia (días)"
                        type="number"
                        value={values.frequency ?? ''}
                        onChange={handleChange} onBlur={handleBlur}
                        inputProps={{ min: 1 }}
                        helperText="Opcional — días estimados entre compras"
                    />
                </Box>

            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, pt: 1 }}>
                <Button variant="outlined" onClick={() => { onSetCreateModal(false); cancelUpdate(); }} disabled={isSaving}>
                    Cancelar
                </Button>
                {hiddeButton
                    ? (
                        <Button variant="contained" type="submit" color="primary" disabled={isSaving}
                            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                        >
                            {isSaving ? 'Guardando registro...' : 'Guardar'}
                        </Button>
                    ) : (
                        <Button variant="contained" type="button" color="info" onClick={saveUpdate} disabled={isSaving}
                            startIcon={isSaving ? <CircularProgress size={16} color="inherit" /> : undefined}
                        >
                            {isSaving ? 'Guardando registro...' : 'Guardar cambios'}
                        </Button>
                    )
                }
            </DialogActions>
        </Box>
    );
};
