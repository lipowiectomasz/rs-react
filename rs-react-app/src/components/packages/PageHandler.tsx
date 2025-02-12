import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useSearchParams,
  useParams,
} from 'react-router';
import App from '../../App';
import NoPage from '../NoPage';
import Detail from '../Detail';

function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PageHandler />}>
          <Route path="detail/:detailId" element={<DetailWrapper />} />
        </Route>
        <Route path="*" element={<NoPage />} />
      </Routes>
    </BrowserRouter>
  );
}

function PageHandler() {
  const [searchParams] = useSearchParams();
  const pageParam = searchParams.get('page');

  const isPageMissingOrValid =
    !pageParam || (!isNaN(Number(pageParam)) && Number(pageParam) > 0);

  if (!isPageMissingOrValid) {
    return <Navigate to="*" replace />;
  }

  return <App page={pageParam ? Number(pageParam) : 0} />;
}

function DetailWrapper() {
  const { detailId } = useParams();
  return detailId ? <Detail detailId={detailId} /> : null;
}

export default Router;
