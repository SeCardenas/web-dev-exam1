import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';

class SpecElement extends Component {
  renderVega() {
    const embed_opt = {'mode': 'vega-lite'};
    if(this.props.data !== null) {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.insert(this.props.json.data.name, this.props.data).run();
        })
        .catch(error => console.log(error));
    }
    else {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.run();
        })
        .catch(error => console.log(error));
    }
  }

  componentDidMount() {
    this.renderVega();
  }

  render() {
    return (
      <div ref={(div) => this.div=div} onClick={() => this.props.onClick(this.props._id, this.props.json, this.props.data, this.props.ratings)}></div>
    );
  }
}

SpecElement.propTypes = {
  _id: PropTypes.string,
  json: PropTypes.object,
  data: PropTypes.array,
  ratings: PropTypes.array,
  onClick: PropTypes.func
};

export default SpecElement;
