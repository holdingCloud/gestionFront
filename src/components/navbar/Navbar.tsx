import { Box, Tooltip, Typography } from "@mui/material";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { routes } from "../../routes/routes";
import { useAuthStore } from "../../store/auth/auth.store";
import { useClientStore } from "../../store/client/client.store";
import { useThemeStore, THEME_TOKENS, ThemeVariant } from "../../store/theme/theme.store";
import { useIdleTimer } from 'react-idle-timer';
import { SessionModal } from "../modal/sessionModal";
import { useEffect, useState } from "react";
import React from "react";

type Tokens = (typeof THEME_TOKENS)[ThemeVariant];

const LogoMark = () => (
    <svg width="34" height="34" viewBox="0 0 40 40" style={{ flexShrink: 0 }}>
        <defs>
            <linearGradient id="gzlogo" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0" stopColor="#0e9f8c" />
                <stop offset="1" stopColor="#0f3a4f" />
            </linearGradient>
        </defs>
        <path d="M9 9 L7 1 L16 6 Z" fill="#0e9f8c" />
        <path d="M31 9 L33 1 L24 6 Z" fill="#0e9f8c" />
        <path d="M20 6 C28 6 34 8 34 8 L34 20 C34 30 27 35 20 37 C13 35 6 30 6 20 L6 8 C6 8 12 6 20 6 Z" fill="url(#gzlogo)" />
        <path d="M13.5 20 l4 4 l9 -9.5" fill="none" stroke="#fffdf9" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
);

interface NavItemProps {
    to: string;
    icon: React.ReactElement;
    label: string;
    active: boolean;
    collapsed: boolean;
    badge?: number;
    t: Tokens;
    onClick: () => void;
}

const NavItem = ({ icon, label, active, collapsed, badge, t, onClick }: NavItemProps) => (
    <Box
        onClick={onClick}
        title={collapsed ? label : undefined}
        sx={{
            display: 'flex', alignItems: 'center', gap: '12px',
            width: '100%', border: 'none', cursor: 'pointer',
            borderRadius: '11px', padding: '11px 12px',
            transition: 'background .15s',
            bgcolor: active ? 'primary.main' : 'transparent',
            color: '#fff',
            opacity: active ? 1 : 0.82,
            justifyContent: collapsed ? 'center' : 'flex-start',
            '&:hover': {
                bgcolor: active ? 'primary.main' : 'rgba(255,255,255,.08)',
                opacity: 1,
            },
        }}
    >
        <Box sx={{ flexShrink: 0, display: 'flex', alignItems: 'center', '& .MuiSvgIcon-root': { fontSize: '20px', color: '#fff' } }}>
            {icon}
        </Box>
        {!collapsed && (
            <Typography component="span" sx={{ fontSize: '14px', fontWeight: active ? 700 : 600, flex: 1, color: '#fff' }}>
                {label}
            </Typography>
        )}
        {badge != null && (
            <Box sx={{
                ml: collapsed ? 0 : 'auto', bgcolor: t.warning, color: '#fff',
                fontSize: '10.5px', fontWeight: 700, minWidth: '18px', height: '18px',
                borderRadius: '9px', display: 'flex', alignItems: 'center',
                justifyContent: 'center', px: '5px',
            }}>
                {badge}
            </Box>
        )}
    </Box>
);

