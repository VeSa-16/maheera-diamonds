import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { HelmetProvider } from 'react-helmet-async';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from './App.tsx';
import AdminApp from './admin/AdminApp.tsx';
import './index.css';

const queryClient = new QueryClient();
const rootElement = document.getElementById('root')!;
const isRouteAdmin = window.location.pathname.startsWith('/admin');

createRoot(rootElement).render(
  <StrictMode>
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        {isRouteAdmin ? <AdminApp /> : <App />}
      </QueryClientProvider>
    </HelmetProvider>
  </StrictMode>,
);
