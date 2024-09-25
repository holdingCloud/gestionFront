import { Box, Button, Divider, IconButton, Toolbar, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { NavListDrawer } from "./NavListDrawer";
import { useState } from "react"
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import InboxIcon from '@mui/icons-material/Inbox';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { Outlet } from "react-router-dom";
import { routes } from "../../routes/routes";
import { useAuthStore } from "../../store/auth/auth.store";
import { useIdleTimer } from 'react-idle-timer';
import { SessionModal } from "../modal/sessionModal";


const navLinks = [

    {
        title: "logout",
        path: "",
        icon: <InboxIcon />,
    },
]

const drawerWidth = 200;

const DrawerHeader = styled('div')(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'flex-end',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
}));


const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
    ({ theme, open }) => ({
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
        boxSizing: 'border-box',
        ...(open && {
            ...openedMixin(theme),
            '& .MuiDrawer-paper': openedMixin(theme),
        }),
        ...(!open && {
            ...closedMixin(theme),
            '& .MuiDrawer-paper': closedMixin(theme),
        }),
    }),
);

const openedMixin = (theme: Theme): CSSObject => ({
    width: drawerWidth,
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
    }),
    overflowX: 'hidden',
});

const closedMixin = (theme: Theme): CSSObject => ({
    transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    overflowX: 'hidden',
    width: `calc(${theme.spacing(7)} + 1px)`,
    [theme.breakpoints.up('sm')]: {
        width: `calc(${theme.spacing(8)} + 1px)`,
    },
});


interface AppBarProps extends MuiAppBarProps {
    open?: boolean;
}

const AppBar = styled(MuiAppBar, {
    shouldForwardProp: (prop) => prop !== 'open',
})<AppBarProps>(({ theme, open }) => ({
    zIndex: theme.zIndex.drawer + 1,
    transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
    }),
    ...(open && {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    }),
}));

export const Navbar = () => {

    //TODO: Mantener sesion al presionar boton del modal mantener sesion esto aunque se acabe el tiempo del token

    const theme = useTheme();
    const logoutUser = useAuthStore(state => state.logoutUser);
    const reNewSession = useAuthStore(state => state.reNewSession);
    const [open, setOpen] = useState(false);
    const [openModal, setOpeModal] = useState(false);

    const onIdle = () => {
        setOpeModal(true);
    }

    useIdleTimer({
        onIdle,
        timeout: 3500_000,
        throttle: 500
    });

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const onCloseModal = (action: boolean) => {

        reNewSession();
        setOpeModal(action);
    }




    return (

        <Box
            sx={{ display: 'flex' }}>
            <AppBar
                position="fixed"
                sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
                open={open}>
                <Toolbar>
                    <IconButton
                        color="inherit"
                        onClick={handleDrawerOpen}
                        size="large">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}> News</Typography>
                    <Box sx={{ display: { xs: "none", sm: "block" } }}>
                        {
                            navLinks.map(({ title, path }) => (
                                <Button
                                    key={path}
                                    color="inherit"
                                    component="a"
                                    href={path}
                                    onClick={logoutUser}>{title}</Button>
                            ))
                        }
                    </Box>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: {
                        backgroundColor: "bluelight",
                        color: "black",
                    }
                }}
                open={open}>
                <DrawerHeader >
                    Gestionate
                    <IconButton onClick={handleDrawerClose}>
                        {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                    </IconButton>
                </DrawerHeader>
                <Divider />
                {
                    routes.map(item => (

                        <NavListDrawer key={item.to} {...item} />
                    ))
                }
                <Divider />
            </Drawer>

            <Box component="main"
                sx={{
                    flexGrow: 1,
                    p: 3,
                    background: "#11101111"
                }}>
                <DrawerHeader />

                <Outlet />

            </Box>
            <SessionModal
                title={'¿Desea mantener la sesión?'}
                open={openModal}
                onClose={onCloseModal} />
        </Box>
    )
}
