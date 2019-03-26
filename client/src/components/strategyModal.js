import React, { Component } from 'react';
import Modal from '@material-ui/core/Modal';
import Tooltip from '@material-ui/core/Tooltip';
import Select from 'react-select';

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
      selectedOption: ""
    }

    this.onInputChange = this.onInputChange.bind(this);
  }

  componentWillMount(){
    fetch('https://api.kovan.veil.market/api/v1/markets')
    .then((res) => { return res.json() })
    .then((data) => {
      const markets = data.data.results;
      const options = markets.reduce((acc, market) => {
        acc.push({label: market.name, value: market.slug, isDisabled: false});
        return acc;
      }, []);
       this.setState({ options, markets })
    })
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

            {this.props.errors.map((error) => {
              return (
                <div className="error">
                  {error.message}
                </div>
              )
            })}

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

            <label>
              Target
              <Tooltip disableFocusListener disableTouchListener placement="right" title="The price you think the market should center around. Must be between 0-1.">
                <span>?</span>
              </Tooltip>
            </label>
            <input
              type="text"
              name="target"
              onChange={this.props.onInputChange}
              value={this.props.strategy.target}
            />

            <label>Spread
            <Tooltip disableFocusListener disableTouchListener  placement="right" title="How much variation in price you are willing to offer.">
              <span>?</span>
            </Tooltip>
            </label>
            <input
              type="text"
              name="spread"
              onChange={this.props.onInputChange}
              value={this.props.strategy.spread}
            />

            <label>Amount
            <Tooltip disableFocusListener disableTouchListener placement="right" title="How much ETH you want to stake in this market.">
              <span>?</span>
            </Tooltip>
            </label>
            <input
              type="text"
              name="amount"
              onChange={this.props.onInputChange}
              value={this.props.strategy.amount}
            />

            <div className="container--button">
              <button onClick={() => this.props.closeModal()} className="button-red">Cancel</button>
              {this.props.isEdit
               ? <button className="button-purple">Update Strategy</button>
               : <button className="button-purple">Start Strategy</button>
              }
            </div>
          </form>
          </div>
        </Modal>
      </div>
    )
  }
}

export default strategyModal;
