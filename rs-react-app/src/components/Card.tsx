import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router';
import '../style/Card.css';

interface CardProps {
  searchTerm: string;
  toggleLoading: (isLoading: boolean) => void;
  page: number;
}

interface Result {
  name: string;
  url: string;
}

export default function Card({
  searchTerm,
  toggleLoading,
  page = 0,
}: CardProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState(false);
  const [isNext, setIsNext] = useState(false);
  const [currentPage, setCurrentPage] = useState(page);

  useEffect(() => {
    setError(false);
    toggleLoading(true);

    const localSearchTerm = localStorage.getItem('searchTerm') || searchTerm;

    let url = 'https://swapi.dev/api/people';
    if (localSearchTerm !== '') {
      url += `/?search=${localSearchTerm}`;
    }

    if (currentPage > 1) {
      url +=
        localSearchTerm !== ''
          ? `&page=${currentPage}`
          : `?page=${currentPage}`;
    }

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .then((response) => {
        toggleLoading(false);
        if (response && response.results) {
          setIsNext(!!response.next);
          setResults(response.results);
        }
      })
      .catch((err) => {
        toggleLoading(false);
        setError(true);
        console.error('API error:', err);
      });
  }, [searchTerm, currentPage]);

  const navigate = useNavigate();
  const location = useLocation();

  const handleListItemClick = (url: string) => {
    const id = url.split('/').filter(Boolean).pop();
    const searchParams = new URLSearchParams(location.search);
    navigate(
      `/detail/${id}` + `${location.pathname}?${searchParams.toString()}`
    );
  };

  const handlePageNavigation = (page: number) => {
    if (page > 0) {
      const searchParams = new URLSearchParams(location.search);
      searchParams.set('page', page.toString());

      navigate({
        pathname: location.pathname,
        search: searchParams.toString(),
      });

      setCurrentPage(page);
    }
  };

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
            <li key={index} onClick={() => handleListItemClick(hero.url)}>
              <div className="item-name">
                {currentPage > 1
                  ? index + (currentPage - 1) * 10 + 1
                  : index + 1}
              </div>
              <div className="item-desc">{hero.name}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        {currentPage > 1 && (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(currentPage - 1)}
          >
            {currentPage - 1}
          </button>
        )}
        <button
          className="pageBtn active"
          onClick={() => handlePageNavigation(currentPage || 1)}
        >
          {currentPage || 1}
        </button>
        {isNext && (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(currentPage + 1)}
          >
            {currentPage + 1}
          </button>
        )}
      </div>
    </div>
  );
}
