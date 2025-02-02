import { Component } from 'react';
import Header from './Header.tsx';
import Controls from './Controls.tsx';
import Card from './Card.tsx';
import ErrorBtn from './ErrorBtn.tsx';
import './App.css';

interface AppState {
  searchTerm: string;
  isLoading: boolean;
}

interface AppProps {
  searchTerm: string;
  isLoading: boolean;
}

export default class App extends Component<AppProps, AppState> {
  constructor(props: AppProps) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      isLoading: false,
    };
  }

  handleSearch = (searchTerm: string) => {
    this.setState({ searchTerm });
  };

  toggleLoading = (isLoading: boolean) => {
    this.setState({ isLoading });
  };

  render() {
    return (
      <div className="app">
        <Header title="Star Wars heroes library"></Header>
        <Controls
          onSearch={this.handleSearch}
          searchValue={''}
          isLoading={false}
        ></Controls>
        <Card
          searchTerm={this.state.searchTerm}
          toggleLoading={this.toggleLoading}
        ></Card>
        <ErrorBtn></ErrorBtn>
      </div>
    );
  }
}
