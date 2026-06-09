import { Avatar, Badge, Box, Divider, IconButton, ListItemIcon, Menu, MenuItem, Toolbar, Tooltip, Typography } from "@mui/material";
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import { NavListDrawer } from "./NavListDrawer";
import { useEffect, useState } from "react"
import MuiDrawer from '@mui/material/Drawer';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonOutlinedIcon from '@mui/icons-material/PersonOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import PhoneInTalkOutlinedIcon from '@mui/icons-material/PhoneInTalkOutlined';
import { Outlet, useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import { useAuthStore } from "../../store/auth/auth.store";
import { useClientStore } from "../../store/client/client.store";
import { useIdleTimer } from 'react-idle-timer';
import { SessionModal } from "../modal/sessionModal";

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
    const navigate = useNavigate();
    const logoutUser = useAuthStore(state => state.logoutUser);
    const reNewSession = useAuthStore(state => state.reNewSession);
    const user = useAuthStore(state => state.user);
    const porLlamarCount = useClientStore(state => state.porLlamarCount);
    const fetchPorLlamarCount = useClientStore(state => state.fetchPorLlamarCount);
    const [open, setOpen] = useState(false);
    const [openModal, setOpeModal] = useState(false);
    const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
    const menuOpen = Boolean(anchorEl);

    const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
    };

    const handleLogout = () => {
        handleMenuClose();
        logoutUser();
    };

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    useEffect(() => {
        fetchPorLlamarCount();
        const interval = setInterval(fetchPorLlamarCount, 60_000);
        return () => clearInterval(interval);
    }, []);

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
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>Gestionate</Typography>

                    <Tooltip title={`${porLlamarCount} cliente${porLlamarCount !== 1 ? 's' : ''} por llamar`}>
                        <IconButton
                            color="inherit"
                            size="small"
                            sx={{ mr: 1 }}
                            onClick={() => navigate('/dashboard/client')}
                        >
                            <Badge
                                badgeContent={porLlamarCount}
                                color="error"
                                max={99}
                                invisible={porLlamarCount === 0}
                            >
                                <PhoneInTalkOutlinedIcon />
                            </Badge>
                        </IconButton>
                    </Tooltip>

                    <IconButton onClick={handleMenuOpen} size="small" sx={{ ml: 1 }}>
                        <Avatar
                            sx={{ width: 36, height: 36, bgcolor: 'rgba(255,255,255,0.25)', fontSize: 14, fontWeight: 700 }}
                            src={user?.avatar || undefined}
                        >
                            {userInitials}
                        </Avatar>
                    </IconButton>

                    <Menu
                        anchorEl={anchorEl}
                        open={menuOpen}
                        onClose={handleMenuClose}
                        disableScrollLock
                        transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                        anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                        slotProps={{ paper: { elevation: 4, sx: { mt: 1, minWidth: 180, borderRadius: 2 } } }}
                    >
                        <MenuItem disabled sx={{ opacity: '1 !important' }}>
                            <Typography variant="body2" color="text.secondary" noWrap>
                                {user?.fullName ?? user?.userName ?? 'Usuario'}
                            </Typography>
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/profile'); }}>
                            <ListItemIcon><PersonOutlinedIcon fontSize="small" /></ListItemIcon>
                            Perfil
                        </MenuItem>
                        <MenuItem onClick={() => { handleMenuClose(); navigate('/dashboard/config'); }}>
                            <ListItemIcon><SettingsOutlinedIcon fontSize="small" /></ListItemIcon>
                            Configuración
                        </MenuItem>
                        <Divider />
                        <MenuItem onClick={handleLogout} sx={{ color: 'error.main' }}>
                            <ListItemIcon><LogoutOutlinedIcon fontSize="small" color="error" /></ListItemIcon>
                            Salir
                        </MenuItem>
                    </Menu>
                </Toolbar>
            </AppBar>

            <Drawer
                variant="permanent"
                PaperProps={{
                    sx: {
                        backgroundColor: 'background.paper',
                        color: 'text.primary',
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
                    bgcolor: 'background.default',
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
