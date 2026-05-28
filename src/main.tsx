import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { registerSW } from 'virtual:pwa-register';
import { HelmetProvider } from 'react-helmet-async';
import App from './App.tsx';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import { AuthProvider } from './contexts/AuthContext.tsx';
import { initGlobalInputBehavior } from './globalInputBehavior.ts';
import './index.css';

// Initialize global input formatting site-wide immediately 
initGlobalInputBehavior();

// Register the PWA service worker
const updateSW = registerSW({
  onNeedRefresh() {
    // Optionally prompt user to hit refresh
  },
  onOfflineReady() {
    console.log('App is ready to work offline');
  },
})

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <ErrorBoundary>
        <AuthProvider>
          <App />
        </AuthProvider>
      </ErrorBoundary>
    </HelmetProvider>
  </StrictMode>,
);
