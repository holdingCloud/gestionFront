import { ReactElement, lazy } from "react";
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import SupervisorAccountOutlinedIcon from '@mui/icons-material/SupervisorAccountOutlined';
import { SvgIconClassKey } from "@mui/joy/SvgIcon";
import { createBrowserRouter } from "react-router-dom";
import { Root } from "../Root";
import { DashboardLayout } from "../layouts/DashboardLayout";
import { AuthLayout } from "../layouts";
import { SalesSheetLayout } from "../layouts/SalesSheetLayout";
import ShoppingBasketIcon from '@mui/icons-material/ShoppingBasket';
import ListAltIcon from '@mui/icons-material/ListAlt';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import RecentActorsIcon from '@mui/icons-material/RecentActors';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import BusinessOutlinedIcon from '@mui/icons-material/BusinessOutlined';

export interface Route {
    to: string;
    //path: string;
    //Component: LazyExoticComponent<JSXComponent> | JSXComponent,
    name: string;
    icon: ReactElement<SvgIconClassKey>;
}

const LoginPage = lazy(async () => await import(/* webpackChunkName: "LoginPage" */'../pages/auth/LoginPage'));
const ProfilePage = lazy(async () => await import(/* webpackChunkName: "Profile" */'../pages/profile/ProfilePage'));
const ConfigPage = lazy(async () => await import(/* webpackChunkName: "Config" */'../pages/config/ConfigPage'));
const DashboardPage = lazy(async () => await import(/* webpackChunkName: "Dashboard" */'../pages/dashboard/DashboardPage'));
const UserPage = lazy(async () => await import(/* webpackChunkName: "Users" */'../pages/user/UserPage'));
const InventoryPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/inventory/InventoryPage'));
const BuyPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/buys/BuyPage'));
const CashierPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/cashier/CashierPage'));
const SalesSheet = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/sales/SalesSheetPage'));
const EmployeePage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/employee/EmployeePage'));
const ClientPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/client/ClientPage'));
const ProviderPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/provider/ProviderPage'));
const BillPage = lazy(async () => await import(/* webpackChunkName: "Products" */'../pages/bill/BillPage'));
const ReportsPage = lazy(async () => await import(/* webpackChunkName: "Reports" */'../pages/reports/ReportsPage'));
const CompanyPage = lazy(async () => await import(/* webpackChunkName: "Company" */'../pages/company/CompanyPage'));

//TODO: Agregar que todo redireccionamiento vuelva al dashboard

export const router = createBrowserRouter([
    {
        path: '/',
        element: <Root />,
        children: [
            //Dashboard routes
            {
                path: 'dashboard',
                element: <DashboardLayout />,
                children: [
                    {
                        path: '',
                        element: <DashboardPage />
                    },
                    {
                        path: 'user',
                        element: <UserPage />
                    },
                    {
                        path: 'inventory',
                        element: <InventoryPage />
                    },
                    {
                        path: 'buy',
                        element: <BuyPage />
                    },
                    {
                        path: 'employee',
                        element: <EmployeePage />
                    },
                    {
                        path: 'client',
                        element: <ClientPage />
                    },
                    {
                        path: 'provider',
                        element: <ProviderPage />
                    },
                    {
                        path: 'bill',
                        element: <BillPage />
                    },
                    {
                        path: 'profile',
                        element: <ProfilePage />
                    },
                    {
                        path: 'config',
                        element: <ConfigPage />
                    },
                    {
                        path: 'reports',
                        element: <ReportsPage />
                    },
                    {
                        path: 'company',
                        element: <CompanyPage />
                    },
                ]
            },

            {
                path: 'auth',
                element: <AuthLayout />,
                children: [
                    {
                        path: 'login',
                        element: <LoginPage />
                    }
                ]
            },
            {
                path: '/sales',
                element: <SalesSheetLayout />,
                children: [
                    {
                        path: 'salesSheet',
                        element: <SalesSheet />
                    }
                ]

            },
            {
                path: 'Cashier',
                element: <CashierPage />
            },
        ]
    }
])


export const routes: Route[] = [
    {
        to: '/dashboard',
        name: 'Dashboard',
        icon: <SpaceDashboardIcon />
    },
    {
        to: 'user',
        //path: 'user/*',
        //Component: lazy(() => import(/* webpackChunkName: "Users" */'../pages/user/UserPage')),
        name: 'Usuarios',
        icon: <SupervisorAccountOutlinedIcon />
    },
    {
        to: 'client',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Clientes',
        icon: <RecentActorsIcon />
    },
    {
        to: 'employee',
        name: 'Empleados',
        icon: <SupervisedUserCircleIcon />
    },
    {
        to: 'inventory',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Inventario',
        icon: <Inventory2OutlinedIcon />
    },
    {
        to: 'buy',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Compras',
        icon: <ShoppingBasketIcon />
    },
    {
        to: 'provider',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Proveedores',
        icon: <AccountBoxIcon />
    },
    {
        to: 'bill',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Cuentas',
        icon: <AttachMoneyIcon />
    },
    {
        to: '/sales',
        //path: 'inventory/*',
        //Component: lazy(() => import(/* webpackChunkName: "Products" */'../pages/invetory/InventoryPage')),
        name: 'Hoja de venta',
        icon: <ListAltIcon />
    },
    {
        to: 'reports',
        name: 'Reportes',
        icon: <AssessmentOutlinedIcon />
    },
    {
        to: 'company',
        name: 'Empresas',
        icon: <BusinessOutlinedIcon />
    },
];