import { Breadcrumbs, Link, Typography } from "@mui/material";
import { Link as RouterLink, useLocation } from "react-router-dom";

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
    company: 'Empresas',
};

export const UrlBreadCrumbs = () => {
    const location = useLocation();
    const back = location.pathname.split("/");
    const segment = back[2];
    const currentPath = segment
        ? (pathNames[segment] ?? segment.charAt(0).toUpperCase() + segment.slice(1))
        : '';

    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 2 }}>
            <Link
                component={RouterLink}
                to={`/${back[1]}`}
                underline="hover"
                color="inherit"
            >
                Dashboard
            </Link>
            {currentPath && (
                <Typography color="text.primary">{currentPath}</Typography>
            )}
        </Breadcrumbs>
    );
};
