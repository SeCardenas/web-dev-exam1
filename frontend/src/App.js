import React, { Component } from 'react';
import './App.css';
import vegaEmbed from 'vega-embed';
import Papa from 'papaparse';


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
          "y": { "field": "b", "type": "quantitative" }
        }
      },
      error: '',
      data: undefined,
      jsoncsv: undefined
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
    console.log("actualiza");
    console.log(this.state);
    const embed_opt = {"mode": "vega-lite"};
    if(this.state.data) {
      vegaEmbed(this.div, this.state.jsoncsv, embed_opt)
        .catch(error => console.log(error))
        .then((res) =>  {
          if(res) res.view.insert("myData", this.state.data).run();
        });
    }
    else {
      vegaEmbed(this.div, this.state.json, embed_opt)
        .catch(error => console.log(error))
        .then((res) =>  {
          if(res) res.view.run();
        });
    }
  }

  handleChange(e) {
    try {
      const json = JSON.parse(e.target.value);
      const jsoncsv = JSON.parse(e.target.value);
      jsoncsv.data = {"name": "myData"};
      this.setState({json: json, jsoncsv: jsoncsv, error: ''});
    }
    catch(err) {
      this.setState({error: 'Error in json syntax'})
    }
  }

  handleUpload(e) {
    const file = e.target.files[0];
    const jsoncsv = JSON.parse(JSON.stringify(this.state.json));
    jsoncsv.data = {"name": "myData"};
    Papa.parse(file, {
      header: true,
      complete: (results, file) => {
        this.setState({jsoncsv: jsoncsv, data: results.data});
      }
    });
  }

  handleRemove(e) {
    this.fileInput.value = null;
    this.setState({data: undefined, jsoncsv: undefined});
    console.log("remueve");
  }

  render() {
    return (
      <div className="App">
        <h1>Vega embed editor</h1>
        <p>{this.state.error}</p>
        <textarea cols="40" rows="15" defaultValue={JSON.stringify(this.state.json, null, 2)} onChange={(e) => this.handleChange(e)}></textarea>
        <div ref={(div) => this.div=div}></div>
        <div className='uploadFiles'>
          <h2>Import csv file</h2>
          <input type='file' ref={input => this.fileInput = input} onChange={e => this.handleUpload(e)}/>
          <button onClick={e => this.handleRemove(e)}>remove csv</button>
        </div>
      </div>
    );
  }
}

export default App;
