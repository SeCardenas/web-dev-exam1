import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
import Papa from 'papaparse';

class VegaVis extends Component {

  constructor(props) {
    super(props);
    console.log(this.props.csv);
    this.state = {
      error: ''
    };
  }

  componentDidMount() {
    const embed_opt = {'mode': 'vega-lite'};
    if(this.props.data !== null) {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.insert(this.props.json.data.name, this.props.data).run();
        })
        .catch(error => {
          console.log(error);
          if(this.state.error === '') this.setState({error: 'Unable to read spec with the csv file provided'});
        });
        
    }
    else {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.run();
        })
        .then(() => {
          if(this.state.error !== '') this.setState({error: ''});
        })
        .catch(error => {
          console.log(error);
          if(this.state.error === '') this.setState({error: 'Unable to read spec'});
        });
    }
  }

  componentDidUpdate() {
    const embed_opt = {'mode': 'vega-lite'};
    if(this.props.data !== null) {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.insert(this.props.json.data.name, this.props.data).run();
        })
        .catch(error => {
          console.log(error);
          if(this.state.error === '') this.setState({error: 'Unable to read spec with the csv file provided'});
        });
        
    }
    else {
      vegaEmbed(this.div, this.props.json, embed_opt)
        .then((res) =>  {
          if(res) res.view.run();
        })
        .then(() => {
          if(this.state.error !== '') this.setState({error: ''});
        })
        .catch(error => {
          console.log(error);
          if(this.state.error === '') this.setState({error: 'Unable to read spec'});
        });
    }
  }

  handleChange(e) {
    try {
      const json = JSON.parse(e.target.value);
      this.setState({error: ''});
      this.props.onChange(json);
    }
    catch(err) {
      this.setState({error: 'Error in json syntax'});
    }
  }

  handleUpload(e) {
    const file = e.target.files[0];
    Papa.parse(file, {
      header: true,
      complete: (results, file) => {
        this.props.onUpload(results.data, file);
      }
    });
  }

  handleRemove() {
    this.fileInput.value = null;
    this.props.onRemove();
  }

  render() {
    return (
      <div className='VegaVis'>
        <h1>Vega embed editor</h1>
        <div className=''>
          <div>
            <textarea cols='40' rows='15' defaultValue={JSON.stringify(this.props.json, null, 2)} onChange={(e) => this.handleChange(e)}></textarea>
            <p>{this.state.error}</p>
          </div>
          <div>
            <div ref={(div) => this.div=div}></div>
            <div className='uploadFiles'>
              <h2>Import csv file</h2>
              <input type='file' ref={input => this.fileInput = input} onChange={e => this.handleUpload(e)}/>
              <button onClick={() => this.handleRemove()}>remove csv</button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

VegaVis.propTypes = {
  json: PropTypes.object,
  onChange: PropTypes.func,
  onUpload: PropTypes.func,
  onRemove: PropTypes.func,
  data: PropTypes.array,
  csv: PropTypes.object
};

export default VegaVis;
