import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Card from '../components/Card';
import { useNavigate, useLocation } from 'react-router';
import { mockFetch } from '../__mocks__/fetchMock';
import Detail from "../components/Detail.tsx";

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('Card Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
      search: '',
    });
  });

  test('renders results from API call', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: '',
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    });
    render(<Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />);
    await waitFor(() => screen.getByText('Results'));
    await waitFor(() => expect(screen.getByText('Luke Skywalker')));
  });

  test('shows an error message if API call fails (network error)', async () => {
    window.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    render(<Card searchTerm="invalid" toggleLoading={jest.fn()} page={1} />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API error:', expect.any(Error));
    });
    consoleSpy.mockRestore();
  });

  test('handles non-ok response from API', async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve({
        ok: false,
        json: () => Promise.resolve({}),
      })
    ) as unknown as typeof fetch;
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();
    const toggleLoading = jest.fn();
    render(<Card searchTerm="Luke" toggleLoading={toggleLoading} page={1} />);
    await waitFor(() => {
      expect(toggleLoading).toHaveBeenCalledWith(false);
      expect(
        screen.getByText('The API is not responding. Please try again later.')
      );
      expect.any(Error);
    });

    consoleSpy.mockRestore();
  });

  test('navigates to detail page on hero item click without search params', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: '',
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    });
    const toggleLoading = jest.fn();
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
      search: '',
    });
    render(<Card searchTerm="Luke" toggleLoading={toggleLoading} page={1} />);
    const heroItem = await screen.findByText('Luke Skywalker');
    fireEvent.click(heroItem);
    expect(mockNavigate).toHaveBeenCalledWith('/detail/1');
  });

  test('navigates to detail page on hero item click with search params', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: '',
      previous: null,
      results: [
        {
          name: 'Darth Vader',
          url: 'https://swapi.dev/api/people/4/',
        },
      ],
    });
    const toggleLoading = jest.fn();
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/somepath',
      search: '?sort=asc',
    });
    render(<Card searchTerm="Vader" toggleLoading={toggleLoading} page={1} />);
    const heroItem = await screen.findByText('Darth Vader');
    fireEvent.click(heroItem);
    expect(mockNavigate).toHaveBeenCalledWith('/detail/4/somepath?sort=asc');
  });

  test('navigates to the next page on pagination button click when isNext is true', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
      results: [
        {
          name: 'Luke Skywalker',
          url: 'https://swapi.dev/api/people/1/',
        },
      ],
    });
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
      search: '',
    });
    const toggleLoading = jest.fn();
    render(<Card searchTerm="Luke" toggleLoading={toggleLoading} page={1} />);
    await waitFor(() => screen.getByText('Results'));
    const nextPageButton = await waitFor(() => screen.getByText('2'));
    fireEvent.click(nextPageButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'page=2',
    });
  });

  test('navigates to the previous page on pagination button click when currentPage > 1', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: 'https://swapi.dev/api/people/?page=3',
      previous: null,
      results: [
        {
          name: 'Leia Organa',
          url: 'https://swapi.dev/api/people/5/',
        },
      ],
    });
    (useLocation as jest.Mock).mockReturnValue({
      pathname: '/',
      search: '',
    });
    const toggleLoading = jest.fn();
    render(<Card searchTerm="Leia" toggleLoading={toggleLoading} page={2} />);
    await waitFor(() => screen.getByText('Leia Organa'));
    const previousButton = screen.getByText('1');
    fireEvent.click(previousButton);
    expect(mockNavigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'page=1',
    });
  });

  test('clicking active pagination button navigates with current page', async () => {
    window.fetch = mockFetch({
      count: 82,
      next: 'https://swapi.dev/api/people/?page=2',
      previous: null,
      results: [{ name: 'Test Hero', url: 'https://swapi.dev/api/people/1/' }],
    });
    (useLocation as jest.Mock).mockReturnValue({ pathname: '/', search: '' });
    const toggleLoading = jest.fn();
    render(<Card searchTerm="Test" toggleLoading={toggleLoading} page={1} />);
    const activeButton = await screen.findByText('1');
    fireEvent.click(activeButton);
    expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/', search: 'page=1' });
  });
});
