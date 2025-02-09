import { Component } from 'react';
import Header from './components/Header.tsx';
import Controls from './components/Controls.tsx';
import Card from './components/Card.tsx';
import ErrorBtn from './components/ErrorBtn.tsx';
import './style/App.css';

export default class App extends Component {
  constructor(props: never) {
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
