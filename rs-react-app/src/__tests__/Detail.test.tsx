import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Detail from '../components/Detail';
import { mockFetch } from '../__mocks__/fetchMock';
import { BrowserRouter } from 'react-router-dom';

describe('Detail Component', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('renders detail component with content', async () => {
    render(
      <BrowserRouter>
        <Detail detailId="1" />
      </BrowserRouter>
    );

    expect(screen.getByText(/Luke Skywalker/i)).toBeInTheDocument();
  });

  test('shows an error message if API call fails', async () => {
    mockFetch({}, true); // Simulate network failure

    render(
      <MemoryRouter>
        <Detail detailId="invalid" />
      </MemoryRouter>
    );

    const errorMessage = await screen.findByText(/Error loading hero details/i);
    expect(errorMessage).toBeInTheDocument();
  });
});
