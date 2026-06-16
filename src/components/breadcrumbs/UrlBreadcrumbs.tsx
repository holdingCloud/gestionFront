import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";


const pathNames: Record<string, string> = {
    client: 'Clientes',
    user: 'Usuarios',
    employee: 'Empleados',
    inventory: 'Inventario',
    buy: 'Compras',
    provider: 'Proveedores',
    bill: 'Cuentas',
    reports: 'Reportes',
    profile: 'Perfil',
    config: 'Configuración',
};

export const UrlBreadCrumbs = () => {

    const location = useLocation();

    const back = location.pathname.split("/");

    const segment = back[2];
    const currentPath = segment
        ? (pathNames[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1))
        : '';


    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{
            marginBottom: 2
        }}>

            <Link
                color="inherit" to={`/${back[1]}`}
            >
                Dashboard
            </Link>
            <Typography color="text.primary">{(currentPath) ? `${currentPath}` : ''}</Typography>
        </Breadcrumbs >

    )
}
