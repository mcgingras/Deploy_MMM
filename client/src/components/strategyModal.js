import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import CircularProgress from '@material-ui/core/CircularProgress';
import questionImg from '../img/question.svg';
import Select from 'react-select';
import Input from './input';

const colourStyles = {
  control: styles => ({ ...styles, backgroundColor: 'white' }),
  option: (styles, { data, isDisabled, isFocused, isSelected }) => {
    return {
      ...styles,
      backgroundColor: isDisabled ? 'red' : '#FFF',
      color: '#555',
      cursor: isDisabled ? 'not-allowed' : 'default',
      '&:hover': {
        backgroundColor: '#EEE'
      }
    };
  }
};


class strategyModal extends Component {
  constructor(props){
    super(props);

    this.state = {
      markets: [],
      isOpen: true,
      options: [],
      selectedOption: "",
      api: ""
    }

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount(){
    fetch(process.env.REACT_APP_PROD_URL + "veil")
    .then((res) => res.json())
    .then(r => {
      const api = r.substring(0, r.length - 2);
      fetch(`${api}market/api/v1/markets`)
      .then((res) => { return res.json() })
      .then((data) => {
        const markets = data.data.results;
        const options = markets.reduce((acc, market) => {
          if(market.type === "yesno"){
            acc.push({label: market.name, value: market.slug, isDisabled: false});
          }
          return acc;
        }, []);
         this.setState({ options, markets })
      })
    });


  }

  // insanely cumbersome function needed to get value because react select
  // wont just let me pass in the value... needs full object >:(
  getValue = () => {
    const result = this.state.options.filter(o => o.value === this.props.strategy.market);
    if(result.length > 0){
      return {value: this.props.strategy.market, label: result[0].label}
    }
    else{
      return ""
    }
  }

  onInputChange = (selectedOption) => {
    this.setState({ selectedOption });
    this.props.onMarketChange(selectedOption);
  }


  render(){
    return (
      <div>
        <Modal
          open={this.props.isOpen}
          onClose={() => this.props.closeModal()}
          >
          <div className="modal--strategy">
          <h1 className="modal--strategy-title">{this.props.isEdit ? "Edit Strategy" : "New Strategy"}</h1>
          <form
            className="modal--strategy-form"
            onSubmit={this.props.isEdit ? this.props.updateStrategy : this.props.submitStrategy}
            >
            <label>
              Market
            </label>
            <Select
              isSearchable={true}
              placeholder="Search Markets"
              value={this.getValue()}
              onChange={this.onInputChange}
              options={this.state.options}
              styles={colourStyles}
            />

            <Input
              label="Target"
              name="target"
              tooltip="The price you think the market should center around. Must be between 0-1."
              value={this.props.strategy.target}
              onInputChange={this.props.onInputChange}
              error={this.props.errors.target}
            />

            <Input
              label="Spread"
              name="spread"
              tooltip="How much variation in price you are willing to offer."
              value={this.props.strategy.spread}
              onInputChange={this.props.onInputChange}
              error={this.props.errors.spread}
            />

            <Input
              label="Amount"
              name="amount"
              tooltip="How much ETH you want to stake in this market."
              value={this.props.strategy.amount}
              onInputChange={this.props.onInputChange}
              error={this.props.errors.amount}
            />

            { this.props.isLoading ? <CircularProgress className="loader"/> :

            <div className="container--button">
              <button onClick={() => this.props.closeModal()} className="button button-red">Cancel</button>
              {this.props.isEdit
               ? <button className={Object.values(this.props.errors).filter((e) => {return e != ""}).length > 0 // this deadass the craziest filter
                                    ? "button button-grey"
                                    : "button button-purple"}>Update Strategy</button>
               : <button className={Object.values(this.props.errors).filter((e) => {return e != ""}).length > 0 // this deadass the craziest filter
                                    ? "button button-grey"
                                    : "button button-purple"}>Start Strategy</button>
              }
            </div>
          }
          </form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default strategyModal;
