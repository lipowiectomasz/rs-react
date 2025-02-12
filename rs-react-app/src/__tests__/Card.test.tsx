import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Card from '../components/Card';
import { useNavigate, useLocation } from 'react-router';
import { mockFetch } from '../__mocks__/fetchMock.ts';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
  useLocation: jest.fn(),
}));

describe('Card Component', () => {
  let mockNavigate: jest.Mock;
  let mockLocation: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
    (useLocation as jest.Mock).mockReturnValue(mockLocation);
  });

  beforeEach(() => {
    jest.clearAllMocks();

    (useNavigate as jest.Mock).mockReturnValue(jest.fn());
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
    expect(await waitFor(() => screen.getByText('Results')));
    await waitFor(() => screen.getByText('Luke Skywalker'));
  });

  test('shows an error message if API call fails', async () => {
    window.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Card searchTerm="invalid" toggleLoading={jest.fn()} page={1} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith('API error:', expect.any(Error));
    });

    consoleSpy.mockRestore();
  });

  test('navigates to detail page on hero item click', () => {
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

    const navigate = jest.fn();
    render(<Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />);

    waitFor(() => {
      const heroItem = screen.getByText('Luke Skywalker');
      fireEvent.click(heroItem);
      expect(navigate).toHaveBeenCalledWith('/detail/1');
    });
  });

  test('navigates to the correct page on pagination button click', async () => {
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

    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(<Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />);

    await waitFor(() => expect(screen.getByText('Results')));

    const nextPageButton = screen.getByText('2');
    fireEvent.click(nextPageButton);

    expect(navigate).toHaveBeenCalledWith({
      pathname: '/',
      search: 'page=2',
    });
  });

  test('navigates to detail page on hero item click', async () => {
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

    const navigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(navigate);

    render(<Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />);

    const heroItem = await screen.findByText('Luke Skywalker');

    fireEvent.click(heroItem);

    expect(navigate).toHaveBeenCalledWith('/detail/1');
  });
});
