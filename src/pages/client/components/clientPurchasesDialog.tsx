import {
    Box, Button, Chip, CircularProgress, Dialog, DialogContent, DialogTitle,
    Divider, FormControl, IconButton, InputAdornment, InputLabel, ListSubheader,
    MenuItem, Pagination, Select, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Typography
} from '@mui/material';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import type { Dayjs } from 'dayjs';
import CloseIcon from '@mui/icons-material/Close';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import FilterListIcon from '@mui/icons-material/FilterList';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { useEffect, useState } from 'react';
import { useSnackbar } from 'notistack';
import { ClientPurchase, PurchaseStatus } from '../../../interfaces/client.interface';
import { Products } from '../../../interfaces/product.interface';
import { ClientService } from '../../../services';
import { ProductService } from '../../../services/product.service';

function formatDate(dateStr: string): string {
    return new Date(dateStr).toLocaleDateString('es-CL', { day: '2-digit', month: 'short', year: 'numeric' });
}


interface Props {
    open: boolean;
    clientId: number;
    clientName: string;
    onClose: () => void;
    onRefresh: () => void;
}

const emptyForm = { productsId: '', quantity: '', unitPrice: '' };
const emptyFilter = { product: '', startDate: '', endDate: '' };

const statusChipProps: Record<string, { label: string; color: 'success' | 'error' }> = {
    FINALIZADO: { label: 'Finalizado', color: 'success' },
    ANULADO:    { label: 'Anulado',    color: 'error'   },
};

const ROWS_PER_PAGE = 5;

