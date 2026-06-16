import { useState } from 'react';
import dayjs from 'dayjs';
import { ReportService } from '../../../services/report.service';
import { TopClientItem } from '../../../interfaces/report.interface';

export const useTopClients = () => {
    const [data, setData] = useState<TopClientItem[]>([]);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('year').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [limit, setLimit] = useState(10);
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await ReportService.getTopClients({ startDate, endDate, limit, companyId });
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
        startDate, setStartDate,
        endDate, setEndDate,
        limit, setLimit,
        companyId, setCompanyId,
        page, rowsPerPage,
        handleChangePage, handleChangeRowsPerPage,
        fetchData,
    };
};
