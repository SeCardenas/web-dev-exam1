import React, { Component } from 'react';
import VegaVis from './components/VegaVis';
import './App.css';
import Upload from './components/Upload';
import Rating from './components/Rating';
import SpecsList from './components/SpecsList';

class App extends Component {

  constructor(props){
    super(props);
    this.state = {
      json: {
        '$schema': 'https://vega.github.io/schema/vega-lite/v3.json',
        'description': 'some text.',
        'data': {
          'values': [
            { 'a': 'A', 'b': 28 }, { 'a': 'B', 'b': 55 }, { 'a': 'C', 'b': 43 },
            { 'a': 'D', 'b': 91 }, { 'a': 'E', 'b': 81 }, { 'a': 'F', 'b': 53 },
            { 'a': 'G', 'b': 19 }, { 'a': 'H', 'b': 87 }, { 'a': 'I', 'b': 52 }
          ]
        },
        'mark': 'point',
        'encoding': {
          'x': { 'field': 'a', 'type': 'ordinal' },
          'y': { 'field': 'b', 'type': 'quantitative' }
        }
      },
      data: null,
      ratings: null,
      updateJson: false,
      specError: '',
      _id: null,
      lastSpecs: []
    };
  }

  onChange(json) {
    this.setState({json: json, _id: null, ratings: null});
  }

  onUpload(data) {
    this.setState({data: data});
  }

  onRemove() {
    this.setState({data: null, csv: null});
  }

  onSubmitUpdate(user, title) {
    const json = JSON.parse(JSON.stringify(this.state.json));
    json.schema = json.$schema;
    json.$schema = undefined;
    const data = this.state.data === null ? null : this.state.data.slice(0,1000);
    fetch('/specs', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        'json': json,
        'data': data,
        'user': user,
        'title': title
      })
    }).then(response => response.json())
      .then(json => {
        alert('visualization saved sucessfully.');
        this.setState({_id: json._id, ratings: json.ratings});
        this.updateLastSpecs();
      })
      .catch(err => console.log(err));
  }

  onSubmitRating(user, rating) {
    fetch('/specs/ratings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        '_id': this.state._id,
        'user': user,
        'rating': rating
      })
    }).then(response => response.json())
      .then(json => {
        this.setState({ratings: json.ratings});
        this.updateLastSpecs();
      })
      .catch(err => console.log(err));
  }

  onClick(_id, json, data, ratings) {
    this.setState({
      _id: _id,
      json: json,
      data: data,
      ratings: ratings,
      updateJson: true
    });
  }

  updateLastSpecs() {
    fetch('/specs')
      .then(response => response.json())
      .then(json => this.setState({lastSpecs: json}));
  }

  componentDidMount() {
    this.updateLastSpecs();
  }

  componentDidUpdate() {
    if(this.state.updateJson) this.setState({updateJson: false});
  }

  promRatings() {
    if(this.state.ratings === null || this.state.ratings === undefined) return null;
    let sum = 0.0;
    for(let i = 0; i<this.state.ratings.length; i++) {
      sum += this.state.ratings[i].rating;
    }
    return sum/Math.max(1.0, this.state.ratings.length);
  }

  render() {
    return (
      <div className='App'>
        <div className='principal-container'>
          <VegaVis onChange={j => this.onChange(j)}
            onUpload={(d, f) => this.onUpload(d, f)}
            onRemove={() => this.onRemove()}
            json={this.state.json}
            data={this.state.data}
            error={this.state.specError}
            rating={this.promRatings()}
            updateJson={this.state.updateJson}
            changeError={err => this.setState({specError: err, _id: null, ratings: null})}
          />
          {this.state._id === null ?
            <Upload valid={this.state.specError === ''}
              onSubmit={(user, title) => this.onSubmitUpdate(user, title)}
            /> :
            <Rating onSubmit={(user, rating) => this.onSubmitRating(user, rating)}/>
          }
        </div>
        <SpecsList history={this.state.lastSpecs} onClick={this.onClick.bind(this)}/>
      </div>
    );
  }
}

export default App;