export const ClientPurchasesDialog = ({ open, clientId, clientName, onClose, onRefresh }: Props) => {
    const [purchases, setPurchases] = useState<ClientPurchase[]>([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [products, setProducts] = useState<Products[]>([]);
    const [productsLoading, setProductsLoading] = useState(false);
    const [productsError, setProductsError] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [updatingId, setUpdatingId] = useState<number | null>(null);
    const [form, setForm] = useState(emptyForm);
    const [formError, setFormError] = useState('');
    const [filter, setFilter] = useState(emptyFilter);
    const [appliedFilter, setAppliedFilter] = useState(emptyFilter);

    const [purchaseDateVal, setPurchaseDateVal] = useState<Dayjs | null>(null);
    const [startDateVal, setStartDateVal] = useState<Dayjs | null>(null);
    const [endDateVal, setEndDateVal] = useState<Dayjs | null>(null);

    const { enqueueSnackbar } = useSnackbar();

    const loadPurchases = (pg = page, f = appliedFilter) => {
        setLoading(true);
        ClientService.getClientPurchases(clientId, {
            page: pg, limit: ROWS_PER_PAGE,
            product: f.product || undefined,
            startDate: f.startDate || undefined,
            endDate: f.endDate || undefined,
        })
            .then(res => {
                const sorted = [...(res.data ?? [])].sort(
                    (a, b) => new Date(b.purchaseDate).getTime() - new Date(a.purchaseDate).getTime()
                );
                setPurchases(sorted);
                setTotal(res.total ?? 0);
            })
            .catch(() => { setPurchases([]); setTotal(0); })
            .finally(() => setLoading(false));
    };

    useEffect(() => {
        if (!open) return;
        setPage(1);
        setFilter(emptyFilter);
        setAppliedFilter(emptyFilter);
        setForm(emptyForm);
        setFormError('');
        setPurchaseDateVal(null);
        setStartDateVal(null);
        setEndDateVal(null);
        loadPurchases(1, emptyFilter);
        setProductsLoading(true);
        setProductsError('');
        ProductService.getProducts({ page: 1, limit: 100 })
            .then(res => {
                const list = res.data ?? (res as any).products ?? [];
                setProducts(Array.isArray(list) ? list : []);
                if (!Array.isArray(list) || list.length === 0) {
                    setProductsError('No hay productos disponibles');
                }
            })
            .catch((err: Error) => {
                setProducts([]);
                setProductsError(err.message ?? 'Error al cargar productos');
                enqueueSnackbar(`Productos: ${err.message ?? 'Error al cargar'}`, { variant: 'error' });
            })
            .finally(() => setProductsLoading(false));
    }, [open, clientId]);

    const hasPending = purchases.some(p => p.purchaseStatus === 'PENDIENTE');

    const handleRegister = async () => {
        if (hasPending) return setFormError('Debes finalizar o anular la compra pendiente antes de registrar una nueva.');
        const productsId = parseInt(form.productsId);
        const quantity = parseInt(form.quantity);
        const unitPrice = parseFloat(form.unitPrice);
        if (!productsId || productsId <= 0) return setFormError('Selecciona un producto.');
        if (!quantity || quantity <= 0) return setFormError('La cantidad debe ser mayor a 0.');
        if (!unitPrice || unitPrice <= 0) return setFormError('El precio unitario debe ser mayor a 0.');
        if (!purchaseDateVal || !purchaseDateVal.isValid()) return setFormError('Ingresa la fecha de compra.');
        setSaving(true);
        try {
            await ClientService.registerClientPurchase(clientId, {
                productsId, quantity, unitPrice,
                purchaseDate: purchaseDateVal.toISOString(),
            });
            enqueueSnackbar('Compra registrada exitosamente', { variant: 'success' });
            setForm(emptyForm);
            setPurchaseDateVal(null);
            setPage(1);
            loadPurchases(1);
        } catch (err: any) {
            enqueueSnackbar(err.message ?? 'Error al registrar compra', { variant: 'error' });
        } finally {
            setSaving(false);
        }
    };

    const handleUpdateStatus = async (purchaseId: number, status: Exclude<PurchaseStatus, 'PENDIENTE'>) => {
        setUpdatingId(purchaseId);
        try {
            await ClientService.updatePurchaseStatus(clientId, purchaseId, status);
            enqueueSnackbar(status === 'FINALIZADO' ? 'Compra finalizada' : 'Compra anulada', { variant: 'success' });
            loadPurchases(page);
            onRefresh();
        } catch (err: any) {
            enqueueSnackbar(err.message ?? 'Error al actualizar estado', { variant: 'error' });
        } finally {
            setUpdatingId(null);
        }
    };

    const handleApplyFilter = () => {
        setAppliedFilter(filter);
        setPage(1);
        loadPurchases(1, filter);
    };

    const handleClearFilter = () => {
        setFilter(emptyFilter);
        setAppliedFilter(emptyFilter);
        setStartDateVal(null);
        setEndDateVal(null);
        setPage(1);
        loadPurchases(1, emptyFilter);
    };

    const handlePageChange = (_: any, value: number) => {
        setPage(value);
        loadPurchases(value);
    };

    const selectedProduct = products.find(p => p.id === parseInt(form.productsId));
    const purchaseTotal = purchases.reduce((acc, p) => acc + p.quantity * p.unitPrice, 0);
    const totalPages = Math.ceil(total / ROWS_PER_PAGE);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', pb: 1 }}>
                    <Box>
                        <Typography variant="h6" fontWeight={700}>Registro de compras</Typography>
                        <Typography variant="caption" color="text.secondary">{clientName}</Typography>
                    </Box>
                    <IconButton onClick={onClose} size="small"><CloseIcon /></IconButton>
                </DialogTitle>
                <Divider />

                <DialogContent sx={{ pt: 2 }}>

                    {/* ── Formulario de registro ── */}
                    <Box sx={{
                        border: '1px solid', borderColor: 'divider',
                        borderRadius: 2, p: 2, mb: 2,
                    }}>
                        <Typography variant="subtitle2" fontWeight={700} mb={1.5} color="primary">
                            Nueva compra
                        </Typography>

                        {hasPending && (
                            <Typography variant="caption" color="warning.main" display="block" mb={1.5} fontWeight={500}>
                                Hay una compra pendiente. Finaliza o anula antes de registrar una nueva.
                            </Typography>
                        )}

                        {/* Grid 3 columnas iguales */}
                        <Box sx={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 1.5 }}>

                            {/* Fila 1: Producto (2 cols) + Fecha (1 col) */}
                            <FormControl size="small" sx={{ gridColumn: 'span 2' }} disabled={hasPending || productsLoading} error={Boolean(productsError && products.length === 0)}>
                                <InputLabel>
                                    {productsLoading ? 'Cargando productos…' : 'Producto'}
                                </InputLabel>
                                <Select
                                    value={form.productsId}
                                    label={productsLoading ? 'Cargando productos…' : 'Producto'}
                                    onChange={e => { setForm(p => ({ ...p, productsId: e.target.value as string })); setFormError(''); }}
                                    renderValue={() => selectedProduct ? selectedProduct.name : ''}
                                >
                                    {productsLoading
                                        ? <ListSubheader>Cargando…</ListSubheader>
                                        : productsError && products.length === 0
                                            ? <ListSubheader sx={{ color: 'error.main' }}>{productsError}</ListSubheader>
                                            : products.length === 0
                                                ? <ListSubheader>Sin productos disponibles</ListSubheader>
                                                : products.map(p => (
                                                    <MenuItem key={p.id} value={String(p.id)}>
                                                        <Box>
                                                            <Typography variant="body2" fontWeight={500}>{p.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{p.code}</Typography>
                                                        </Box>
                                                    </MenuItem>
                                                ))
                                    }
                                </Select>
                                {productsError && products.length === 0 && (
                                    <Typography variant="caption" color="error" sx={{ mt: 0.5, px: 0.5 }}>
                                        {productsError}
                                    </Typography>
                                )}
                            </FormControl>

                            <DatePicker
                                label="Fecha de compra"
                                format="DD/MM/YYYY"
                                value={purchaseDateVal}
                                disabled={hasPending}
                                onChange={newVal => { setPurchaseDateVal(newVal); setFormError(''); }}
                                slotProps={{ textField: { size: 'small', fullWidth: true } }}
                            />

                            {/* Fila 2: Cantidad + Precio + Botón */}
                            <TextField
                                label="Cantidad" type="number" size="small" fullWidth
                                value={form.quantity}
                                onChange={e => { setForm(p => ({ ...p, quantity: e.target.value })); setFormError(''); }}
                                inputProps={{ min: 1 }}
                                disabled={hasPending}
                            />

                            <TextField
                                label="Precio unitario" size="small" fullWidth
                                type="number"
                                value={form.unitPrice}
                                onChange={e => {
                                    setForm(p => ({ ...p, unitPrice: e.target.value }));
                                    setFormError('');
                                }}
                                inputProps={{ min: 0, step: 'any' }}
                                InputProps={{
                                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                                }}
                                disabled={hasPending}
                            />

                            <Button
                                variant="contained" fullWidth
                                startIcon={saving ? <CircularProgress size={16} color="inherit" /> : <AddShoppingCartIcon />}
                                onClick={handleRegister}
                                disabled={saving || hasPending}
                                sx={{ alignSelf: 'center', height: 40 }}
                            >
                                {saving ? 'Guardando registro...' : 'Registrar compra'}
                            </Button>

                        </Box>

                        {formError && (
                            <Typography variant="caption" color="error" display="block" mt={1}>{formError}</Typography>
                        )}
                    </Box>

                    {/* ── Filtros ── */}
                    <Box sx={{
                        bgcolor: 'action.hover',
                        border: '1px dashed', borderColor: 'divider',
                        borderRadius: 2, p: 1.5, mb: 2,
                    }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                            <FilterListIcon fontSize="small" color="action" />
                            <Typography variant="caption" fontWeight={700} color="text.secondary" textTransform="uppercase" letterSpacing={0.8}>
                                Filtrar historial
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
                            <TextField
                                label="Producto" size="small" sx={{ width: 180 }}
                                value={filter.product}
                                onChange={e => setFilter(f => ({ ...f, product: e.target.value }))}
                            />
                            <DatePicker
                                label="Desde"
                                format="DD/MM/YYYY"
                                value={startDateVal}
                                onChange={newVal => {
                                    setStartDateVal(newVal);
                                    setFilter(f => ({ ...f, startDate: newVal ? newVal.format('YYYY-MM-DD') : '' }));
                                }}
                                slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                            />
                            <DatePicker
                                label="Hasta"
                                format="DD/MM/YYYY"
                                value={endDateVal}
                                onChange={newVal => {
                                    setEndDateVal(newVal);
                                    setFilter(f => ({ ...f, endDate: newVal ? newVal.format('YYYY-MM-DD') : '' }));
                                }}
                                slotProps={{ textField: { size: 'small', sx: { width: 150 } } }}
                            />
                            <Button variant="outlined" size="small" onClick={handleApplyFilter}>Filtrar</Button>
                            <IconButton size="small" onClick={handleClearFilter} title="Limpiar filtros">
                                <SearchOffIcon fontSize="small" />
                            </IconButton>
                        </Box>
                    </Box>

                    {/* ── Historial de compras ── */}
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="subtitle2" fontWeight={600}>
                            Historial de compras{' '}
                            {total > 0 && (
                                <Typography component="span" variant="caption" color="text.secondary">
                                    ({total} total)
                                </Typography>
                            )}
                        </Typography>
                        {purchases.length > 0 && (
                            <Typography variant="caption" color="text.secondary">
                                Total página: <b>${purchaseTotal.toLocaleString('es-CL', { minimumFractionDigits: 2 })}</b>
                            </Typography>
                        )}
                    </Box>

                    {loading ? (
                        <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                        </Box>
                    ) : purchases.length === 0 ? (
                        <Box sx={{ textAlign: 'center', py: 4 }}>
                            <Typography variant="body2" color="text.secondary">
                                No hay compras registradas para este filtro.
                            </Typography>
                        </Box>
                    ) : (
                        <>
                            <TableContainer sx={{ maxHeight: 280 }}>
                                <Table size="small" stickyHeader>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell><b>Producto</b></TableCell>
                                            <TableCell align="center"><b>Cant.</b></TableCell>
                                            <TableCell align="right"><b>P. Unit.</b></TableCell>
                                            <TableCell align="right"><b>Total</b></TableCell>
                                            <TableCell align="center"><b>Fecha compra</b></TableCell>
                                            <TableCell align="center"><b>Estado</b></TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {purchases.map(p => (
                                            <TableRow key={p.id} hover>
                                                <TableCell>
                                                    {p.product
                                                        ? <Box>
                                                            <Typography variant="body2" fontWeight={500}>{p.product.name}</Typography>
                                                            <Typography variant="caption" color="text.secondary">{p.product.code}</Typography>
                                                          </Box>
                                                        : `ID ${p.productsId}`}
                                                </TableCell>
                                                <TableCell align="center">{p.quantity}</TableCell>
                                                <TableCell align="right">${p.unitPrice.toLocaleString('es-CL', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell align="right">${(p.quantity * p.unitPrice).toLocaleString('es-CL', { minimumFractionDigits: 2 })}</TableCell>
                                                <TableCell align="center">{formatDate(p.purchaseDate)}</TableCell>
                                                <TableCell align="center">
                                                    {p.purchaseStatus === 'PENDIENTE' ? (
                                                        <Box sx={{ display: 'flex', gap: 0.5, justifyContent: 'center' }}>
                                                            <Button size="small" variant="contained" color="success"
                                                                startIcon={updatingId === p.id ? <CircularProgress size={12} color="inherit" /> : <CheckCircleOutlineIcon />}
                                                                onClick={() => handleUpdateStatus(p.id, 'FINALIZADO')}
                                                                disabled={updatingId === p.id}
                                                                sx={{ fontSize: '0.7rem', py: 0.3, px: 0.8 }}>
                                                                Finalizar
                                                            </Button>
                                                            <Button size="small" variant="outlined" color="error"
                                                                startIcon={updatingId === p.id ? <CircularProgress size={12} color="inherit" /> : <CancelOutlinedIcon />}
                                                                onClick={() => handleUpdateStatus(p.id, 'ANULADO')}
                                                                disabled={updatingId === p.id}
                                                                sx={{ fontSize: '0.7rem', py: 0.3, px: 0.8 }}>
                                                                Anular
                                                            </Button>
                                                        </Box>
                                                    ) : (
                                                        <Chip
                                                            label={statusChipProps[p.purchaseStatus]?.label ?? p.purchaseStatus}
                                                            color={statusChipProps[p.purchaseStatus]?.color ?? 'default'}
                                                            size="small"
                                                        />
                                                    )}
                                                </TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>

                            {totalPages > 1 && (
                                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1.5 }}>
                                    <Pagination
                                        count={totalPages}
                                        page={page}
                                        onChange={handlePageChange}
                                        size="small"
                                        color="primary"
                                    />
                                </Box>
                            )}
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </LocalizationProvider>
    );
};
