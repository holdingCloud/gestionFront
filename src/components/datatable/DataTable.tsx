
import {
    TableFooter,
    TablePagination,
    Paper,
    TableContainer,
    Table,
    TableCell,
    TableRow,
} from '@mui/material';



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
                            />
                        </TableCell>

                    </TableRow>
                </TableFooter>
            </Table>
        </TableContainer>
    );
}