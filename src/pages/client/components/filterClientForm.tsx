import { Box, TextField, Button, InputAdornment, Autocomplete } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import LocationOnOutlinedIcon from '@mui/icons-material/LocationOnOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';
import { useRef, useState } from "react";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

const STATUS_FILTERS = [
    { value: '', label: 'Todos' },
    { value: 'NUEVO', label: 'Nuevos' },
    { value: 'LLAMAR', label: 'Por llamar' },
    { value: 'VENCIDO', label: 'Vencidos' },
    { value: 'CONTACTADO', label: 'Contactados' },
];

export const FilterClientForm = ({ onSetCreateModal, handleFilter, companies }: any) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [name, setName] = useState('');
    const [address, setAddress] = useState('');
    const [selectedCompany, setSelectedCompany] = useState<any>(null);
    const [activeStatus, setActiveStatus] = useState('');

    const nameDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);
    const addressDebounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    const apply = (n: string, addr: string, status: string, companyId?: number) => {
        handleFilter({ name: n, address: addr, status, companyId });
    };

    const handleNameChange = (value: string) => {
        setName(value);
        if (nameDebounce.current) clearTimeout(nameDebounce.current);
        nameDebounce.current = setTimeout(() => {
            apply(value, address, activeStatus, selectedCompany?.id);
        }, 400);
    };

    const handleAddressChange = (value: string) => {
        setAddress(value);
        if (addressDebounce.current) clearTimeout(addressDebounce.current);
        addressDebounce.current = setTimeout(() => {
            apply(name, value, activeStatus, selectedCompany?.id);
        }, 400);
    };

    const handleCompanyChange = (_: any, newVal: any) => {
        setSelectedCompany(newVal);
        apply(name, address, activeStatus, newVal?.id);
    };

    const handleStatusClick = (status: string) => {
        setActiveStatus(status);
        apply(name, address, status, selectedCompany?.id);
    };

    const inputSx = {
        '& .MuiOutlinedInput-root': {
            borderRadius: '10px',
            bgcolor: 'background.paper',
        },
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: '8px',
            pb: '8px',
            flexWrap: 'wrap',
        }}>
            {/* Nombre */}
            <TextField
                size="small"
                placeholder="Buscar por nombre..."
                value={name}
                onChange={e => handleNameChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{ flex: '1 1 160px', minWidth: 140, ...inputSx }}
            />

            {/* Dirección */}
            <TextField
                size="small"
                placeholder="Buscar por dirección..."
                value={address}
                onChange={e => handleAddressChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <LocationOnOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{ flex: '1 1 160px', minWidth: 140, ...inputSx }}
            />

            {/* Empresa */}
            <Autocomplete
                size="small"
                options={companies ?? []}
                getOptionLabel={(o: any) => o.name ?? ''}
                value={selectedCompany}
                onChange={handleCompanyChange}
                isOptionEqualToValue={(o: any, v: any) => o.id === v.id}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        placeholder="Filtrar por empresa..."
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <>
                                    <InputAdornment position="start">
                                        <BusinessOutlinedIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                                    </InputAdornment>
                                    {params.InputProps.startAdornment}
                                </>
                            ),
                        }}
                    />
                )}
                sx={{ flex: '1 1 160px', minWidth: 140, ...inputSx }}
            />

            {/* Status pills */}
            <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0 }}>
                {STATUS_FILTERS.map(opt => {
                    const isActive = activeStatus === opt.value;
                    return (
                        <Button
                            key={opt.value}
                            size="small"
                            variant={isActive ? 'contained' : 'outlined'}
                            onClick={() => handleStatusClick(opt.value)}
                            disableElevation
                            sx={{
                                borderRadius: '20px',
                                textTransform: 'none',
                                fontWeight: isActive ? 700 : 500,
                                fontSize: '13px',
                                px: 2,
                                py: '5px',
                                whiteSpace: 'nowrap',
                                ...(isActive ? {
                                    bgcolor: '#0e9f8c',
                                    borderColor: '#0e9f8c',
                                    '&:hover': { bgcolor: '#0b8a79' },
                                } : {
                                    color: 'text.primary',
                                    borderColor: t.border,
                                    '&:hover': { borderColor: '#0e9f8c', color: '#0e9f8c', bgcolor: 'transparent' },
                                }),
                            }}
                        >
                            {opt.label}
                        </Button>
                    );
                })}
            </Box>

            {/* Nuevo cliente */}
            <Button
                variant="contained"
                onClick={() => onSetCreateModal(true)}
                disableElevation
                sx={{
                    borderRadius: '10px',
                    textTransform: 'none',
                    fontWeight: 700,
                    fontSize: '13px',
                    px: 2.5,
                    py: '7px',
                    whiteSpace: 'nowrap',
                    bgcolor: '#0e9f8c',
                    '&:hover': { bgcolor: '#0b8a79' },
                    flexShrink: 0,
                }}
            >
                + Nuevo cliente
            </Button>
        </Box>
    );
};
