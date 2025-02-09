import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
} from 'react-router-dom';
import App from '../../App';
import NoPage from '../NoPage';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageHandler />} />
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function PageHandler() {
  const [searchParams] = useSearchParams();

  const pageParam = searchParams.get('page');
  const detailParam = searchParams.get('detail');

  const isPageMissingOrValid =
    !pageParam || (!isNaN(Number(pageParam)) && Number(pageParam) > 0);

  const isDetailMissingOrValid =
    !detailParam || (!isNaN(Number(detailParam)) && Number(detailParam) > 0);

  if (!isPageMissingOrValid || !isDetailMissingOrValid) {
    return <Navigate to="*" replace />;
  }

  return (
    <App
      page={pageParam ? Number(pageParam) : 0}
      detail={detailParam ? Number(detailParam) : 0}
    />
  );
}

export default Router;
