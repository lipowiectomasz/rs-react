import { render, screen, waitFor } from '@testing-library/react';
import Router from '../components/packages/PageHandler';

jest.mock(
  '../App',
  () =>
    ({ children, page }: { children?: React.ReactNode; page: number }) => (
      <div>
        <p>App Component, page: {page}</p>
        {children}
      </div>
    )
);
jest.mock('../components/NoPage', () => () => <div>No Page Found</div>);
jest.mock('../components/Detail', () => (props: { detailId: string }) => (
  <div>Detail Component {props.detailId}</div>
));

describe('Router Component', () => {
  beforeEach(() => {
    window.history.pushState({}, 'Test page', '/');
  });

  test('renders App component on default route with no search param', async () => {
    window.history.pushState({}, 'Test page', '/');
    render(<Router />);
    await waitFor(() => {
      expect(screen.getByText(/App Component, page: 0/i));
    });
  });

  test('renders App component with a valid "page" search param', async () => {
    window.history.pushState({}, 'Test page', '/?page=2');
    render(<Router />);
    await waitFor(() => {
      expect(screen.getByText(/App Component, page: 2/i));
    });
    expect(screen.queryByText('No Page Found')).toBeNull();
  });

  test('redirects to NoPage when an invalid "page" search param is provided', async () => {
    window.history.pushState({}, 'Test page', '/?page=0');
    render(<Router />);
    await waitFor(() => {
      expect(screen.getByText('No Page Found'));
    });
  });

  test('renders Detail component when navigating to a detail route', async () => {
    window.history.pushState({}, 'Test page', '/detail/12');
    render(<Router />);
    await waitFor(() => {
      expect(screen.getByText('Detail Component 12'));
    });
  });

  test('renders NoPage for an unknown route', async () => {
    window.history.pushState({}, 'Test page', '/unknown');
    render(<Router />);
    await waitFor(() => {
      expect(screen.getByText('No Page Found'));
    });
  });
});
