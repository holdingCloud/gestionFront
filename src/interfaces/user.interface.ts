export interface Role {
    id: number;
    type: string;
    _count?: { user: number };
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

export type TypePosition = 'SUPER_ADMIN' | 'ADMINISTRADOR' | 'REPARTIDOR' | 'COMUN';
export type ModuloType = 'DASHBOARD' | 'USUARIOS' | 'CLIENTES' | 'RRHH' | 'INVENTARIO' | 'COMPRAS' | 'PROVEEDORES' | 'CUENTAS' | 'HOJA_DE_VENTA' | 'REPORTES' | 'EMPRESAS';

export interface RolModulo {
    id: number;
    modulo: ModuloType;
    rolId: number;
}

export interface RolConModulos {
    id: number;
    type: string;
    modulos: RolModulo[];
}

export interface RoleBody {
    type: string;
}
