import { Component } from 'react';
import Header from './Header.tsx';
import Controls from './Controls.tsx';
import Card from './Card.tsx';
import ErrorBtn from './ErrorBtn.tsx';
import './App.css';

interface AppState {
  isLoading: boolean;
  searchTerm: string;
}

export default class App extends Component<object, AppState> {
  constructor(props: object) {
    super(props);
    this.state = {
      searchTerm: localStorage.getItem('searchTerm') || '',
      isLoading: false,
    };
  }

  handleSearch = (searchTerm: string) => {
    console.log(searchTerm);
    this.setState({ searchTerm: searchTerm });
  };

  handleToggleLoading = (loading: boolean) => {
    this.setState({ isLoading: loading });
  };

  render() {
    return (
      <div className="app">
        <Header title="Star Wars heroes library"></Header>
        <Controls
          onSearch={this.handleSearch}
          isLoading={this.state.isLoading}
        ></Controls>
        <Card
          searchTerm={this.state.searchTerm}
          toggleLoading={this.handleToggleLoading}
        ></Card>
        <ErrorBtn></ErrorBtn>
      </div>
    );
  }
}
