
import {
    TableFooter,
    TablePagination,
    Paper,
    TableContainer,
    Table,
    TableCell,
    TableRow,
    makeStyles,
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
                    '& .MuiTableCell-sizeMedium': {
                        padding: '5px 10px',
                    },

                }}
                size="small"
                aria-label="simple table">
                {children}

                <TableFooter>
                    <TableRow>
                        <TableCell >
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