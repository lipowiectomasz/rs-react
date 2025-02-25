import { render, screen } from '@testing-library/react';
import ErrorBoundary from '../components/ErrorBoundary';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBoundary Component', () => {
  test('renders children when there is no error', () => {
    render(
      <ErrorBoundary>
        <p>Normal content</p>
      </ErrorBoundary>
    );

    expect(screen.getByText('Normal content'));
  });

  test('displays fallback UI when an error is thrown', () => {
    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(screen.getByText('Something went wrong.'));
  });

  test('logs error to service when an error occurs', () => {
    const logErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    const ErrorComponent = () => {
      throw new Error('Test error');
    };

    render(
      <ErrorBoundary>
        <ErrorComponent />
      </ErrorBoundary>
    );

    expect(logErrorSpy).toHaveBeenCalled();
    logErrorSpy.mockRestore();
  });
});
