import { render, screen, fireEvent } from '@testing-library/react';
import ErrorBtn from '../components/ErrorBtn';
import ErrorBoundary from '../components/ErrorBoundary';

jest.spyOn(console, 'error').mockImplementation(() => {});

describe('ErrorBtn Component', () => {
  test('renders button initially', () => {
    render(<ErrorBtn />);
    expect(screen.getByText('Error Trigger'));
  });

  test('throws an error when button is clicked', () => {
    render(
      <ErrorBoundary>
        <ErrorBtn />
      </ErrorBoundary>
    );

    const button = screen.getByText('Error Trigger');

    fireEvent.click(button);

    expect(screen.getByText('Something went wrong.'));
  });

  test('logs error when button is clicked', () => {
    const logErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(
      <ErrorBoundary>
        <ErrorBtn />
      </ErrorBoundary>
    );

    const button = screen.getByText('Error Trigger');
    fireEvent.click(button);

    expect(logErrorSpy).toHaveBeenCalled();
    logErrorSpy.mockRestore();
  });
});
