import React, { Component } from 'react';

class botForm extends Component {
  constructor(props) {
    super(props);

    this.state = {
      spread: "",
      amount: ""
    }

    this.spreadInput = React.createRef();
    this.amountInput = React.createRef();
    this.onChange = this.onChange.bind(this);
  }

  onChange = () => {
    this.setState({
      spread: this.spreadInput.current.value,
      amount: this.amountInput.current.value
    })
  }

  runBot = () => {
    console.log("running");
  }

  render(){
    return (
      <div className={this.props.isOpen ? "show bot--form" : "hide bot--form"}>
        <h2 className="bot--form-title">{this.props.market.name}</h2>

        <div className="bot--form-form">
          <div>
            <label>spread</label>
            <input
              className="input"
              ref={this.spreadInput}
              value={this.state.spread}
              onChange={this.onChange}
            />
          </div>

          <div>
            <label>amount</label>
            <input
              className="input"
              ref={this.amountInput}
              value={this.state.amount}
              onChange={this.onChange}
            />
          </div>
        </div>
        
        <button className="bot--form-submit" onClick={() => {this.runBot()}}>Run</button>
      </div>
    )
  }

}

export default botForm;
