import { StrictMode } from 'react';
import './style/index.css';
import ErrorBoundary from './components/ErrorBoundary.tsx';
import Router from './components/packages/PageHandler.tsx';
import { Provider } from 'react-redux';
import { store } from './app/store';

export default function Main() {
  return (
    <StrictMode>
      {/*<ErrorBoundary>*/}
      <Provider store={store}>
        <Router></Router>
      </Provider>
      {/*</ErrorBoundary>*/}
    </StrictMode>
  );
}
