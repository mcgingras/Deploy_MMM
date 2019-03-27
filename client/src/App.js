import React, { Component } from 'react';
import './App.css';

import Auth from './components/auth';
import Header from './components/header';
import StrategyTable from './components/strategyTable';
import StrategyModal from './components/strategyModal';
const dotenv = require('dotenv').config();

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isAuth: false,
      isOpen: false,
      isEdit: false,
      strategy: {
      },
      errors: []
    }
  }

  componentDidMount(){
    if(sessionStorage.getItem('publicAddress')){
      this.setState({isAuth: true});
    }
  }

  onAddStrategy = () => {
    this.setState({isOpen: true, isEdit: false});
  }

  submitStrategy = (e) => {
    e.preventDefault();
    const payload = this.state.strategy;
    payload.publicAddress = sessionStorage.getItem('publicAddress');

    // going to need JWT as well... should be protected
    fetch(process.env.REACT_APP_PROD_URL+'/strategy', {
      body: JSON.stringify(payload),
      headers: {
        'Authorization': sessionStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    .then(res => res.json())
    .then((body) => {
      if (body.errors){
        console.log(body.errors);
        this.setState({errors: body.errors})
      }
      else{
        this.setState({isOpen: false});
      }
    })
  }


  closeModal = () => {
    this.setState({isOpen: false, strategy: {}});
  }


  editStrategy = (strategy) => {
    this.setState({
      isOpen: true,
      isEdit: true,
      strategy: strategy
    });
  }

  toggleStrategy = (strategy, toggle) => {
    const id = strategy._id;
    fetch(`http://localhost:3000/strategy/${id}`, {
      body: JSON.stringify({
        ...strategy,
        active: toggle
      }),
      headers: {
        'Authorization': sessionStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    })
    .then((res) => {
      res.json();
      this.setState({
        isOpen: false
      })
    });

    // dont like doing it this way but
    window.location.reload(true);
  }


  // should update cancel the current orders that they may have open?
  updateStrategy = () => {
    const strategy = this.state.strategy;
    const id = strategy._id;
    delete strategy._id;
    delete strategy.__v;

    fetch(`http://localhost:3000/strategy/${id}`, {
      body: JSON.stringify(strategy),
      headers: {
        'Authorization': sessionStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    })
    .then((res) => {
      res.json();
      this.setState({
        isOpen: false
      })
    });
  }


  onInputChange = (e) => {
    const {name, value} = e.target;
    console.log(this.state.strategy);

    this.setState((prevState) => ({
      ...prevState,
      strategy: {
        ...prevState.strategy,
        [name]: value
      }
    }))
  }


  // changing the select input type is handled a bit differently so I thought
  // I would put it in its own function...
  onMarketChange = (market) => {
    const { value } = market;
    // need to get market for additional data (like channel and name type)
    fetch(`https://api.kovan.veil.market/api/v1/markets/${value}`)
    .then((res) => { return res.json() })
    .then((data) => {
      const { name, channel } = data.data;
      this.setState((prevState) => ({
        ...prevState,
        strategy: {
          ...prevState.strategy,
          market: value,
          name: name,
          channel: channel
        }
      }))
    });
  }


  render() {
    return (
      <div className="App">
        <Header
          isAuth={this.state.isAuth}
          onAddStrategy={this.onAddStrategy}
        />
        {this.state.isAuth ?
        <div>
          <StrategyTable
            editStrategy={this.editStrategy}
            toggleStrategy={this.toggleStrategy}
           />

          {this.state.isOpen &&
            <StrategyModal
            isOpen={this.state.isOpen}
            isEdit={this.state.isEdit}
            strategy={this.state.strategy}
            submitStrategy={this.submitStrategy}
            updateStrategy={this.updateStrategy}
            closeModal={this.closeModal}
            onInputChange={this.onInputChange}
            onMarketChange={this.onMarketChange}
            errors={this.state.errors}
            />
          }

        </div>
         :
        <Auth
          login={() => this.setState({isAuth: true})}
         />
        }
      </div>
    );
  }
}

export default App;
