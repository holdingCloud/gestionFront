import { Breadcrumbs, Typography } from "@mui/material";
import { Link, useLocation } from "react-router-dom";


export const UrlBreadCrumbs = () => {

    const location = useLocation();

    const back = location.pathname.split("/");

    let currentPath = back.at(2);

    if (currentPath) {

        currentPath = currentPath.charAt(0).toUpperCase() + currentPath.slice(1);

    }


    return (
        <Breadcrumbs aria-label="breadcrumb" sx={{
            marginBottom: 2
        }}>

            <Link
                color="inherit" to={`/${back.at(1)}`}
            >
                Dashboard
            </Link>
            <Typography color="text.primary">{(currentPath) ? `${currentPath}` : ''}</Typography>
        </Breadcrumbs >

    )
}
