import React, { Component } from 'react';
import Login from './components/Login/Login';
import Duozi from './components/Duozi/Router';
import './App.css';

class App extends Component {

  constructor(){
    super();
    this.state = {
      loggedIn: false,
      email: ''
    };
  }

  renderLogin() {
    return(
      <Login 
        onLogin={result => {
          this.setState({loggedIn: true, email: result});
        }}
      />
    );
  }

  renderApp() {
    return(
      <Duozi email={this.state.email}/>
    );
  }

  render() {
    return (
      <div className="App">
        deployed!!!, yeah
      </div>
    );
  }
}

export default App;
