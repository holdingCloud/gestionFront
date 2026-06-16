import { useState } from 'react';
import dayjs from 'dayjs';
import { ReportService } from '../../../services/report.service';
import { SalesEvolutionResponse } from '../../../interfaces/report.interface';

export const useSalesEvolution = () => {
    const [data, setData] = useState<SalesEvolutionResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('year').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [period, setPeriod] = useState<'day' | 'week' | 'month'>('day');
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await ReportService.getSalesEvolution({ startDate, endDate, period, companyId });
            setData(result);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, startDate, setStartDate, endDate, setEndDate, period, setPeriod, companyId, setCompanyId, fetchData };
};
