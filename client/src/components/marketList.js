import React, { Component } from 'react';
import BotForm from './botForm';

class marketList extends Component {
  constructor(props) {
    super(props);

    this.state = {
      markets: [],
      isOpen: false,
      activeMarket: {}
    }

    this.makeMarketModal = this.makeMarketModal.bind(this);

  }

  componentWillMount(){
    fetch('https://api.kovan.veil.co/api/v1/markets')
    .then((res) => { return res.json() })
    .then((data) => {
       this.setState({ markets: data.data.results})
       console.log(data.data.results);
    })
  }

  makeMarketModal(market){
    console.log(market);
    this.setState({
      isOpen: true,
      activeMarket: market
    });
  }


  render(){
    return (
      <div>
        {this.state.markets.map((market => {
          return (
            <div className="market--item">
              {market.name}
              <button
                className="market--item-button"
                onClick={() => {this.makeMarketModal(market)}}
              >
                Make Market
              </button>
            </div>
          )
        }))}

        <BotForm
          isOpen={this.state.isOpen}
          market={this.state.activeMarket}
        />
      </div>
    )
  }

}

export default marketList;