export const Navbar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const logoutUser = useAuthStore(state => state.logoutUser);
    const reNewSession = useAuthStore(state => state.reNewSession);
    const user = useAuthStore(state => state.user);
    const porLlamarCount = useClientStore(state => state.porLlamarCount);
    const fetchPorLlamarCount = useClientStore(state => state.fetchPorLlamarCount);
    const themeVariant = useThemeStore(state => state.theme);
    const setTheme = useThemeStore(state => state.setTheme);
    const t = THEME_TOKENS[themeVariant];

    const [collapsed, setCollapsed] = useState(false);
    const [openModal, setOpenModal] = useState(false);

    const userInitials = user?.fullName
        ? user.fullName.split(' ').map(n => n[0]).slice(0, 2).join('').toUpperCase()
        : '?';

    useEffect(() => {
        fetchPorLlamarCount();
        const interval = setInterval(fetchPorLlamarCount, 60_000);
        return () => clearInterval(interval);
    }, []);

    useIdleTimer({
        onIdle: () => setOpenModal(true),
        timeout: 3500_000,
        throttle: 500,
    });

    const isActive = (to: string) => {
        if (to === '/dashboard') return location.pathname === '/dashboard' || location.pathname === '/dashboard/';
        if (to.startsWith('/')) return location.pathname.startsWith(to);
        return location.pathname.includes('/' + to);
    };

    const currentRoute = routes.find(r => isActive(r.to));
    const viewLabel = currentRoute?.name || 'Dashboard';

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>

            {/* ── SIDEBAR ── */}
            <Box
                component="aside"
                sx={{
                    width: collapsed ? 78 : 248,
                    flexShrink: 0,
                    bgcolor: t.brand,
                    display: 'flex',
                    flexDirection: 'column',
                    padding: '20px 14px',
                    transition: 'width 0.2s ease',
                    position: 'sticky',
                    top: 0,
                    height: '100vh',
                    overflowX: 'hidden',
                    overflowY: 'auto',
                    zIndex: 100,
                    border: 'none',
                    boxShadow: 'none',
                }}
            >
                {/* Logo */}
                <Box sx={{
                    display: 'flex', alignItems: 'center', gap: '11px',
                    pb: '22px', justifyContent: collapsed ? 'center' : 'flex-start',
                }}>
                    <LogoMark />
                    {!collapsed && (
                        <Typography sx={{
                            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                            fontWeight: 800, fontSize: '20px', letterSpacing: '-0.4px', color: t.brandink,
                        }}>
                            Gestion<Box component="span" sx={{ color: t.primary }}>ate</Box>
                        </Typography>
                    )}
                </Box>

                {/* Nav */}
                <Box component="nav" sx={{ display: 'flex', flexDirection: 'column', gap: '3px', flex: 1 }}>
                    {routes.map(item => (
                        <NavItem
                            key={item.to}
                            to={item.to}
                            icon={item.icon}
                            label={item.name}
                            active={isActive(item.to)}
                            collapsed={collapsed}
                            badge={item.to === 'client' && porLlamarCount > 0 ? porLlamarCount : undefined}
                            t={t}
                            onClick={() => navigate(item.to)}
                        />
                    ))}
                </Box>

                {/* Theme switcher */}
                {!collapsed && (
                    <Box sx={{
                        mt: '14px', p: '12px', borderRadius: '14px',
                        background: 'rgba(255,255,255,.06)',
                        border: '1px solid rgba(255,255,255,.09)',
                    }}>
                        <Typography sx={{
                            fontSize: '11px', textTransform: 'uppercase',
                            letterSpacing: '1.5px', opacity: 0.6, color: t.brandink, mb: '9px',
                        }}>
                            Apariencia
                        </Typography>
                        <Box sx={{ display: 'flex', gap: '7px' }}>
                            {(['calido', 'claro', 'oscuro'] as ThemeVariant[]).map(v => (
                                <Tooltip key={v} title={THEME_TOKENS[v].label}>
                                    <Box
                                        onClick={() => setTheme(v)}
                                        sx={{
                                            flex: 1, height: '30px', borderRadius: '9px',
                                            cursor: 'pointer',
                                            background: THEME_TOKENS[v].swatch,
                                            border: themeVariant === v ? '2px solid #fff' : '2px solid transparent',
                                            boxShadow: themeVariant === v ? `0 0 0 2px ${t.primary}` : 'none',
                                            transition: 'all .15s',
                                        }}
                                    />
                                </Tooltip>
                            ))}
                        </Box>
                    </Box>
                )}

                {/* User + Logout */}
                <Tooltip title={collapsed ? 'Cerrar sesión' : ''}>
                    <Box
                        onClick={() => logoutUser()}
                        sx={{
                            mt: '14px', pt: '14px',
                            borderTop: '1px solid rgba(255,255,255,.1)',
                            display: 'flex', alignItems: 'center', gap: '10px',
                            cursor: 'pointer',
                            justifyContent: collapsed ? 'center' : 'flex-start',
                        }}
                    >
                        <Box sx={{
                            width: 36, height: 36, borderRadius: '11px',
                            background: `linear-gradient(135deg,${t.primary},${t.brand2})`,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            color: '#fff', fontWeight: 700, fontSize: '13px', flexShrink: 0,
                        }}>
                            {userInitials}
                        </Box>
                        {!collapsed && (
                            <>
                                <Box sx={{ flex: 1, minWidth: 0 }}>
                                    <Typography sx={{
                                        fontSize: '13px', fontWeight: 700, color: t.brandink,
                                        whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                                    }}>
                                        {user?.fullName || user?.userName || 'Usuario'}
                                    </Typography>
                                    <Typography sx={{ fontSize: '11.5px', opacity: 0.6, color: t.brandink }}>
                                        Cerrar sesión
                                    </Typography>
                                </Box>
                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={t.brandink}
                                    strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
                                    style={{ opacity: 0.55, flexShrink: 0 }}>
                                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                    <path d="m16 17 5-5-5-5" />
                                    <path d="M21 12H9" />
                                </svg>
                            </>
                        )}
                    </Box>
                </Tooltip>
            </Box>

            {/* ── MAIN COLUMN ── */}
            <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>

                {/* Topbar */}
                <Box
                    component="header"
                    sx={{
                        position: 'sticky', top: 0, zIndex: 30,
                        display: 'flex', alignItems: 'center', gap: '16px',
                        padding: '13px 28px',
                        bgcolor: 'background.paper',
                        borderBottom: `1px solid ${t.border}`,
                        boxShadow: 'none',
                    }}
                >
                    <Box
                        component="button"
                        onClick={() => setCollapsed(c => !c)}
                        sx={{
                            bgcolor: t.surface2, border: `1px solid ${t.border}`,
                            borderRadius: '10px', width: 38, height: 38,
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            cursor: 'pointer', color: 'text.primary', flexShrink: 0,
                        }}
                    >
                        <svg width="19" height="19" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round">
                            <path d="M3 6h18M3 12h18M3 18h18" />
                        </svg>
                    </Box>

                    <Box sx={{ minWidth: 0 }}>
                        <Typography sx={{ fontSize: '12px', color: 'text.secondary', fontWeight: 500 }}>
                            Dashboard / {viewLabel}
                        </Typography>
                        <Typography sx={{
                            fontFamily: "'Bricolage Grotesque', system-ui, sans-serif",
                            fontWeight: 700, fontSize: '19px', color: 'text.primary', lineHeight: 1.2,
                        }}>
                            {viewLabel}
                        </Typography>
                    </Box>

                    <Box sx={{ flex: 1 }} />

                    {/* Copiloto IA */}
                    <Box
                        component="button"
                        onClick={() => navigate('/dashboard/client')}
                        sx={{
                            display: 'flex', alignItems: 'center', gap: '8px',
                            background: `linear-gradient(120deg,${t.primary},${t.brand})`,
                            color: '#fff', border: 'none', borderRadius: '11px',
                            padding: '10px 15px', fontWeight: 700, fontSize: '13.5px',
                            cursor: 'pointer', boxShadow: `0 6px 16px ${t.primary}40`,
                            fontFamily: "'Hanken Grotesque', system-ui, sans-serif",
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M12 3v3m0 12v3M5.6 5.6l2.1 2.1m8.6 8.6 2.1 2.1M3 12h3m12 0h3M5.6 18.4l2.1-2.1m8.6-8.6 2.1-2.1" />
                            <circle cx="12" cy="12" r="3.2" />
                        </svg>
                        Copiloto IA
                    </Box>

                    {/* Bell */}
                    <Tooltip title={`${porLlamarCount} cliente${porLlamarCount !== 1 ? 's' : ''} por llamar`}>
                        <Box
                            component="button"
                            onClick={() => navigate('/dashboard/client')}
                            sx={{
                                position: 'relative', bgcolor: t.surface2,
                                border: `1px solid ${t.border}`, borderRadius: '10px',
                                width: 38, height: 38, display: 'flex', alignItems: 'center',
                                justifyContent: 'center', cursor: 'pointer', color: 'text.primary',
                                flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                            </svg>
                            {porLlamarCount > 0 && (
                                <Box sx={{
                                    position: 'absolute', top: '-5px', right: '-5px',
                                    bgcolor: t.danger, color: '#fff', fontSize: '10px',
                                    fontWeight: 700, minWidth: '17px', height: '17px',
                                    borderRadius: '9px', display: 'flex', alignItems: 'center',
                                    justifyContent: 'center', px: '3px',
                                }}>
                                    {porLlamarCount}
                                </Box>
                            )}
                        </Box>
                    </Tooltip>

                    {/* Help / Config */}
                    <Tooltip title="Configuración">
                        <Box
                            component="button"
                            onClick={() => navigate('/dashboard/config')}
                            sx={{
                                bgcolor: t.surface2, border: `1px solid ${t.border}`,
                                borderRadius: '10px', width: 38, height: 38,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                cursor: 'pointer', color: 'text.primary', flexShrink: 0,
                            }}
                        >
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                                <circle cx="12" cy="12" r="10" />
                                <path d="M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3" />
                                <path d="M12 17h.01" />
                            </svg>
                        </Box>
                    </Tooltip>
                </Box>

                {/* Page content */}
                <Box component="main" sx={{ flex: 1, p: '28px', overflow: 'auto' }}>
                    <Outlet />
                </Box>
            </Box>

            <SessionModal
                title="¿Desea mantener la sesión?"
                open={openModal}
                onClose={(action: boolean) => { reNewSession(); setOpenModal(action); }}
            />
        </Box>
    );
};
