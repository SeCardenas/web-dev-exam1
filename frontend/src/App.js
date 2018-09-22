import React, { Component } from 'react';
import VegaVis from './components/VegaVis';
import './App.css';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      json: {
        "$schema": "https://vega.github.io/schema/vega-lite/v3.json",
        "description": "some text.",
        "data": {
          "values": [
            { "a": "A", "b": 28 }, { "a": "B", "b": 55 }, { "a": "C", "b": 43 },
            { "a": "D", "b": 91 }, { "a": "E", "b": 81 }, { "a": "F", "b": 53 },
            { "a": "G", "b": 19 }, { "a": "H", "b": 87 }, { "a": "I", "b": 52 }
          ]
        },
        "mark": "point",
        "encoding": {
          "x": { "field": "a", "type": "ordinal" },
          "y": { "field": "b", "type": "quantitative" }
        }
      },
      data: null,
      csv: null
    };
  }

  onChange(json) {
    this.setState({json: json});
  }

  onUpload(data, file) {
    this.setState({data: data, csv: file});
  }

  onRemove() {
    this.setState({data: null, csv: null});
  }

  render() {
    return (
      <VegaVis onChange={j => this.onChange(j)}
        onUpload={(d, f) => this.onUpload(d, f)}
        onRemove={() => this.onRemove()}
        json={this.state.json}
        data={this.state.data}
        csv={this.state.csv}
      />
    );
  }
}

export default App;
