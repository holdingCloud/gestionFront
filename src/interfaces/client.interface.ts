export type FrequencyStatus = 'NUEVO' | 'EN_PLAZO' | 'POR_VENCER' | 'VENCIDO';

export interface ClientProductFrequency {
    id: number;
    clientsId: number;
    productsId: number;
    product?: { id: number; name: string; code: string };
    purchaseCount: number;
    avgDaysBetweenPurchases: number | null;
    lastPurchaseDate: string | null;
    actualPurchaseDate: string | null;
    nextEstimatedDate: string | null;
    daysSinceLastPurchase: number | null;
    status: FrequencyStatus;
    updatedAt: string;
}

export interface ClientResponse {
    id: number;
    fullname: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    available: boolean;
    contactStatus: string;
    frequency: number | null;
    createdAt: string;
    updatedAt: string;
    frequencies: ClientProductFrequency[];
    clientProductFrequencies: ClientProductFrequency[];
}

export interface ClientPaginatedResponse {
    data: ClientResponse[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface ClientBody {
    fullname: string;
    city: string;
    address: string;
    phone: string;
    email: string;
    frequency?: number;
}

export interface ClientPurchasePaginatedResponse {
    data: ClientPurchase[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export type Client = ClientResponse;

export type PurchaseStatus = 'PENDIENTE' | 'FINALIZADO' | 'ANULADO';

export interface ClientPurchase {
    id: number;
    clientsId: number;
    productsId: number;
    quantity: number;
    unitPrice: number;
    purchaseStatus: PurchaseStatus;
    purchaseDate: string;
    product?: { id: number; name: string; code: string };
    createdAt: string;
    updatedAt: string;
}

export interface PurchaseBody {
    productsId: number;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
}

// Keep ClientFrequency as alias for compatibility
export type ClientFrequency = ClientProductFrequency;
