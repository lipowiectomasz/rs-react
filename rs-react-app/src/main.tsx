import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Router from './components/packages/PageHandler.tsx';

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <Router></Router>
    </ErrorBoundary>
  </StrictMode>
);
