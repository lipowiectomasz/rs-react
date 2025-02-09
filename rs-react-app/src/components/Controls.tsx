import { Component, ChangeEvent } from 'react';
import '../style/Controls.css';
import Loader from './Loader.tsx';

interface ControlsState {
  searchValue: string;
}

interface ControlsProps {
  onSearch: (searchTerm: string) => void;
  isLoading: boolean;
}

export default class Controls extends Component<ControlsProps, ControlsState> {
  constructor(props: ControlsProps) {
    super(props);
    this.state = {
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

  render() {
    const { searchValue } = this.state;

    return (
      <div className="controls">
        <input
          type="text"
          placeholder="Search"
          name="search"
          value={searchValue}
          onChange={this.handleInputChange}
        ></input>
        {this.props.isLoading ? <Loader /> : null}
        <button onClick={this.handleSearch}>Search</button>
      </div>
    );
  }
}
