
import {
    TableFooter,
    TablePagination,
    Paper,
    TableContainer,
    Table,
    TableCell,
    TableRow,
    Box,
    IconButton,
} from '@mui/material';
import { KeyboardArrowLeft, KeyboardArrowRight } from '@mui/icons-material';

const WINDOW = 6; // cuántos números de página mostrar a la vez

function PaginationActions({ count, page, rowsPerPage, onPageChange }: any) {
    const totalPages = Math.max(1, Math.ceil(count / rowsPerPage));
    const current = page + 1; // base 0 → base 1 para mostrar

    // Ventana deslizante: mantiene la página actual centrada sin salirse de [1, totalPages]
    const start = Math.max(1, Math.min(current - Math.floor(WINDOW / 2), totalPages - WINDOW + 1));
    const pages = Array.from(
        { length: Math.min(WINDOW, totalPages) },
        (_, i) => start + i
    );

    return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, ml: 2 }}>
            <IconButton size="small" onClick={(e) => onPageChange(e, page - 1)} disabled={page === 0}>
                <KeyboardArrowLeft fontSize="small" />
            </IconButton>

            {/* Indicador de más páginas a la izquierda */}
            {start > 1 && <Box sx={{ px: 0.5, color: 'text.disabled' }}>…</Box>}

            {pages.map((p) => (
                <Box
                    key={p}
                    onClick={(e) => onPageChange(e, p - 1)}
                    sx={{
                        minWidth: 30, height: 30, px: 1,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        borderRadius: '8px', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                        bgcolor: p === current ? 'primary.main' : 'transparent',
                        color: p === current ? '#fff' : 'text.secondary',
                        '&:hover': { bgcolor: p === current ? 'primary.main' : 'action.hover' },
                    }}
                >
                    {p}
                </Box>
            ))}

            {/* Indicador de más páginas a la derecha */}
            {start + pages.length - 1 < totalPages && <Box sx={{ px: 0.5, color: 'text.disabled' }}>…</Box>}

            <IconButton size="small" onClick={(e) => onPageChange(e, page + 1)} disabled={current >= totalPages}>
                <KeyboardArrowRight fontSize="small" />
            </IconButton>
        </Box>
    );
}


export const DataTable = (
    { count,
        page,
        rowsPerPage,
        handleChangePage,
        handleChangeRowsPerPage,
        children }: any) => {


    return (
        <TableContainer component={Paper}>

            <Table
                sx={{
                    width: '100%',
                    '& .MuiTableCell-root': {
                        padding: '5px 10px',
                    },
                }}
                size="small"
                aria-label="simple table">
                {children}

                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={99}>
                            <TablePagination
                                sx={{
                                    display: "flex",
                                }}
                                component="div"
                                count={count}
                                page={page}
                                onPageChange={handleChangePage}
                                rowsPerPage={rowsPerPage}
                                onRowsPerPageChange={handleChangeRowsPerPage}
                                labelRowsPerPage={"Data por página"}
                                labelDisplayedRows={(from) => `${from.from} - ${from.to} de ${from.count}`}
                                ActionsComponent={PaginationActions}
                            />
                        </TableCell>

                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}