
import ReactDOM from 'react-dom/client';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { router } from './routes/routes.tsx';
import { Suspense, useMemo } from 'react';
import BackLoading from './components/backdrop/backLoading.tsx';
import { useThemeStore } from './store/theme/theme.store.ts';

const AppThemeWrapper = () => {
  const primaryColor = useThemeStore(state => state.primaryColor);
  const mode = useThemeStore(state => state.mode);

  const theme = useMemo(() => createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
      },
      secondary: {
        main: '#f50057',
      },
    },
  }), [primaryColor, mode]);

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
)
