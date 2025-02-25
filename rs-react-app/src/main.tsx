import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './style/index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Router from './components/packages/PageHandler.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';

const rootElement = document.getElementById('root');
if (rootElement) {
  createRoot(rootElement).render(
    <StrictMode>
      <ErrorBoundary>
        <Provider store={store}>
          <Router></Router>
        </Provider>
      </ErrorBoundary>
    </StrictMode>
  );
}
