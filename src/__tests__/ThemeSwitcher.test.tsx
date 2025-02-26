import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ThemeSwitcher from '../components/ThemeSwitcher';

describe('ThemeSwitcher Component', () => {
  let mockSetTheme: jest.Mock;

  beforeEach(() => {
    mockSetTheme = jest.fn();
    jest.spyOn(Storage.prototype, 'setItem');
    document.documentElement.setAttribute = jest.fn();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('renders correctly with light theme', () => {
    render(<ThemeSwitcher theme="light" setTheme={mockSetTheme} />);

    expect(screen.getByText(/light\/dark/i)).toBeInTheDocument();
    expect(screen.getByRole('checkbox')).not.toBeChecked();
  });

  test('renders correctly with dark theme', () => {
    render(<ThemeSwitcher theme="dark" setTheme={mockSetTheme} />);

    expect(screen.getByRole('checkbox')).toBeChecked();
  });

  test('toggles theme when clicked', () => {
    render(<ThemeSwitcher theme="light" setTheme={mockSetTheme} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'dark');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'dark'
    );
  });

  test('toggles back to light theme', () => {
    render(<ThemeSwitcher theme="dark" setTheme={mockSetTheme} />);

    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(localStorage.setItem).toHaveBeenCalledWith('theme', 'light');
    expect(document.documentElement.setAttribute).toHaveBeenCalledWith(
      'data-theme',
      'light'
    );
  });
});
