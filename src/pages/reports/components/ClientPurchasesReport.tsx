import { useEffect } from 'react';
import {
    Box,
    Button,
    CircularProgress,
    FormControl,
    Grid,
    InputLabel,
    Link,
    MenuItem,
    Select,
    SelectChangeEvent,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Tooltip,
    Typography,
} from '@mui/material';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import dayjs from 'dayjs';
import { DataTable } from '../../../components';
import { useClientPurchasesReport } from '../hooks/useClientPurchasesReport';
import { CompanySelect } from './CompanySelect';

const formatCLP = (v: number) =>
    new Intl.NumberFormat('es-CL', { style: 'currency', currency: 'CLP', maximumFractionDigits: 0 }).format(v);

const formatAvg = (v: number | null) => (v == null ? '-' : v.toFixed(1));

const buildWhatsAppUrl = (phone: string) => {
    const digits = phone.replace(/\D/g, '');
    const number = digits.startsWith('56') ? digits : `56${digits}`;
    return `https://wa.me/${number}?text=${encodeURIComponent('Hola')}`;
};

const cellSx = { px: 1, py: 0.75 };

export const ClientPurchasesReport = () => {
    const {
        data, loading,
        startDate, setStartDate,
        endDate, setEndDate,
        orderBy, setOrderBy,
        companyId, setCompanyId,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    } = useClientPurchasesReport();

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const paginated = data.slice(page * rowsPerPage, (page + 1) * rowsPerPage);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Box>
                <Grid container spacing={2} sx={{ mb: 3 }} alignItems="center">
                    <Grid item xs={12} sm={4} md={3}>
                        <DatePicker
                            label="Desde"
                            value={startDate ? dayjs(startDate) : null}
                            onChange={val => { if (val?.isValid()) setStartDate(val.format('YYYY-MM-DD')); }}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={3}>
                        <DatePicker
                            label="Hasta"
                            value={endDate ? dayjs(endDate) : null}
                            onChange={val => { if (val?.isValid()) setEndDate(val.format('YYYY-MM-DD')); }}
                            slotProps={{ textField: { size: 'small', fullWidth: true } }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <FormControl fullWidth size="small">
                            <InputLabel>Ordenar por</InputLabel>
                            <Select
                                value={orderBy}
                                onChange={(e: SelectChangeEvent) => setOrderBy(e.target.value as 'frequency' | 'purchases' | 'amount')}
                                label="Ordenar por"
                            >
                                <MenuItem value="amount">Monto</MenuItem>
                                <MenuItem value="purchases">Compras</MenuItem>
                                <MenuItem value="frequency">Frecuencia</MenuItem>
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <CompanySelect value={companyId} onChange={setCompanyId} />
                    </Grid>
                    <Grid item xs={12} sm={4} md={2}>
                        <Button variant="contained" onClick={fetchData} disabled={loading} fullWidth>
                            Aplicar
                        </Button>
                    </Grid>
                </Grid>

                {loading ? (
                    <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid
                        sx={{ bgcolor: 'background.paper', borderRadius: 2, boxShadow: 3, margin: 0, padding: 2 }}
                        item xs={12}
                    >
                        <DataTable
                            count={data.length}
                            page={page}
                            rowsPerPage={rowsPerPage}
                            handleChangePage={handleChangePage}
                            handleChangeRowsPerPage={handleChangeRowsPerPage}
                        >
                            <TableHead>
                                <TableRow>
                                    <TableCell sx={cellSx}>Cliente</TableCell>
                                    <TableCell sx={cellSx}>Comuna</TableCell>
                                    <TableCell sx={cellSx}>Teléfono</TableCell>
                                    <TableCell sx={cellSx} align="right">Compras</TableCell>
                                    <TableCell sx={cellSx} align="right">Frec. prom. (días)</TableCell>
                                    <TableCell sx={cellSx} align="right">Monto total</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {paginated.length > 0 ? paginated.map(row => (
                                    <TableRow key={row.clientId}>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2" noWrap sx={{ maxWidth: 180 }}>{row.clientName}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            <Typography variant="body2">{row.communeName}</Typography>
                                        </TableCell>
                                        <TableCell sx={cellSx}>
                                            {row.phone ? (
                                                <Tooltip title={`Enviar WhatsApp a ${row.phone}`}>
                                                    <Link
                                                        href={buildWhatsAppUrl(row.phone)}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        underline="hover"
                                                        sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: '#25D366' }}
                                                    >
                                                        <WhatsAppIcon fontSize="small" />
                                                        <Typography variant="body2">{row.phone}</Typography>
                                                    </Link>
                                                </Tooltip>
                                            ) : (
                                                <Typography variant="body2" color="text.disabled">-</Typography>
                                            )}
                                        </TableCell>
                                        <TableCell sx={cellSx} align="right">{row.purchaseCount}</TableCell>
                                        <TableCell sx={cellSx} align="right">{formatAvg(row.avgDaysBetweenPurchases)}</TableCell>
                                        <TableCell sx={cellSx} align="right">{formatCLP(row.totalAmount)}</TableCell>
                                    </TableRow>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan={6} sx={{ textAlign: 'center' }}>
                                            Sin datos para el período seleccionado
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </DataTable>
                    </Grid>
                )}
            </Box>
        </LocalizationProvider>
    );
};
