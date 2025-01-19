export interface EmployeeResponse {
    employees: Employees[];
    count: number;
}


export interface Employees {
    id: number;
    rut: string;
    fullname: string;
    email: string;
    salary: number;
    hiredate: string;
    city: string;
    address: string;
    available: boolean;
    type: string;
}

export interface employeeBody {
    rut: string;
    fullName: string;
    email: string;
    salary: number;
    hireDate: string;
    city: string;
    address: string;
    type: string;
}

export interface employeeFilter {
    rut: string;
    fullname: string;
    email: string;
}
