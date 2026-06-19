import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { router } from './routes/routes.tsx';
import { Suspense, useMemo } from 'react';
import BackLoading from './components/backdrop/backLoading.tsx';
import { useThemeStore, THEME_TOKENS } from './store/theme/theme.store.ts';

const bricolage = "'Bricolage Grotesque', system-ui, sans-serif";
const hanken = "'Hanken Grotesque', system-ui, sans-serif";

const AppThemeWrapper = () => {
  const themeVariant = useThemeStore(state => state.theme);
  const t = THEME_TOKENS[themeVariant];

  const theme = useMemo(() => createTheme({
    palette: {
      mode: t.mode,
      primary: { main: t.primary, dark: t.primaryDark },
      secondary: { main: t.brand },
      background: { default: t.bg, paper: t.surface },
      text: { primary: t.ink, secondary: t.muted },
      divider: t.border,
      error: { main: t.danger },
      success: { main: t.success },
      warning: { main: t.warning },
      info: { main: t.info },
    },
    typography: {
      fontFamily: hanken,
      h1: { fontFamily: bricolage, fontWeight: 800 },
      h2: { fontFamily: bricolage, fontWeight: 800 },
      h3: { fontFamily: bricolage, fontWeight: 700 },
      h4: { fontFamily: bricolage, fontWeight: 700 },
      h5: { fontFamily: bricolage, fontWeight: 700 },
      h6: { fontFamily: bricolage, fontWeight: 700 },
      button: { fontFamily: hanken, fontWeight: 700 },
    },
    shape: { borderRadius: 11 },
    components: {
      MuiCssBaseline: {
        styleOverrides: `
          * { box-sizing: border-box; }
          body { -webkit-font-smoothing: antialiased; background: ${t.bg}; }
          ::placeholder { color: ${t.muted}; opacity: 1; }
        `,
      },
      MuiPaper: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            border: `1px solid ${t.border}`,
            boxShadow: t.shadow,
            backgroundImage: 'none',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 700,
            borderRadius: 11,
            fontFamily: hanken,
          },
          containedPrimary: {
            boxShadow: `0 6px 16px ${t.primary}33`,
            '&:hover': { backgroundColor: t.primaryDark },
          },
        },
      },
      MuiTextField: {
        styleOverrides: {
          root: {
            '& .MuiOutlinedInput-root': {
              borderRadius: 11,
              backgroundColor: t.surface2,
              '& fieldset': { borderColor: t.border },
              '&:hover fieldset': { borderColor: t.primary },
            },
          },
        },
      },
      MuiOutlinedInput: {
        styleOverrides: {
          root: {
            borderRadius: 11,
            backgroundColor: t.surface2,
          },
          notchedOutline: { borderColor: t.border },
        },
      },
      MuiSelect: {
        styleOverrides: {
          root: { borderRadius: 11 },
        },
      },
      MuiTableHead: {
        styleOverrides: {
          root: { backgroundColor: t.surface2 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          head: {
            fontSize: '11.5px',
            textTransform: 'uppercase',
            letterSpacing: '0.6px',
            color: t.muted,
            fontWeight: 700,
            backgroundColor: t.surface2,
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: { borderRadius: 8, fontWeight: 700, fontSize: '11px' },
        },
      },
      MuiDialog: {
        styleOverrides: {
          paper: { borderRadius: 18 },
        },
      },
      MuiCard: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: { borderRadius: 18 },
        },
      },
      MuiAppBar: {
        defaultProps: { elevation: 0 },
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            borderBottom: `1px solid ${t.border}`,
          },
        },
      },
    },
  }), [themeVariant]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Suspense fallback={<BackLoading action={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </SnackbarProvider>
    </ThemeProvider>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <AppThemeWrapper />
);
