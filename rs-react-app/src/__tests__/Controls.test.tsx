import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../components/Controls';
import '@testing-library/jest-dom';

jest.mock('../components/Loader', () => ({
  __esModule: true,
  default: () => <div>Loading...</div>,
}));

describe('Controls Component', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  test('renders input and button', () => {
    render(<Controls onSearch={jest.fn()} isLoading={false} />);

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('loads initial search value from localStorage', () => {
    localStorage.setItem('searchTerm', 'test search');
    render(<Controls onSearch={jest.fn()} isLoading={false} />);

    expect(screen.getByPlaceholderText('Search')).toHaveValue('test search');
  });

  test('updates input value on change', () => {
    render(<Controls onSearch={jest.fn()} isLoading={false} />);
    const input = screen.getByPlaceholderText('Search');

    fireEvent.change(input, { target: { value: 'new value' } });
    expect(input).toHaveValue('new value');
  });

  test('calls onSearch with correct value and stores in localStorage on button click', () => {
    const mockOnSearch = jest.fn();
    render(<Controls onSearch={mockOnSearch} isLoading={false} />);
    const input = screen.getByPlaceholderText('Search');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'query' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('query');
    expect(localStorage.getItem('searchTerm')).toBe('query');
  });

  test('does not show Loader component when isLoading is false', () => {
    render(<Controls onSearch={jest.fn()} isLoading={false} />);
    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  test('renders Loader when isLoading is true', () => {
    const onSearch = jest.fn();
    render(<Controls onSearch={onSearch} isLoading={true} />);
    expect(screen.queryByTestId('loader'));
  });
});
