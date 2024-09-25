export interface UserResponse {
    users: Users[];
    count: number;
}

export interface Users {
    id: number;
    userName: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
    isActive: boolean;
}

export interface userBody {
    userName: string;
    fullName: string;
    email: string;
    password: string;
    avatar: string;
}

export interface userFilter {
    fullname: string;
    email: string;
}