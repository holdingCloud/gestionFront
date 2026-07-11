export type FrequencyStatus = 'NUEVO' | 'EN_PLAZO' | 'POR_VENCER' | 'VENCIDO';

// Estado de contacto del cliente. NUEVO es el estado por defecto y derivado por el
// sistema (cliente sin compras finalizadas); no puede asignarse manualmente.
export type ContactStatus = 'NUEVO' | 'CONTACTADO' | 'LLAMAR' | 'VENCIDO';

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

export interface DireccionCommune {
    id: number;
    name: string;
    regionId: number;
}

export interface DireccionData {
    id: number;
    tipo: string;
    calle: string;
    numero: string | null;
    departamento: string | null;
    referencia: string | null;
    communeId: number | null;
    commune?: DireccionCommune | null;
    latitud: number | null;
    longitud: number | null;
    principal: boolean;
}

export interface ClientResponse {
    id: number;
    fullname: string;
    phone: string;
    email: string;
    companyId: number | null;
    company?: { id: number; name: string; description?: string | null } | null;
    direccionId?: number | null;
    direccion?: DireccionData | null;
    available: boolean;
    contactStatus: ContactStatus;
    frequency: number | null;
    createdAt: string;
    updatedAt: string;
    frequencies: ClientProductFrequency[];
    clientProductFrequencies: ClientProductFrequency[];
}

export interface DireccionPrincipalBody {
    calle: string;
    numero?: string;
    departamento?: string;
    referencia?: string;
    communeId?: number;
    latitud?: number;
    longitud?: number;
}

export interface ClientBody {
    fullname: string;
    phone: string;
    email: string;
    companyId?: number;
    frequency?: number;
    direccionPrincipal?: DireccionPrincipalBody;
}

export interface ClientPaginatedResponse {
    data: ClientResponse[];
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

export interface ClientPurchasePaginatedResponse {
    data: ClientPurchase[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface PurchaseBody {
    productsId: number;
    quantity: number;
    unitPrice: number;
    purchaseDate: string;
}

// Keep alias for compatibility
export type ClientFrequency = ClientProductFrequency;
