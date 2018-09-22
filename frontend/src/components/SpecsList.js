import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SpecElement from './SpecElement';
import ScrollArea from 'react-scrollbar';

class SpecsList extends Component {
  render() {
    const list = this.props.history.map(elem => {
      const jsonCopy = JSON.parse(JSON.stringify(elem.json));
      jsonCopy.$schema = elem.json.schema;
      jsonCopy.schema = undefined;
      return (
        <SpecElement key={elem._id}
          _id={elem._id}
          json={jsonCopy}
          data={elem.data}
          ratings={elem.ratings}
          onClick={(_id, json, data, ratings) => this.props.onClick(_id, json, data, ratings)}
        />
      );
    });

    return (
      <div className='specsList'>
        <h2>Last visualization saved:</h2>
        <ScrollArea speed={0.8}
          className="area"
          horizontal={false}
        >
          <div>{list}</div>
        </ScrollArea>
      </div>
    );
  }
}

SpecsList.propTypes = {
  onClick: PropTypes.func,
  history: PropTypes.array
};

export default SpecsList;
