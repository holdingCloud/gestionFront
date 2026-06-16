export interface Company {
    id: number;
    name: string;
    description: string | null;
    createdAt: string;
    updatedAt: string;
    _count?: { clients: number };
}

export interface CompanyBody {
    name: string;
    description?: string;
}
