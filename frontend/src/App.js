import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';


class App extends Component {

  constructor(){
    super();
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
          "y": { "field": "b", "type": "quantitative" },
          "tooltip": { "field": "b", "type": "quantitative" }
        }
      },
      error: ''
    };
  }

  componentDidMount() {
    const embed_opt = {"mode": "vega-lite"};
    vegaEmbed(this.div, this.state.json, embed_opt)
          .catch(error => console.log(error))
          .then((res) =>  {
            if(res) res.view.run();
          });
  }

  componentDidUpdate() {
    const embed_opt = {"mode": "vega-lite"};
    vegaEmbed(this.div, this.state.json, embed_opt)
          .catch(error => console.log(error))
          .then((res) =>  {
            if(res) res.view.run();
          });
  }

  handleChange(e) {
    try {
      this.setState({json: JSON.parse(e.target.value), error: ''});
    }
    catch(err) {
      this.setState({error: 'error en el json'})
    }
  }

  render() {
    return (
      <div className="App">
        <textarea cols="40" rows="15" onChange={(e) => this.handleChange(e)}>{JSON.stringify(this.state.json, null, 2)}</textarea>
        <div ref={(div) => this.div=div}></div>
      </div>
    );
  }
}

export default App;
