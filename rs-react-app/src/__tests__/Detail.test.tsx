import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Detail from '../components/Detail';
import '@testing-library/jest-dom';
import { useNavigate } from 'react-router';
import { mockFetch } from '../__mocks__/fetchMock.ts';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Detail Component', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('close detail after clicking on close', async () => {
    window.fetch = mockFetch({
      birth_year: '19BBY',
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      eye_color: 'blue',
      films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/2/',
        'https://swapi.dev/api/films/3/',
        'https://swapi.dev/api/films/6/',
      ],
      gender: 'male',
      hair_color: 'blond',
      height: '172',
      homeworld: 'https://swapi.dev/api/planets/1/',
      mass: '77',
      name: 'Luke Skywalker',
      skin_color: 'fair',
      species: [],
      starships: [
        'https://swapi.dev/api/starships/12/',
        'https://swapi.dev/api/starships/22/',
      ],
      url: 'https://swapi.dev/api/people/1/',
      vehicles: [
        'https://swapi.dev/api/vehicles/14/',
        'https://swapi.dev/api/vehicles/30/',
      ],
    });

    render(<Detail detailId={'1'} />);
    const titleOnSite = await waitFor(() => screen.getByText('Close'));
    fireEvent.click(titleOnSite);
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/', search: '' })
    );
  });

  test('error on call', async () => {
    window.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Detail detailId={'da'} />);

    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching hero details:',
        expect.any(Error)
      );
    });

    consoleSpy.mockRestore();
  });

  test('renders detail component with successful fetch', async () => {
    window.fetch = mockFetch({
      birth_year: '19BBY',
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      eye_color: 'blue',
      films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/2/',
        'https://swapi.dev/api/films/3/',
        'https://swapi.dev/api/films/6/',
      ],
      gender: 'male',
      hair_color: 'blond',
      height: '172',
      homeworld: 'https://swapi.dev/api/planets/1/',
      mass: '77',
      name: 'Luke Skywalker',
      skin_color: 'fair',
      species: [],
      starships: [
        'https://swapi.dev/api/starships/12/',
        'https://swapi.dev/api/starships/22/',
      ],
      url: 'https://swapi.dev/api/people/1/',
      vehicles: [
        'https://swapi.dev/api/vehicles/14/',
        'https://swapi.dev/api/vehicles/30/',
      ],
    });

    render(<Detail detailId="1" />);
    await waitFor(() => {
      expect(screen.getByTestId('heroname')).toHaveTextContent(
        'Luke Skywalker'
      );
    });
  });

  test('calls handleClose when clicking outside the detail component', async () => {
    window.fetch = mockFetch({
      birth_year: '19BBY',
      created: '2014-12-09T13:50:51.644000Z',
      edited: '2014-12-20T21:17:56.891000Z',
      eye_color: 'blue',
      films: [
        'https://swapi.dev/api/films/1/',
        'https://swapi.dev/api/films/2/',
        'https://swapi.dev/api/films/3/',
        'https://swapi.dev/api/films/6/',
      ],
      gender: 'male',
      hair_color: 'blond',
      height: '172',
      homeworld: 'https://swapi.dev/api/planets/1/',
      mass: '77',
      name: 'Luke Skywalker',
      skin_color: 'fair',
      species: [],
      starships: [
        'https://swapi.dev/api/starships/12/',
        'https://swapi.dev/api/starships/22/',
      ],
      url: 'https://swapi.dev/api/people/1/',
      vehicles: [
        'https://swapi.dev/api/vehicles/14/',
        'https://swapi.dev/api/vehicles/30/',
      ],
    });

    render(<Detail detailId="1" />);
    await waitFor(() => {
      expect(screen.getByTestId('heroname')).toHaveTextContent(
        'Luke Skywalker'
      );
    });

    fireEvent.mouseDown(document.body);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith({ pathname: '/', search: '' });
    });
  });

  test('displays error message when fetch response is not ok', async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify({}), { status: 400 }))
    ) as unknown as typeof fetch;
    const consoleSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    render(<Detail detailId="1" />);
    await waitFor(() => {
      expect(
        screen.getByText('Error loading hero details. Please try again later.')
      );
      expect.any(Error);
    });

    consoleSpy.mockRestore();
  });

  test('displays error on network failure', async () => {
    window.fetch = jest.fn(() => Promise.reject(new Error('Network error')));
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation();

    render(<Detail detailId="da" />);
    await waitFor(() => {
      expect(consoleSpy).toHaveBeenCalledWith(
        'Error fetching hero details:',
        expect.any(Error)
      );
    });
    consoleSpy.mockRestore();
  });

  test('returns null when fetch returns null data', async () => {
    window.fetch = jest.fn(() =>
      Promise.resolve(new Response(JSON.stringify(null), { status: 200 }))
    ) as unknown as typeof fetch;

    const { container } = render(<Detail detailId="1" />);

    await waitFor(() => {
      expect(container.innerHTML).toBe('');
    });
  });
});
