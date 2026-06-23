import { useEffect, useState } from 'react';
import {
    Dialog, DialogTitle, DialogContent, DialogActions,
    Button, Box, CircularProgress, Typography,
} from '@mui/material';
import { useThemeStore, THEME_TOKENS } from '../../../store/theme/theme.store';
import { RolConModulos, ModuloType } from '../../../interfaces';

const ALL_MODULOS: ModuloType[] = [
    'DASHBOARD', 'USUARIOS', 'CLIENTES', 'RRHH',
    'INVENTARIO', 'COMPRAS', 'PROVEEDORES', 'CUENTAS',
    'HOJA_DE_VENTA', 'REPORTES', 'EMPRESAS',
];

const MODULO_LABELS: Record<ModuloType, string> = {
    DASHBOARD:     'Dashboard',
    USUARIOS:      'Usuarios',
    CLIENTES:      'Clientes',
    RRHH:          'RRHH',
    INVENTARIO:    'Inventario',
    COMPRAS:       'Compras',
    PROVEEDORES:   'Proveedores',
    CUENTAS:       'Cuentas',
    HOJA_DE_VENTA: 'Hoja de Venta',
    REPORTES:      'Reportes',
    EMPRESAS:      'Empresas',
};

interface ModulosDialogProps {
    open: boolean;
    onClose: () => void;
    rol: RolConModulos | null;
    onSave: (modulos: ModuloType[]) => Promise<void>;
    saving: boolean;
}

export const ModulosDialog = ({ open, onClose, rol, onSave, saving }: ModulosDialogProps) => {
    const themeVariant = useThemeStore(state => state.theme);
    const t = THEME_TOKENS[themeVariant];

    const [selected, setSelected] = useState<ModuloType[]>([]);

    useEffect(() => {
        if (open && rol) {
            setSelected(rol.modulos.map(m => m.modulo));
        }
    }, [open, rol]);

    const toggle = (modulo: ModuloType) => {
        setSelected(prev =>
            prev.includes(modulo) ? prev.filter(m => m !== modulo) : [...prev, modulo]
        );
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ fontWeight: 700, fontSize: '16px', pb: 0.5 }}>
                Gestionar módulos
                {rol && (
                    <Typography component="span" sx={{ fontWeight: 400, fontSize: '14px', color: 'text.secondary', ml: 1 }}>
                        — {rol.type}
                    </Typography>
                )}
            </DialogTitle>

            <DialogContent sx={{ pt: 2 }}>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary', mb: 2 }}>
                    Selecciona los módulos del sistema a los que tendrá acceso este rol.
                </Typography>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1.5 }}>
                    {ALL_MODULOS.map(modulo => {
                        const isSelected = selected.includes(modulo);
                        return (
                            <Box
                                key={modulo}
                                onClick={() => toggle(modulo)}
                                sx={{
                                    px: 2, py: 0.8,
                                    borderRadius: '10px',
                                    border: `1.5px solid ${isSelected ? t.primary : t.border}`,
                                    bgcolor: isSelected ? `${t.primary}22` : 'transparent',
                                    color: isSelected ? t.primary : 'text.secondary',
                                    fontWeight: isSelected ? 700 : 400,
                                    fontSize: '13px',
                                    cursor: 'pointer',
                                    userSelect: 'none',
                                    transition: 'all .15s',
                                    '&:hover': {
                                        border: `1.5px solid ${t.primary}`,
                                        bgcolor: `${t.primary}11`,
                                    },
                                }}
                            >
                                {MODULO_LABELS[modulo]}
                            </Box>
                        );
                    })}
                </Box>
                <Typography sx={{ fontSize: '12px', color: 'text.secondary', mt: 2 }}>
                    {selected.length} de {ALL_MODULOS.length} módulos seleccionados
                </Typography>
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 2, gap: 1 }}>
                <Button
                    variant="outlined"
                    onClick={onClose}
                    disabled={saving}
                    sx={{ borderRadius: '10px', textTransform: 'none', fontWeight: 600 }}
                >
                    Cancelar
                </Button>
                <Button
                    variant="contained"
                    disableElevation
                    onClick={() => onSave(selected)}
                    disabled={saving}
                    sx={{
                        borderRadius: '10px', textTransform: 'none', fontWeight: 700,
                        bgcolor: '#2f6df6', '&:hover': { bgcolor: '#2560e0' },
                        minWidth: 100,
                    }}
                >
                    {saving ? <CircularProgress size={18} sx={{ color: '#fff' }} /> : 'Guardar'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};
