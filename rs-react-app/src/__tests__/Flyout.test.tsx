import { render, screen, fireEvent } from '@testing-library/react';
import Flyout from '../components/Flyout';
import '@testing-library/jest-dom';
import { Provider, useDispatch } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import selectorReducer, {
  unselectAll,
  selectSelectedItems,
} from '../features/selector/SelectorSlice';
import { saveAs } from 'file-saver';
import { useSelector } from 'react-redux';

jest.mock('file-saver', () => ({
  saveAs: jest.fn(),
}));

jest.mock('react-redux', () => ({
  ...jest.requireActual('react-redux'),
  useSelector: jest.fn(),
  useDispatch: jest.fn(),
}));

describe('Flyout Component', () => {
  const mockDispatch = jest.fn();

  beforeEach(() => {
    (useDispatch as unknown as jest.Mock).mockReturnValue(mockDispatch);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const renderWithStore = (selectedItems: { name: string; url: string }[]) => {
    (useSelector as unknown as jest.Mock).mockImplementation((selector) =>
      selector === selectSelectedItems ? selectedItems : []
    );

    const store = configureStore({ reducer: { selector: selectorReducer } });

    return render(
      <Provider store={store}>
        <Flyout />
      </Provider>
    );
  };

  test('does not render when no items are selected', () => {
    renderWithStore([]);

    expect(screen.queryByText(/items are selected/i)).not.toBeInTheDocument();
  });

  test('renders when items are selected', () => {
    renderWithStore([
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
    ]);

    expect(screen.getByText(/1 items are selected/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /unselect all/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /download/i })
    ).toBeInTheDocument();
  });

  test('dispatches unselectAll action when "Unselect all" button is clicked', () => {
    renderWithStore([
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
    ]);

    const unselectButton = screen.getByRole('button', {
      name: /unselect all/i,
    });
    fireEvent.click(unselectButton);

    expect(mockDispatch).toHaveBeenCalledWith(unselectAll());
  });

  test('calls saveAs when "Download" button is clicked', () => {
    const selectedItems = [
      { name: 'Luke Skywalker', url: 'https://swapi.dev/api/people/1/' },
      { name: 'Darth Vader', url: 'https://swapi.dev/api/people/4/' },
    ];

    renderWithStore(selectedItems);

    const downloadButton = screen.getByRole('button', { name: /download/i });
    fireEvent.click(downloadButton);

    const expectedCsv =
      'data:text/csv;charset=utf-8,' +
      'ID,Name,Url\n' +
      '1,Luke Skywalker,https://swapi.dev/api/people/1/\n' +
      '2,Darth Vader,https://swapi.dev/api/people/4/';

    expect(saveAs).toHaveBeenCalledWith(encodeURI(expectedCsv), '2_items.csv');
  });
});
