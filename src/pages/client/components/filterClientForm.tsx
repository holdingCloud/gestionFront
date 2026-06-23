import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useState } from "react";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

const STATUS_FILTERS = [
    { value: '', label: 'Todos' },
    { value: 'LLAMAR', label: 'Por llamar' },
    { value: 'VENCIDO', label: 'Vencidos' },
    { value: 'CONTACTADO', label: 'Contactados' },
];

export const FilterClientForm = ({ onSetCreateModal, handleFilter }: any) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [search, setSearch] = useState('');
    const [activeStatus, setActiveStatus] = useState('');
    const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const applyFilter = (name: string, status: string) => {
        handleFilter({ name, address: '', communeId: undefined, status });
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounceRef.current) clearTimeout(debounceRef.current);
        debounceRef.current = setTimeout(() => {
            applyFilter(value, activeStatus);
        }, 400);
    };

    const handleStatusClick = (status: string) => {
        setActiveStatus(status);
        applyFilter(search, status);
    };

    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center',
            gap: 1.5,
            px: '8px',
            pb: '8px',
        }}>
            {/* Search */}
            <TextField
                size="small"
                placeholder="Buscar cliente por nombre..."
                value={search}
                onChange={e => handleSearchChange(e.target.value)}
                InputProps={{
                    startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ fontSize: 18, color: 'text.secondary' }} />
                        </InputAdornment>
                    ),
                }}
                sx={{
                    flexGrow: 1,
                    '& .MuiOutlinedInput-root': {
                        borderRadius: '10px',
                        bgcolor: 'background.paper',
                    },
                }}
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

            {/* New client */}
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
