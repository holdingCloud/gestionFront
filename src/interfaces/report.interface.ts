export interface SalesByProductItem {
    productId: number;
    productName: string;
    productCode: string;
    total: number;
    finalized: number;
    canceled: number;
    pending: number;
    cancelRate: number;
    totalAmount: number;
}

export interface SalesByPeriodItem {
    period: string;
    total: number;
    finalized: number;
    canceled: number;
}

export interface SalesByProductResponse {
    byProduct: SalesByProductItem[];
    byPeriod: SalesByPeriodItem[];
}

export interface ClientPurchaseReportItem {
    clientId: number;
    clientName: string;
    communeName: string;
    phone?: string | null;
    purchaseCount: number;
    avgDaysBetweenPurchases: number | null;
    totalAmount: number;
}

export interface SalesEvolutionSeriesItem {
    period: string;
    transactionCount: number;
    totalAmount: number;
}

export interface SalesEvolutionSummary {
    currentTotal: number;
    currentTxCount: number;
    previousTotal: number;
    previousTxCount: number;
    variationAmount: number;
    variationTx: number;
    previousPeriod: {
        start: string;
        end: string;
    };
}

export interface SalesEvolutionResponse {
    series: SalesEvolutionSeriesItem[];
    summary: SalesEvolutionSummary;
}

export type AlertLevel = 'NORMAL' | 'ATENCION' | 'RIESGO';

export interface InactiveClientItem {
    clientId: number;
    clientName: string;
    communeName: string;
    frequency: number;
    lastPurchaseDate: string;
    avgDaysBetweenPurchases: number;
    daysSinceLastPurchase: number;
    deviation: number;
    alertLevel: AlertLevel;
}

export interface TopClientItem {
    rank: number;
    clientId: number;
    clientName: string;
    communeName: string;
    avgDaysBetweenPurchases: number;
    totalAmount: number;
    purchaseCount: number;
}

export interface FrequencyHistogramItem {
    range: string;
    minDays: number;
    clientCount: number;
}

export interface AvgPurchaseFrequencyResponse {
    globalAvg: number;
    histogram: FrequencyHistogramItem[];
}

export interface DailyKpisVs {
    finalized: number;
    canceled: number;
    totalAmount: number;
    avgTicket: number;
    newClients: number;
}

export interface DailyKpisResponse {
    date: string;
    finalized: number;
    canceled: number;
    totalAmount: number;
    avgTicket: number;
    newClients: number;
    vs: DailyKpisVs;
}
