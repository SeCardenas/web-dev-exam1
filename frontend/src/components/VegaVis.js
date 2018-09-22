import React, { Component } from 'react';
import vegaEmbed from 'vega-embed';
import PropTypes from 'prop-types';
import Papa from 'papaparse';
import Rat from 'react-rating';
import './css/VegaVis.css';

class VegaVis extends Component {

  componentDidMount() {
    this.handleUpdate();
  }

  componentDidUpdate() {
    this.handleUpdate();
  }

  handleUpdate() {
    if(this.props.updateJson) this.textarea.value = JSON.stringify(this.props.json, null, 2);
    const embed_opt = {'mode': 'vega-lite'};
    if(this.props.error !== 'Error in json syntax') {
      if(this.props.data !== null) {
        vegaEmbed(this.div, this.props.json, embed_opt)
          .then((res) =>  {
            if(res) res.view.insert(this.props.json.data.name, this.props.data).run();
          })
          .catch(error => {
            console.log(error);
            if(this.props.error === '') this.props.changeError('Unable to read spec with the csv file provided');
          });
          
      }
      else {
        vegaEmbed(this.div, this.props.json, embed_opt)
          .then((res) =>  {
            if(res) res.view.run();
          })
          .then(() => {
            if(this.props.error !== '') this.props.changeError('');
          })
          .catch(error => {
            console.log(error);
            if(this.props.error === '') this.props.changeError('Unable to read spec');
          });
      }
    }
  }

  handleChange(e) {
    try {
      const json = JSON.parse(e.target.value);
      if(this.props.error !== '') this.props.changeError('');
      this.props.onChange(json);
    }
    catch(err) {
      this.props.changeError('Error in json syntax');
    }
  }

  handleUpload(e) {
    const file = e.target.files[0];
    console.log('file:', file);
    Papa.parse(file, {
      header: true,
      complete: (results, file) => {
        this.props.onUpload(results.data);
      }
    });
  }

  handleRemove() {
    this.fileInput.value = null;
    this.props.onRemove();
  }

  render() {
    const ratings = (
      <div>
        <h2>Ratings:</h2>
        <Rat initialRating={this.props.rating} readonly/>
      </div>
    );
    return (
      <div className='VegaVis'>
        <h1>Minimalistic Vega Editor</h1>
        <div className='editor'>
          <div>
            <textarea cols='50' 
              rows='18' 
              defaultValue={JSON.stringify(this.props.json, null, 2)} 
              onChange={(e) => this.handleChange(e)}
              ref={textarea => this.textarea = textarea}
            ></textarea>
            <p>{this.props.error}</p>
          </div>
          <div>
            <div ref={(div) => this.div=div}></div>
          </div>
        </div>
        <div className='editor-footer'>
          <div className='uploadFiles'>
            <h2>Import csv file</h2>
            <input type='file' ref={input => this.fileInput = input} onChange={e => this.handleUpload(e)}/>
            <button onClick={() => this.handleRemove()}>remove csv</button>
          </div>
          <div>
            {this.props.rating === null ? null : ratings}
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
  changeError: PropTypes.func,
  data: PropTypes.array,
  error: PropTypes.string,
  updateJson: PropTypes.bool,
  rating: PropTypes.number
};

export default VegaVis;
