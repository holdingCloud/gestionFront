import { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import { ReportService } from '../../../services/report.service';
import { DailyKpisResponse, SalesEvolutionResponse } from '../../../interfaces/report.interface';

export const useDashboard = () => {
    const [kpis, setKpis] = useState<DailyKpisResponse | null>(null);
    const [salesEvolution, setSalesEvolution] = useState<SalesEvolutionResponse | null>(null);
    const [loadingKpis, setLoadingKpis] = useState(false);
    const [loadingEvolution, setLoadingEvolution] = useState(false);

    const fetchKpis = async () => {
        setLoadingKpis(true);
        try {
            const data = await ReportService.getDailyKpis();
            setKpis(data);
        } catch {
            // ignore
        } finally {
            setLoadingKpis(false);
        }
    };

    const fetchSalesEvolution = async () => {
        setLoadingEvolution(true);
        try {
            const startDate = dayjs().startOf('month').format('YYYY-MM-DD');
            const endDate = dayjs().format('YYYY-MM-DD');
            const data = await ReportService.getSalesEvolution({ startDate, endDate, period: 'day' });
            setSalesEvolution(data);
        } catch {
            // ignore
        } finally {
            setLoadingEvolution(false);
        }
    };

    useEffect(() => {
        fetchKpis();
        fetchSalesEvolution();
    }, []);

    return { kpis, salesEvolution, loadingKpis, loadingEvolution };
};
