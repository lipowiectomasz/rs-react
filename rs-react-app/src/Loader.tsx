import { Component } from 'react';
import './Loader.css';

export default class Loader extends Component {
  render() {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }
}
