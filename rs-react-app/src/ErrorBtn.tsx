import { Component } from 'react';
import './ErrorBtn.css';

export default class ErrorBtn extends Component {
  render() {
    return (
      <div className="error-btn-box">
        <button>Error Trigger</button>
      </div>
    );
  }
}
