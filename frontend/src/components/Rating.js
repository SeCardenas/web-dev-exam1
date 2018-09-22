import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Rat from 'react-rating';
import './css/Rating.css';

class Rating extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: '',
      rating: 0,
      error: 'User name required'
    };
  }

  componentDidUpdate() {
    const error = this.state.user === '' ? 'User name required' : '';
    if(error !== this.state.error) this.setState({error: error});
  }

  isDisabled() {
    return this.state.user === '';
  }

  handleSubmit() {
    this.props.onSubmit(this.state.user, this.state.rating);
    this.setState({rating: 0, user: ''});
  }

  render() {
    return (
      <div className='rateSpec'>
        <h2>Rate this visualization</h2>
        <label>User name</label>
        <input type='text' size='40' value={this.state.user} onChange={e => this.setState({user: e.target.value})}/>
        <label>Rating:</label>
        <Rat initialRating={this.state.rating} onChange={val => this.setState({rating: val})}/>
        <button disabled={this.state.user === ''} onClick={() => this.handleSubmit()}>save rating</button>
        <p>{this.state.error}</p>
      </div>
    );
  }
}

Rating.propTypes = {
  onSubmit: PropTypes.func
};

export default Rating;