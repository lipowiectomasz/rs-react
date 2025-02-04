import { Component } from 'react';
import './Card.css';

interface CardProps {
  searchTerm: string;
  toggleLoading: (isLoading: boolean) => void;
}

interface CardState {
  results: string[];
  error: boolean;
}

export default class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      results: [],
      error: false,
    };
  }

  componentDidMount() {
    const search = localStorage.getItem('searchTerm') || '';
    this.fetchResults(search);
  }

  componentDidUpdate(prevProps: CardProps) {
    if (
      prevProps.searchTerm !== '' &&
      prevProps.searchTerm !== this.props.searchTerm
    ) {
      this.fetchResults(this.props.searchTerm);
    }

    if (
      prevProps.searchTerm === '' &&
      prevProps.searchTerm !== this.props.searchTerm
    ) {
      this.fetchResults('');
    }
  }

  fetchResults = (search: string) => {
    this.setState({ error: false });
    this.props.toggleLoading(true);

    this.apiCall(search)
      .then((results) => {
        this.props.toggleLoading(false);
        if (results && results.results) {
          this.setState({ results: results.results });
        }
      })
      .catch((err) => {
        this.props.toggleLoading(false);
        this.setState({ error: true });
        console.log('API error:', err);
      });
  };

  apiCall = (search: string) => {
    let url = 'https://swapi.dev/api/people';

    if (search !== '') {
      url += `/?search=${search}`;
    }

    return fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        return res.json();
      })
      .catch((err) => {
        throw err;
      });
  };

  render() {
    const { results, error } = this.state;

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
}
