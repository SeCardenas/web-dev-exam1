import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

class SpecsList extends Component {
  render() {
    return (
      <div className='specsList'></div>
    );
  }
}

SpecsList.propTypes = {
  onClick: PropTypes.func
};

export default SpecsList;
