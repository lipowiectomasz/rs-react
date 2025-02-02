import { Component } from 'react';

type HeaderProps = {
  title?: string;
};

export default class Header extends Component<HeaderProps> {
  render() {
    return (
      <header>
        <h1>{this.props.title}</h1>
      </header>
    );
  }
}
