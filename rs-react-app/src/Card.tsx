import { Component } from 'react';
import './Card.css';

interface CardProps {
  searchTerm: string;
  toggleLoading: (isLoading: boolean) => void;
}

interface CardState {
  results: string[];
}

export default class Card extends Component<CardProps, CardState> {
  constructor(props: CardProps) {
    super(props);
    this.state = {
      results: [],
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
    this.props.toggleLoading(true);
    this.apiCall(search).then((results) => {
      this.props.toggleLoading(false);
      this.setState({ results: results.results });
    });
  };

  apiCall = (search: string) => {
    let url = 'https://swapi.dev/api/people';

    if (search !== '') {
      url += `/?search=${search}`;
    }

    return fetch(url)
      .then(function (res) {
        return res.json();
      })
      .then(function (data) {
        return data;
      })
      .catch(function (err) {
        console.log(err);
      });
  };

  render() {
    const { results } = this.state;
    return (
      <div className="card">
        <h3 className="card-title">Results</h3>
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
      </div>
    );
  }
}
