import {
  render,
  screen,
  fireEvent,
  waitFor,
  act,
} from '@testing-library/react';
import Detail from '../components/Detail';
import '@testing-library/jest-dom';
import { Provider } from 'react-redux';
import { store } from '../app/store';
import { starWarsApi } from '../features/api/starWarsApi';
import { useNavigate } from 'react-router';

jest.mock('react-router', () => ({
  ...jest.requireActual('react-router'),
  useNavigate: jest.fn(),
}));

describe('Detail Component with RTK Query Mock', () => {
  let mockNavigate: jest.Mock;

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(console, 'error').mockImplementation((message) => {
      if (typeof message === 'string' && message.includes('API error')) {
        return;
      }
      console.error(message);
    });
    mockNavigate = jest.fn();
    (useNavigate as jest.Mock).mockReturnValue(mockNavigate);
  });

  afterEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
    jest.restoreAllMocks();
    act(() => {
      store.dispatch(starWarsApi.util.resetApiState());
    });
  });

  test('renders detail component with successful API response', async () => {
    await act(async () => {
      store.dispatch(starWarsApi.endpoints.fetchCharacterDetails.initiate('1'));
    });

    render(
      <Provider store={store}>
        <Detail detailId="1" />
      </Provider>
    );

    await waitFor(() => {
      expect(screen.getByTestId('heroname')).toHaveTextContent(
        'Luke Skywalker'
      );
    });
  });

  test('closes detail when clicking close button', async () => {
    const logErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});

    await act(async () => {
      store.dispatch(starWarsApi.endpoints.fetchCharacterDetails.initiate('1'));
    });

    render(
      <Provider store={store}>
        <Detail detailId="1" />
      </Provider>
    );

    const closeButton = await screen.findByText('Close');
    act(() => {
      fireEvent.click(closeButton);
    });

    await waitFor(() => expect(mockNavigate).toHaveBeenCalledWith('/'));

    logErrorSpy.mockRestore();
  });

  test('displays error message when API call fails', async () => {
    const logErrorSpy = jest
      .spyOn(console, 'error')
      .mockImplementation((message) => {
        if (typeof message === 'string' && message.includes('API error')) {
          return;
        }
        console.error(message);
      });

    await act(async () => {
      store.dispatch(
        starWarsApi.endpoints.fetchCharacterDetails.initiate('invalid-id')
      );
    });

    render(
      <Provider store={store}>
        <Detail detailId="invalid-id" />
      </Provider>
    );

    await waitFor(() => {
      expect(
        screen.getByText('Error loading hero details. Please try again later.')
      ).toBeInTheDocument();
    });

    const closeButton = screen.getByText('Close');
    fireEvent.click(closeButton);

    await waitFor(() => {
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });

    logErrorSpy.mockRestore();
  });
});
