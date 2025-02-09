import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import Card from '../components/Card';
import { mockFetch } from '../__mocks__/fetchMock';
import { BrowserRouter } from 'react-router-dom';

describe('Card Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders results from API call', async () => {
    render(
      <BrowserRouter>
        <Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />
      </BrowserRouter>
    );

    expect(screen.getByText('Results')).toBeInTheDocument();
    const heroItems = await screen.findAllByText(/Luke Skywalker|Darth Vader/i);
    expect(heroItems.length).toBeGreaterThan(0);
  });

  test('shows an error message if API call fails', async () => {
    mockFetch({}, true);

    render(<Card searchTerm="invalid" toggleLoading={jest.fn()} page={1} />);

    const errorMessage = await screen.findByText(/The API is not responding/i);
    expect(errorMessage).toBeInTheDocument();
  });

  test('navigates to detail page on hero item click', () => {
    mockFetch({
      results: [
        { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      ],
    });

    const navigate = jest.fn();
    render(
      <Card searchTerm="Luke" toggleLoading={jest.fn()} page={1} />
    );

    waitFor(() => {
      const heroItem = screen.getByText('Luke Skywalker');
      fireEvent.click(heroItem);
      expect(navigate).toHaveBeenCalledWith('/?detail=1');
    });
  });
});
