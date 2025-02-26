import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Card from '../components/Card';
import '@testing-library/jest-dom';
import { useSelector, useDispatch, useStore } from 'react-redux';
import { MemoryRouter, useNavigate } from 'react-router';
import { useFetchCharactersQuery } from '../features/api/starWarsApi';
import {
  selectSelectedItems,
  selectItem,
  unselectItem,
} from '../features/selector/SelectorSlice';

jest.mock('../features/api/starWarsApi', () => ({
  ...jest.requireActual('../features/api/starWarsApi'),
  useFetchCharactersQuery: jest.fn(),
}));

jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
  useStore: jest.fn(),
}));

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Card Component API Mocking', () => {
  let selectedItems: { name: string; url: string }[] = [];
  const mockSelectedItems = {
    results: [
      { name: 'Luke Skywalker', url: '/detail/1/' },
      { name: 'Darth Vader', url: '/detail/2/' },
    ],
    next: '/api/people/?page=2',
  };

  const mockDispatch = jest.fn();
  const mockStore = {};
  const mockNavigate = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
    (useStore as unknown as jest.Mock).mockReturnValue(mockStore);
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectSelectedItems) return selectedItems;
      return [];
    });
    (useNavigate as unknown as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
    selectedItems = [];
  });

  test('renders Card component with mocked API response', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: mockSelectedItems,
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    expect(await screen.findByText('Results')).toBeInTheDocument();
    expect(screen.getByText('Luke Skywalker')).toBeInTheDocument();
    expect(screen.getByText('Darth Vader')).toBeInTheDocument();
  });

  test('displays an error message when API request fails', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: null,
      error: { message: 'Not Found' },
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    expect(
      await screen.findByText(
        'The API is not responding. Please try again later.'
      )
    ).toBeInTheDocument();
  });

  test('renders loading state', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: null,
      error: null,
      isLoading: true,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    expect(await screen.findByText('Loading...')).toBeInTheDocument();
  });

  test('selecting an item dispatches selectItem action', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: { results: [{ name: 'Luke Skywalker', url: '/detail/1/' }] },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(
        selectItem({
          name: 'Luke Skywalker',
          url: '/detail/1/',
        })
      );
    });
  });

  test('unselecting an item dispatches unselectItem action', async () => {
    selectedItems = [{ name: 'Luke Skywalker', url: '/detail/1/' }];

    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectSelectedItems) return selectedItems;
      return [];
    });

    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: { results: [{ name: 'Luke Skywalker', url: '/detail/1/' }] },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    const checkbox = screen.getByRole('checkbox');

    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalledWith(unselectItem('Luke Skywalker'));
    });

    selectedItems = [];
    (useSelector as unknown as jest.Mock).mockImplementation((selector) => {
      if (selector === selectSelectedItems) return selectedItems;
      return [];
    });

    expect(selectedItems).toEqual([]);
  });

  test('navigates to detail page when clicking on an item', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: { results: [{ name: 'Luke Skywalker', url: '/detail/1/' }] },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    fireEvent.click(screen.getByText('Luke Skywalker'));

    expect(mockNavigate).toHaveBeenCalledWith('/detail/1');
  });

  test('pagination buttons work correctly', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: mockSelectedItems,
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    const nextPageButton = screen
      .getAllByText('2')
      .find((btn) => btn.tagName === 'BUTTON');
    expect(nextPageButton).toBeInTheDocument();
    if (nextPageButton) fireEvent.click(nextPageButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'page=2',
    });

    const activePageButton = screen
      .getAllByText('1')
      .find((btn) => btn.tagName === 'BUTTON');
    expect(activePageButton).toBeInTheDocument();
    if (activePageButton) fireEvent.click(activePageButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'page=1',
    });
  });

  test('handles missing pagination correctly', async () => {
    (useFetchCharactersQuery as jest.Mock).mockReturnValue({
      data: { results: [], next: null },
      error: null,
      isLoading: false,
    });

    render(
      <MemoryRouter>
        <Card searchTerm="Luke" page={1} />
      </MemoryRouter>
    );

    expect(screen.queryByText('2')).not.toBeInTheDocument();
  });
});
