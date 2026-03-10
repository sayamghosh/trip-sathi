import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider, createRouter } from '@tanstack/react-router';
import { routeTree } from './routeTree.gen';
import './index.css';

import { GoogleOAuthProvider } from '@react-oauth/google';
import { AuthProvider } from './context/AuthContext';
import { AuthFlowProvider } from './context/AuthFlowContext';
import SmoothScroll from './components/SmoothScroll';

const router = createRouter({ routeTree });

import { Toaster } from 'react-hot-toast';

const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || 'your_google_client_id_here';

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <AuthFlowProvider>
        <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
          <Toaster position="top-center" reverseOrder={false} />
          <SmoothScroll>
            <RouterProvider router={router} />
          </SmoothScroll>
        </GoogleOAuthProvider>
      </AuthFlowProvider>
    </AuthProvider>
  </React.StrictMode>,
);
