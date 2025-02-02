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

  componentDidUpdate(prevProps: CardProps) {
    if (prevProps.searchTerm !== '') {
      this.fetchSearchResults();
    }

    if (prevProps.searchTerm === '') {
      this.fetchAllResults();
    }
  }

  fetchSearchResults = () => {
    this.props.toggleLoading(true);
    console.log('fetchSearchResults');
    this.apiCall(this.props.searchTerm).then((results) => {
      this.props.toggleLoading(false);
      console.log(results);
    });

    // setTimeout(() => {
    //   // Example: Replace with actual API call logic
    //   const mockResults = [
    //     `Result for "${this.props.searchTerm}"`,
    //     'Another result',
    //   ];
    //
    //   this.setState({
    //     results: mockResults,
    //     isLoading: false,
    //   });
    //   this.props.toggleLoading(isLoading);
    // }, 1500); // Simulate network delay
  };

  fetchAllResults = () => {
    console.log('fetchAllResults');
    this.apiCall('').then((results) => {
      this.props.toggleLoading(false);
      console.log(results);
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
    return (
      <div className="card">
        <h3 className="card-title">Results</h3>
        <ul>
          <li>
            <div className="item-name head">Item name</div>
            <div className="item-desc head">Item description</div>
          </li>
          <hr />
          <li>
            <div className="item-name head">Item name</div>
            <div className="item-desc head">Item description</div>
          </li>
        </ul>
      </div>
    );
  }
}
