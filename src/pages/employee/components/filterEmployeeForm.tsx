import { Box, TextField, Button, InputAdornment } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useRef, useState } from "react";
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';

const DEPT_FILTERS = [
    { value: '', label: 'Todos' },
    { value: 'ADMINISTRADOR', label: 'Administración' },
    { value: 'COMUN', label: 'Operaciones' },
    { value: 'REPARTIDOR', label: 'Distribución' },
];

export const FilterEmployeeForm = ({ onSetCreateModal, handleFilter }: any) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [search, setSearch] = useState('');
    const [activeDept, setActiveDept] = useState('');
    const debounce = useRef<ReturnType<typeof setTimeout> | null>(null);

    const apply = (s: string, dept: string) => {
        handleFilter(s, dept);
    };

    const handleSearchChange = (value: string) => {
        setSearch(value);
        if (debounce.current) clearTimeout(debounce.current);
        debounce.current = setTimeout(() => apply(value, activeDept), 400);
    };

    const handleDeptClick = (dept: string) => {
        setActiveDept(dept);
        apply(search, dept);
    };

    return (
        <Box sx={{
            display: 'flex', alignItems: 'center', gap: 1.5,
            px: '8px', pb: '8px', flexWrap: 'wrap',
        }}>
            {/* Search */}
            <TextField
                size="small"
                placeholder="Buscar por nombre o RUT..."
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
                    flex: '1 1 200px', minWidth: 160,
                    '& .MuiOutlinedInput-root': { borderRadius: '10px', bgcolor: 'background.paper' },
                }}
            />

            {/* Dept pills */}
            <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, flexWrap: 'wrap' }}>
                {DEPT_FILTERS.map(opt => {
                    const isActive = activeDept === opt.value;
                    return (
                        <Button
                            key={opt.value}
                            size="small"
                            variant={isActive ? 'contained' : 'outlined'}
                            onClick={() => handleDeptClick(opt.value)}
                            disableElevation
                            sx={{
                                borderRadius: '20px', textTransform: 'none',
                                fontWeight: isActive ? 700 : 500, fontSize: '13px',
                                px: 2, py: '5px', whiteSpace: 'nowrap',
                                ...(isActive ? {
                                    bgcolor: t.primary, borderColor: t.primary,
                                    '&:hover': { bgcolor: t.primaryDark },
                                } : {
                                    color: 'text.primary', borderColor: t.border,
                                    '&:hover': { borderColor: t.primary, color: t.primary, bgcolor: 'transparent' },
                                }),
                            }}
                        >
                            {opt.label}
                        </Button>
                    );
                })}
            </Box>

            {/* New employee */}
            <Button
                variant="contained"
                onClick={() => onSetCreateModal(true)}
                disableElevation
                sx={{
                    borderRadius: '10px', textTransform: 'none', fontWeight: 700,
                    fontSize: '13px', px: 2.5, py: '7px', whiteSpace: 'nowrap',
                    bgcolor: t.primary, '&:hover': { bgcolor: t.primaryDark }, flexShrink: 0,
                }}
            >
                + Nuevo empleado
            </Button>
        </Box>
    );
};
