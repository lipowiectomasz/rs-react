import { useState, useEffect } from 'react';
import useApi from './packages/useApi';
import '../style/Card.css';

interface CardProps {
  searchTerm: string;
  toggleLoading: (isLoading: boolean) => void;
}

interface Result {
  name: string;
}

export default function Card({ searchTerm, toggleLoading }: CardProps) {
  const [results, setResults] = useState<Result[]>([]);
  const [error, setError] = useState(false);

  useEffect(() => {
    const search = localStorage.getItem('searchTerm') || '';
    fetchResults(search);
  }, []);

  useEffect(() => {
    if (searchTerm !== '') {
      fetchResults(searchTerm);
    } else {
      fetchResults('');
    }
  }, [searchTerm]);

  const fetchResults = (search: string) => {
    setError(false);
    toggleLoading(true);

    useApi(search)
      .then((response) => {
        toggleLoading(false);
        if (response && response.results) {
          console.log(response.results);
          setResults(response.results);
        }
      })
      .catch((err) => {
        toggleLoading(false);
        setError(true);
        console.error('API error:', err);
      });
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
            <li key={index}>
              <div className="item-name">{index + 1}</div>
              <div className="item-desc">{hero.name}</div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
