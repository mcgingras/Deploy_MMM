import React, { Component } from 'react';
import './App.css';

import Web3 from 'web3';
import Auth from './components/auth';
import About from './components/about';
import Header from './components/header';
import StrategyTable from './components/strategyTable';
import StrategyModal from './components/strategyModal';

class App extends Component {
  constructor(props){
    super(props);

    this.state = {
      isAuth: false,
      isOpen: false,
      isEdit: false,
      isLoading: false,
      strategy: {
      },
      strategies: [],
      positions: {},
      errors: {},
    }

    this.getOrders = this.getOrders.bind(this);
  }

  componentDidMount(){
    // n.amount
    if(sessionStorage.getItem('publicAddress')){
      this.setState({isAuth: true});

      fetch(process.env.REACT_APP_PROD_URL + `strategy/user/${sessionStorage.getItem('publicAddress')}`)
      .then((res) => res.json())
      .then((strategies) => {
          this.setState({strategies});
          strategies.map((s) => {
            this.getOrders(s.market);
            return s;
          })
        }
      );
    }
  }

  getBalance(address, fn){
    const abi = [
      {
        "constant": true,
        "inputs": [
          {
            "name": "_owner",
            "type": "address"
          }
        ],
        "name": "balanceOf",
        "outputs": [
          {
            "name": "balance",
            "type": "uint256"
          }
        ],
        "payable": false,
        "type": "function"
      },
    ];

    const web3 = window.web3 ?
    new Web3(window.web3.currentProvider) :
    new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/"));

    var tokenContract = web3.eth.contract(abi).at(address);
    return tokenContract.balanceOf.call(sessionStorage.getItem('publicAddress'), (err,res) => {
      fn(res.toNumber()*10000/(10**18));
    });
  }

  onAddStrategy = () => {
    this.setState({isOpen: true, isEdit: false});
  }

  submitStrategy = (e) => {
    e.preventDefault();

    if(Object.values(this.state.errors).filter((e) => {return e != ""}).length > 0){
      console.log("errors... fix them please");
      return; // we have errors, dont submit.
    }

    const payload = this.state.strategy;
    payload.publicAddress = sessionStorage.getItem('publicAddress');
    this.setState({isLoading: true});

    // going to need JWT as well... should be protected
    fetch(process.env.REACT_APP_PROD_URL + 'strategy', {
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
        // TODO: take a look at these errors
        console.log(body.errors);
        this.setState({errors: body.errors})
      }
      else{
        this.setState(prevState => ({
          ...prevState,
          isLoading: false,
          isOpen: false,
          strategies: [...prevState.strategies, body]
        }));
      }
    })
  }


  closeModal = () => {
    this.setState({isOpen: false, isLoading: false, strategy: {}});
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
    fetch(process.env.REACT_APP_PROD_URL + `strategy/${id}`, {
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
    .then((res) => res.json())
    .then((data) => {
      this.state.strategies.map((s) => {
        if(s._id === data._id){
          const i = this.state.strategies.indexOf(s);
          const updates = this.state.strategies.slice(0);
          updates[i] = data;
          this.setState({
            isOpen: false,
            strategies: updates,
          })
        }
        return s;
      })
    });
  }


  // should update cancel the current orders that they may have open?
  updateStrategy = (e) => {
    e.preventDefault();
    const strategy = this.state.strategy;
    const id = strategy._id;

    if(Object.values(this.state.errors).filter((e) => {return e != ""}).length > 0){
      console.log("errors... fix them please");
      return; // we have errors, dont submit.
    }

    this.setState({isLoading: true});

    fetch(process.env.REACT_APP_PROD_URL + `strategy/${id}`, {
      body: JSON.stringify(strategy),
      headers: {
        'Authorization': sessionStorage.getItem('bearer'),
        'Content-Type': 'application/json'
      },
      method: 'PUT'
    })
    .then((res) => res.json())
    .then((data) => {
      if(data.errors){
        if(data.errors.message = "INSUFFICIENT_MAKER_BALANCE"){
          this.validateForm("amount", true); // not really a fan of this way.
          this.setState({isLoading: false});
        }
      }
      else{
        this.state.strategies.map((s) => {
          if(s._id === data._id){
            const i = this.state.strategies.indexOf(s);
            const updates = this.state.strategies.slice(0);
            updates[i] = data;
            this.setState({
              isLoading: false,
              isOpen: false,
              strategies: updates,
            })
          }
          return s;
        })
      }
    });
  }

  validateForm = (name,value) => {
    let error = "";
    if(isNaN(parseFloat(value))){
      error = `${name} must be a number`
    }
    switch (name) {
      case "target":
        if (value < 0 || value > 1){
          error = "target must be between 0 and 1";
        }
          this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              target: error
            }
          }))
        break;

      case "spread":
        if (value < 0 || value > 1){
          error = "spread must be between 0 and 1";
        }
          this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              spread: error
            }
          }))
        break;

      case "amount":
      if (value === true){
        error = "insufficient funds"
      }
          this.setState(prevState => ({
            errors: {
              ...prevState.errors,
              amount: error
            }
          }))
        break;

      default:
        break;
    }
  }


  onInputChange = (e) => {
    console.log(this.state.errors);
    console.log(Object.values(this.state.errors).filter((e) => {return e != ""}).length > 0);
    const {name, value} = e.target;
    this.validateForm(name,value);
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


  getOrders(market){
    fetch(process.env.REACT_APP_PROD_URL + 'orders',{
        body: JSON.stringify({market}),
        headers: {
          'Authorization': sessionStorage.getItem('bearer'),
          'Content-Type': 'application/json'
        },
        method: 'POST'
      })
      .then((res => res.json()))
      .then((orders) => {
        const adr = {};
        orders.results.map((o) => {
          if(!(o.token in Object.values(adr))){
            adr[o.tokenType] = o.token;
          }
        })

        this.getBalance(adr['short'], (s) => {
          this.setState((prevState) => ({
            ...prevState,
            positions: {
              ...prevState.positions,
              [market]: {
                ...prevState.positions[market],
                short: s.toFixed(2)
              }
            }
          }))
        })

        this.getBalance(adr['long'], (s) => {
          this.setState((prevState) => ({
            ...prevState,
            positions: {
              ...prevState.positions,
              [market]: {
                ...prevState.positions[market],
                long: s.toFixed(2)
              }
            }
          }))
        })
      })
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
            strategies={this.state.strategies}
            positions={this.state.positions}
           />

          {this.state.isOpen &&
            <StrategyModal
            isLoading={this.state.isLoading}
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
