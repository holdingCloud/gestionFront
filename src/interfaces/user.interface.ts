export interface UserResponse {
    data: Users[];
    count?: number;
}

export interface Users {
    id: number;
    userName: string;
    fullName: string;
    email: string;
    avatar: string;
    isActive: boolean;
}

export interface UserBody {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
}

export interface UserFilter {
    fullName: string;
    email: string;
}