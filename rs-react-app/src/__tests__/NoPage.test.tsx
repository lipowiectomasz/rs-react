import { render, screen } from '@testing-library/react';
import NoPage from '../components/NoPage';
import '@testing-library/jest-dom';

describe('NoPage Component', () => {
  test('renders the error message correctly', () => {
    render(<NoPage />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Error page - 404'
    );
  });
});
