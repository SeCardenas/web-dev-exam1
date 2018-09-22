import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './css/Upload.css';

class Upload extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: '',
      title: '',
      error: props.valid ? 'User name and visualization title required' : 'Invalid spec'
    };
  }

  isDisabled() {
    return !this.props.valid || this.state.user === '' || this.state.title === '';
  }

  componentDidUpdate() {
    const error = this.props.valid ? (this.state.user === '' || this.state.title === '' ? 'User name and visualization title required' : '') : 'Invalid spec';
    if(this.state.error !== error) this.setState({error: error});
  }

  handleClick() {
    this.props.onSubmit(this.state.user, this.state.title);
    this.setState({user: '', title: ''});
  }

  render() {
    return (
      <div className='uploadSpec'>
        <h2>Save visualization</h2>
        <label>User name:</label>
        <input type='text' size='40' onChange={e => this.setState({user: e.target.value})} value={this.state.user}/>
        <label>Visualization title:</label>
        <input type='text' size='40' onChange={e => this.setState({title: e.target.value})} value={this.state.title}/>
        <button disabled={this.isDisabled()} onClick={() => this.handleClick()}>save</button>
        <span className='submitMsg'>{this.state.error}</span>
      </div>
    );
  }
}

Upload.propTypes = {
  valid: PropTypes.bool,
  onSubmit: PropTypes.func
};

export default Upload;
