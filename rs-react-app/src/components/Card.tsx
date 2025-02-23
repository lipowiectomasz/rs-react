import { useNavigate, useLocation } from 'react-router';
import '../style/Card.css';
import { useSelector, useDispatch } from 'react-redux';
import { Hero, selectSelectedItems } from '../features/selector/SelectorSlice';
import { selectItem, unselectItem } from '../features/selector/SelectorSlice';
import { useFetchCharactersQuery } from '../features/api/starWarsApi';

interface CardProps {
  searchTerm: string;
  page: number;
}

export default function Card({ searchTerm, page = 0 }: CardProps) {
  const dispatch = useDispatch();
  const selectedItems = useSelector(selectSelectedItems);
  const navigate = useNavigate();
  const location = useLocation();
  const { data, error, isLoading } = useFetchCharactersQuery({
    search: searchTerm,
    page,
  });
  const results = data?.results || [];
  const isNext = !!data?.next;

  const handleSelect = (item: Hero) => {
    if (selectedItems.find((selected) => selected.name === item.name)) {
      dispatch(unselectItem(item.name));
    } else {
      dispatch(selectItem(item));
    }
  };

  const handleListItemClick = (url: string) => {
    const id = url.split('/').filter(Boolean).pop();
    const searchParams = new URLSearchParams(location.search);
    if (searchParams.toString() != '') {
      navigate(
        `/detail/${id}` + `${location.pathname}?${searchParams.toString()}`
      );
    } else {
      navigate(`/detail/${id}`);
    }
  };

  const handlePageNavigation = (page: number) => {
    if (page > 0) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());

      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      });
    }
  };

  if (isLoading) {
    return <div className="loading-box">Loading...</div>;
  }

  return (
    <div className="card">
      <h3 className="card-title">Results</h3>
      {error ? (
        <div className="error-message">
          The API is not responding. Please try again later.
        </div>
      ) : (
        <ul>
          <li>
            <div className="item-name head">Item number</div>
            <div className="item-desc head">Item description</div>
          </li>
          <hr />
          {results.map((hero, index) => (
            <li key={hero.name}>
              <input
                className="item-input"
                type="checkbox"
                checked={
                  !!selectedItems.find(
                    (selected) => selected.name === hero.name
                  )
                }
                onChange={() => handleSelect(hero)}
              />
              <div
                className="item"
                onClick={() => handleListItemClick(hero.url)}
              >
                <div className="item-name">
                  {page > 1 ? index + (page - 1) * 10 + 1 : index + 1}
                </div>
                <div className="item-desc">{hero.name}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        {page > 1 && (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(page - 1)}
          >
            {page - 1}
          </button>
        )}
        <button
          className="pageBtn active"
          onClick={() => handlePageNavigation(page || 1)}
        >
          {page || 1}
        </button>
        {isNext && (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(page == 0 ? 2 : page + 1)}
          >
            {page == 0 ? 2 : page + 1}
          </button>
        )}
      </div>
    </div>
  );
}
