import { Component, ChangeEvent } from 'react';
import './Controls.css';
import Loader from './Loader';

interface ControlsState {
  searchValue: string;
  isLoading: boolean;
}

interface ControlsProps {
  searchValue: string;
  isLoading: boolean;
  onSearch: (searchTerm: string) => void;
}

export default class Controls extends Component<ControlsProps, ControlsState> {
  constructor(props: ControlsProps) {
    super(props);
    this.state = {
      isLoading: false,
      searchValue: localStorage.getItem('searchTerm') || '',
    };
  }

  handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    this.setState({ searchValue: event.target.value });
  };

  handleSearch = () => {
    const { searchValue } = this.state;
    localStorage.setItem('searchTerm', searchValue);
    this.props.onSearch(searchValue);
  };

  componentDidMount() {
    setTimeout(() => {
      this.setState({ isLoading: false });
    }, 3000);

    const { searchValue } = this.state;
    if (searchValue.trim() !== '') {
      localStorage.setItem('searchTerm', searchValue);
      this.props.onSearch(searchValue);
    }
  }

  render() {
    const { isLoading, searchValue } = this.state;

    return (
      <div className="controls">
        <input
          type="text"
          placeholder="Search"
          name="search"
          value={searchValue}
          onChange={this.handleInputChange}
        ></input>
        {isLoading ? <Loader /> : null}
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}
