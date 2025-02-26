import { render, screen } from '@testing-library/react';
import Header from '../components/Header';
import '@testing-library/jest-dom';

describe('Header Component', () => {
  test('renders the provided title', () => {
    render(<Header title="Star Wars Heroes Library" />);
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent(
      'Star Wars Heroes Library'
    );
  });

  test('renders an empty h1 when no title is provided', () => {
    render(<Header />);
    expect(screen.getByRole('heading', { level: 1 })).toBeEmptyDOMElement();
  });
});
