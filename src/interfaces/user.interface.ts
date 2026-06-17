export interface Role {
    id: number;
    type: string;
}

export interface UserResponse {
    data: Users[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
}

export interface Users {
    id: number;
    fullName: string;
    email: string;
    imagen: string;
    rol: string;
    isActive: boolean;
    isLoged: boolean;
}

export interface UserBody {
    fullName: string;
    email: string;
    password?: string;
    imagen: string;
    rol: number;
    isActive?: boolean;
}

export interface UserFilter {
    fullName?: string;
    email?: string;
}
