import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../components/Controls';

test('renders search input, button, and displays loader conditionally', () => {
  const mockOnSearch = jest.fn();

  render(<Controls onSearch={mockOnSearch} isLoading={false} />);

  expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
  expect(screen.getByText('Search')).toBeInTheDocument();
  expect(screen.queryByTestId('loader')).toBeNull();
});

test('shows loader when isLoading is true', () => {
  const mockOnSearch = jest.fn();

  render(<Controls onSearch={mockOnSearch} isLoading={true} />);

  expect(screen.getByTestId('loader')).toBeInTheDocument();
});

test('updates input value and triggers search on button click', () => {
  const mockOnSearch = jest.fn();

  render(<Controls onSearch={mockOnSearch} isLoading={false} />);

  const searchInput = screen.getByPlaceholderText('Search');
  fireEvent.change(searchInput, { target: { value: 'Luke' } });

  expect(searchInput).toHaveValue('Luke');

  fireEvent.click(screen.getByText('Search'));

  expect(localStorage.getItem('searchTerm')).toBe('Luke');
  expect(mockOnSearch).toHaveBeenCalledWith('Luke');
});
