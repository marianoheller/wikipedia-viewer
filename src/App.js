import React, { Component } from 'react';
import axios from 'axios';
import { debounce } from 'throttle-debounce';
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
      <div className="App pure-g">
        <div className="pure-u-1">
          <Header onResults={this.setResults}></Header>
          <Results results={this.state.results}></Results>
        </div>
      </div>
    );
  }
}


class Header extends Component {
  render() {
    return (
      <div className="App-header pure-g">
        <div className="pure-u-1">
          <img src="https://cdn.worldvectorlogo.com/logos/react.svg" className="App-logo" alt="logo" />
          <div>
            <div>
              <h2>Wikipedia viewer</h2>
              <small>Powered by React</small>
            </div>
            <Search onResults={this.props.onResults}></Search>
          </div>
        </div>
      </div>
    );
  }
}

class Search extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false
    }

    this.handleInput = this.handleInput.bind(this);
    this.searchArticle = debounce(500, this.searchArticle );
  }

  handleInput(e) {
    this.searchArticle(e.target.value);
    
  }

  searchArticle(input) {
    this.setState({
      loading: true
    });

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
      console.log(results);
      if ( !results.data.query ) {
        results.data.query = {};
        results.data.query.pages = {};
      }
      const resultadosBusqueda = Object.assign({}, results.data.query.pages );
      this.props.onResults(resultadosBusqueda);
      this.setState({
        loading: false
      });
    }).catch( (error) => {
      throw Error(error);
    })
  }

  isLoading() {
    return this.state.loading ? "loading" : "";
  }

  goToRandomArticle() {
    window.location.replace("https://en.wikipedia.org/wiki/Special:Random"); 
  }

  render() {
    return(
      <div>
        <input className={this.isLoading()} placeholder="Search article" id="searchInput" onInput={this.handleInput} />
        <p>or</p>
        <button onClick={this.goToRandomArticle.bind(this)} className="pure-button">Go to random article</button>
      </div>
    );
  }
}

class Results extends Component {
  render() {
    var results = this.props.results;
    //console.log(results);
    var arrResults = Object.keys(results).map( function(val) {
      return results[val];
    });
    
    arrResults = arrResults.map( function(e,i) {
      return <SingleResult key={i} pageid={e.pageid} extract={e.extract} title={e.title} thumbnail={e.thumbnail}></SingleResult>
    });
    if ( !arrResults ) {
      arrResults = "<p>No se encontraron articulos con ese nombre</p>"
    }
    
    return (
      <div className="pure-g" id="results">
        <div className="pure-u-3-24"></div>
        <div className="pure-u-18-24">
          {arrResults}
        </div>
      </div>
    );
  }
}




class SingleResult extends Component {
  render() {
    return (
      <a href={"https://en.wikipedia.org/?curid=" + this.props.pageid}>
      <div className="singleResult pure-g hvr-fade">
        
          <div className="pure-u-1 title">
            <p><strong>{this.props.title}</strong></p>
          </div>
          <div className="pure-u-1 extract">
            <p>{this.props.extract}</p>
          </div>
        
      </div>
      </a>
    );
  }
}



export default App;
