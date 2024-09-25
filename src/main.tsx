
import ReactDOM from 'react-dom/client';
import "@fontsource/roboto/300.css";
import "@fontsource/roboto/400.css";
import "@fontsource/roboto/500.css";
import "@fontsource/roboto/700.css";
import { RouterProvider } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import { router } from './routes/routes.tsx';
import { Suspense } from 'react';
import BackLoading from './components/backdrop/backLoading.tsx';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1d2b75',
    },
    secondary: {
      main: '#f50057',
    },
  },
});



ReactDOM.createRoot(document.getElementById('root')!).render(
  <>
    <CssBaseline />
    <ThemeProvider theme={theme}>
      <SnackbarProvider maxSnack={3} autoHideDuration={2000}>
        <Suspense fallback={<BackLoading action={true} />}>
          <RouterProvider router={router} />
        </Suspense>
      </SnackbarProvider>
    </ThemeProvider>
  </>,
)
