import { Component } from 'react';
import '../style/Loader.css';

export default class Loader extends Component {
  render() {
    return (
      <div className="loader-container">
        <div className="spinner"></div>
      </div>
    );
  }
}
