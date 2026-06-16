import { useState } from 'react';
import { ReportService } from '../../../services/report.service';
import { InactiveClientItem } from '../../../interfaces/report.interface';

export const useInactiveClients = () => {
    const [data, setData] = useState<InactiveClientItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await ReportService.getInactiveClients();
            setData(result);
            setPage(0);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    const handleChangePage = (_: unknown, newPage: number) => setPage(newPage);
    const handleChangeRowsPerPage = (e: React.ChangeEvent<HTMLInputElement>) => {
        setRowsPerPage(parseInt(e.target.value, 10));
        setPage(0);
    };

    return {
        data,
        loading,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    };
};
