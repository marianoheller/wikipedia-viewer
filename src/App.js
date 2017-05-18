import React, { Component } from 'react';
import axios from 'axios';
import { debounce } from 'throttle-debounce';
import logo from './logo.svg';
import './App.css';



class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      results: {}
    }

    this.setResults = this.setResults.bind(this);
  }

  setResults(obj) {
    const newState = Object.assign({}, this.state);
    newState.results = Object.assign({},obj)
    this.setState(newState);
  }


  render() {
    

    return (
      <div className="App">
        <Header onResults={this.setResults}></Header>
        <Results results={this.state.results}></Results>
      </div>
    );
  }
}


class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <div>
          <div>
            <h2>Wikipedia viewer</h2>
            <small>Powered by React</small>
          </div>
          <Search onResults={this.props.onResults}></Search>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  constructor(props) {
    super(props);

    this.handleInput = this.handleInput.bind(this);
    this.searchArticle = debounce(800, this.searchArticle );
  }

  handleInput(e) {
    this.searchArticle(e.target.value);
  }

  searchArticle(input) {
    const baseUrl = "https://en.wikipedia.org/w/api.php";


    axios.get(baseUrl, {
      params: {
        action: "query",
        format: "json",
        generator: "search",
        gsrnamespace: 0,
        gsrlimit: 10,
        prop: "pageimages|extracts",
        pilimit: "max",
        explaintext: 1,
        exintro: 1,
        exsentences: 1,
        exlimit: "max",
        origin: "*",
        gsrsearch: input
      }
    }).then( (results)  => {
      if ( !results.data.query ) {
        results.data.query = {};
        results.data.query.pages = {};
      }
      const resultadosBusqueda = Object.assign({}, results.data.query.pages );
      this.props.onResults(resultadosBusqueda);
    }).catch( (error) => {
      throw Error(error);
    })
  }

  render() {
    return(
      <input placeholder="Search article" id="searchInput" onInput={this.handleInput} />
    );
  }
}

class Results extends Component {
  render() {
    console.log(this.props.results);
    
    return (
      <div>
        <p>Results!!</p>
        <SingleResult></SingleResult>    
      </div>
    );
  }
}




class SingleResult extends Component {
  render() {
    return (
      <p>single</p>
    );
  }
}



export default App;
