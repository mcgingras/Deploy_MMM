import React, { Component } from 'react';
import Web3 from 'web3';
const dotenv = require('dotenv').config();

class auth extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      errors: [],
    }

  }

  componentDidMount() {
    const web3 = window.web3 ?
    new Web3(window.web3.currentProvider) :
    new Web3(new Web3.providers.HttpProvider("https://mainnet.infura.io/v3/"));

    this.setState({web3: web3});
  }

  login = () => {
    const web3 = this.state.web3;

    const publicAddress = web3.eth.coinbase;
    if(publicAddress == null){
      this.setState({errors: [{message: "Not web3 connection. Please log into metamask."}]});
      return;
    }

    // TODO: change this endpoint
    // I had to click auth twice... I think there is some issue here that we should fix.
    // fetch(`http://localhost:3000/user/${publicAddress}`)
    fetch(process.env.REACT_APP_PROD_URL + "user/" + publicAddress)
    .then((res) => res.json())
    .then(user => user.length > 0 ? user[0] : this.handleSignup(publicAddress))
    .then(this.handleSignMessage)
    .then(this.handleAuthenticate)
  }

  handleSignup = (publicAddress) => {
    fetch(process.env.REACT_APP_PROD_URL + "user/", {
      body: JSON.stringify({ publicAddress }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
    .then(res => res.json());
  };

  handleSignMessage = ({ publicAddress, nonce }) => {
    const web3 = this.state.web3;
    return new Promise((resolve, reject) =>
      web3.personal.sign(
        web3.fromUtf8(`I am signing my one-time nonce: ${nonce}`),
        publicAddress,
        (err, signature) => {
          if (err) return reject(err);
          return resolve({ publicAddress, signature });
        }
      )
    );
  }

  handleAuthenticate = ({ publicAddress, signature }) => {
    fetch(process.env.REACT_APP_PROD_URL + "auth", {
      body: JSON.stringify({ publicAddress, signature }),
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'POST'
    })
  .then(response => response.json())
  .then(token => {
    sessionStorage.setItem("bearer", token);
    sessionStorage.setItem("publicAddress", publicAddress);
    this.props.login();
    });
  }

  render(){
    return (
      <div className="container--auth">
        {this.state.errors.map((error) => {
          return (
            <div>
              {error.message}
            </div>
          )
        })}
        <p>Create and run your own market making strategies on Veil.</p>
        <button
          className="button--login"
          onClick={() => this.login()}>
          Login With Metamask
        </button>
      </div>
    )
  }

}

export default auth;
