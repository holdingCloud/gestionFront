import { useState } from 'react';
import dayjs from 'dayjs';
import { ReportService } from '../../../services/report.service';
import { AvgPurchaseFrequencyResponse } from '../../../interfaces/report.interface';

export const useAvgFrequency = () => {
    const [data, setData] = useState<AvgPurchaseFrequencyResponse | null>(null);
    const [loading, setLoading] = useState(false);
    const [startDate, setStartDate] = useState(dayjs().startOf('year').format('YYYY-MM-DD'));
    const [endDate, setEndDate] = useState(dayjs().format('YYYY-MM-DD'));
    const [companyId, setCompanyId] = useState<number | undefined>(undefined);

    const fetchData = async () => {
        setLoading(true);
        try {
            const result = await ReportService.getAvgPurchaseFrequency({ startDate, endDate, companyId });
            setData(result);
        } catch {
            // ignore
        } finally {
            setLoading(false);
        }
    };

    return { data, loading, startDate, setStartDate, endDate, setEndDate, companyId, setCompanyId, fetchData };
};
