import { Component } from 'react';
import './ErrorBtn.css';

interface ErrorBtnState {
  shouldThrowError: boolean;
}

export default class ErrorBtn extends Component<object, ErrorBtnState> {
  constructor(props: object) {
    super(props);
    this.state = { shouldThrowError: false };
  }

  handleClick = () => {
    this.setState({ shouldThrowError: true });
  };

  render() {
    if (this.state.shouldThrowError) {
      throw new Error('An intentional error has occurred!');
    }

    return (
      <div className="error-btn-box">
        <button onClick={this.handleClick}>Error Trigger</button>
      </div>
    );
  }
}
