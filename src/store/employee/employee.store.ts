import { devtools } from "zustand/middleware";
import { UserService } from "../../services/user.service";
import { StateCreator, create } from "zustand";
import { Users } from "../../interfaces";
import { immer } from "zustand/middleware/immer";
import { employeeBody, Employees } from "../../interfaces/employee.interface";
import { EmployeeService } from "../../services/employee.service";

export interface EmployeeState {
    employees: Employees[];
    count: number;
    getEmployees: (skip: number, take: number, { }: any) => Promise<void>;
    createEmployee: (user: employeeBody) => Promise<void>;
    deleteEmployee: (id: number) => void;
    changeStatus: (id: number, status: boolean) => void;
    updateEmployee: (user: Users) => void;

}

const storeApi: StateCreator<EmployeeState, [["zustand/devtools", never], ["zustand/immer", never]]> = (set, get) => ({
    employees: [],
    count: 0,
    getEmployees: async (skip, take, filter) => {
        try {
            const { employees, count } = await EmployeeService.getEmployees({ skip, take });
            set({ employees, count });
        } catch (error) {
            set({ employees: undefined, count: 0 })

        }
    },
    createEmployee: async (employee) => {
        try {
            const data = await EmployeeService.createrEmployee(employee);
            set(state => ({
                employees: [data, ...state.employees],
                count: state.count + 1
            }));
        } catch (error) {
            console.log(error);
        }
    },
    deleteEmployee: async (id) => {
        try {
            const { success } = await EmployeeService.deleteEmployee(id);

            if (success) {
                set(state => ({
                    employees: state.employees.filter(employee => employee.id != id)
                }));
            }
        } catch (error) {
            console.log(error);
        }
    },
    changeStatus: async (id, status) => {


        try {
            const data = await EmployeeService.changeStatus(id, status);

            console.log(data);
        } catch (error) {
            console.log(error)
        }

    },
    updateEmployee: async (employeeData) => {

        const { id, ...employee } = employeeData;

        try {
            const data = await UserService.updateUser(id, employee);

            console.log(data);
        } catch (error) {
            console.log(error)
        }
    }
})


export const useEmployeeStore = create<EmployeeState>()(
    devtools(
        immer(
            storeApi
        )
    )
)