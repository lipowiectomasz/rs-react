import { render, screen, fireEvent } from '@testing-library/react';
import Controls from '../components/Controls';
import '@testing-library/jest-dom';
import { MemoryRouter } from 'react-router';
import { useDispatch, useSelector, useStore } from 'react-redux';
import { selectIsLoading } from '../features/selector/SelectorSlice.tsx';

jest.mock('../components/Loader', () => ({
  __esModule: true,
  default: () => <div data-testid="loader">Loading...</div>,
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  useStore: jest.fn(),
}));

describe('Controls Component', () => {
  const mockDispatch = jest.fn();
  const useSelectorMock = jest.fn();
  const mockStore = {};

  beforeEach(() => {
    localStorage.clear();
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectIsLoading) {
        return true;
      }
      return false;
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders input and button', () => {
    useSelectorMock.mockReturnValue(false);

    render(
      <MemoryRouter>
        <Controls onSearch={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Search')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /search/i })).toBeInTheDocument();
  });

  test('loads initial search value from localStorage', () => {
    useSelectorMock.mockReturnValue(false);
    localStorage.setItem('searchTerm', 'test search');

    render(
      <MemoryRouter>
        <Controls onSearch={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText('Search')).toHaveValue('test search');
  });

  test('updates input value on change', () => {
    useSelectorMock.mockReturnValue(false);
    render(
      <MemoryRouter>
        <Controls onSearch={jest.fn()} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search');
    fireEvent.change(input, { target: { value: 'new value' } });

    expect(input).toHaveValue('new value');
  });

  test('calls onSearch with correct value and stores in localStorage on button click', () => {
    useSelectorMock.mockReturnValue(false);
    const mockOnSearch = jest.fn();

    render(
      <MemoryRouter>
        <Controls onSearch={mockOnSearch} />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('Search');
    const button = screen.getByRole('button', { name: /search/i });

    fireEvent.change(input, { target: { value: 'query' } });
    fireEvent.click(button);

    expect(mockOnSearch).toHaveBeenCalledWith('query');
    expect(localStorage.getItem('searchTerm')).toBe('query');
  });

  test('does not show Loader component when isLoading is false', () => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectIsLoading) {
        return false;
      }
      return false;
    });

    render(
      <MemoryRouter>
        <Controls onSearch={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.queryByTestId('loader')).not.toBeInTheDocument();
  });

  test('renders Loader when isLoading is true', () => {
    useSelectorMock.mockReturnValue(true);

    render(
      <MemoryRouter>
        <Controls onSearch={jest.fn()} />
      </MemoryRouter>
    );

    expect(screen.getByTestId('loader')).toBeInTheDocument();
  });
});
