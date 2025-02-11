import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
    searchTerm = localStorage.getItem('searchTerm') || '';

    let url = 'https://swapi.dev/api/people';
    if (searchTerm !== '') {
      url += `/?search=${searchTerm}`;
    }

    if (currentPage > 1 && searchTerm !== '') {
      url += `&page=${currentPage}`;
    }

    if (currentPage > 1 && searchTerm === '') {
      url += `?page=${currentPage}`;
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
          if (response.next) {
            setIsNext(true);
          } else {
            setIsNext(false);
          }
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

  const handlePageNavigation = (page: number) => {
    if (page > 0) {
      navigate(`/?page=${page}`);
      setCurrentPage(page);
    }
  };

  const handleListItemClick = (url: string) => {
    const id = url.split('/').filter(Boolean).pop();
    navigate(`/?detail=${id}`);
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
                {page > 1 ? index + (page - 1) * 10 + 1 : index + 1}
              </div>
              <div className="item-desc">{hero.name}</div>
            </li>
          ))}
        </ul>
      )}
      <div className="pagination">
        {page > 1 ? (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(page - 1)}
          >
            {page - 1}
          </button>
        ) : (
          ''
        )}
        {page == 0 ? (
          <button
            className="pageBtn active"
            onClick={() => handlePageNavigation(1)}
          >
            1
          </button>
        ) : (
          <button
            className="pageBtn active"
            onClick={() => handlePageNavigation(page)}
          >
            {page}
          </button>
        )}
        {isNext && page == 0 ? (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(page + 1)}
          >
            {page + 2}
          </button>
        ) : (
          ''
        )}
        {isNext && page > 0 ? (
          <button
            className="pageBtn"
            onClick={() => handlePageNavigation(page + 1)}
          >
            {page + 1}
          </button>
        ) : (
          ''
        )}
      </div>
    </div>
  );
}
