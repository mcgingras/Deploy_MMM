import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import triangleImg from '../img/triangle.svg';
import squareImg from '../img/square.svg';
import linkImg from '../img/link.svg';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: '#19191C',
    color: '#DADADA',
    borderBottom: '1px solid #343434',
    whiteSpace: 'nowrap',
    overflow: 'hidden',
    fontSize: "15px"
  },
  body: {
    whiteSpace: 'nowrap',
    overflow: 'hidden'
  }
}))(TableCell);

const styles = theme => ({
  root: {
    overflowX: 'auto',
    padding: '0 20px',
  },
  table: {
    minWidth: 700,
    border: '1px solid #000',
    borderRadius: '5px'
  },
  cell: {
    color: '#FFFFFF',
    borderBottom: '1px solid #343434',
    fontSize: '18px',
    // whiteSpace: 'nowrap',
    // overflow: 'hidden'
  },
  row: {
    backgroundColor: '#19191C',
  },
});


class strategyTable extends Component {
  constructor(props) {
    super(props);

    this.state = {
      web3: null,
      strategies: [],
      orders: {},
      lastTrade: {}
    }

    this.getOrders = this.getOrders.bind(this);

  }

  componentWillMount(){
    fetch(process.env.REACT_APP_PROD_URL + `strategy/user/${sessionStorage.getItem('publicAddress')}`)
    .then((res) => res.json())
    .then((strategies) => {
        this.setState({strategies});
        strategies.map((s) => {
          this.getOrders(s.market);
        })
      }
    );
  }

  // not a big fan of the way this is rendering right now... feels hacky
  // couldnt figure out how to return directly from the fetch.
  renderOrders(market){
    if(market in this.state.orders){
      return (
        <div>
          <p>{this.state.orders[market].short} Short</p>
          <p>{this.state.orders[market].long} Long</p>
        </div>
      )
    }
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
        console.log(orders);
        const orderTally = orders.results.reduce((acc, o) => {
          if(o.status === "open"){
            if(o.fills.length > 0){
              const fills = o.fills;
              fills.map((fill) => {
                acc[o.tokenType] += fill.tokenAmount;
              })
            }
            // if(o.tokenType === "short"){
            //   acc.short += 1;
            // }
            // else if(o.tokenType === "long"){
            //   acc.long +=1;
            // }
          }
          return acc;
        }, {short: 0, long: 0})

        this.setState((prevState) => ({
          ...prevState,
          orders: {
            ...prevState.orders,
            [market]: orderTally
          }
        }))
      })
  }

  render(){
    return (
      <div className={this.props.classes.root}>
        <Table className={this.props.classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell></CustomTableCell>
            <CustomTableCell>Market</CustomTableCell>
            <CustomTableCell>Last Trade</CustomTableCell>
            <CustomTableCell>Target %</CustomTableCell>
            <CustomTableCell>Spread</CustomTableCell>
            <CustomTableCell>Amount</CustomTableCell>
            <CustomTableCell>Position</CustomTableCell>
            <CustomTableCell>Actions </CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {this.state.strategies.map(n => {
            return (
              <TableRow key={n.id} className={this.props.classes.row}>
                <TableCell className={this.props.classes.cell}>
                  <div className={n.active ? 'market--toggle market--toggle-active': 'market--toggle market--toggle-inactive'}></div>
                </TableCell>
                <TableCell scope="row" className={this.props.classes.cell}>
                  <div>
                      <div className="container--flex">
                        <span className="tag tag--purple">{n.channel.toUpperCase()}</span>
                        <a
                          onClick={() => {window.open('https://kovan.veil.co/market/'+n.market)}}
                          className="market--link">
                          View Market
                          <img src={linkImg}/>
                        </a>
                      </div>
                      <p className="market--title">{n.name}</p>
                  </div>
                </TableCell>
                <TableCell className={this.props.classes.cell}>N/A</TableCell>
                <TableCell className={this.props.classes.cell}>{n.target}%</TableCell>
                <TableCell className={this.props.classes.cell}>{n.spread}%</TableCell>
                <CustomTableCell className={this.props.classes.cell}><span>{`${n.amount} ETH`}</span></CustomTableCell>
                <TableCell className={this.props.classes.cell}>{this.renderOrders(n.market)}</TableCell>
                <CustomTableCell className={this.props.classes.cell}>
                  <button onClick={() => this.props.editStrategy(n)} className="button button-grey">Edit</button>
                  {n.active
                    ? <button
                        onClick={() => this.props.toggleStrategy(n, false)}
                        className="button button-red">
                        <img src={squareImg} alt="square"/>
                        Stop
                      </button>
                    : <button
                        onClick={() => this.props.toggleStrategy(n, true)}
                        className="button button-purple">
                        <img src={triangleImg} alt="square"/>
                        Restart
                      </button>
                  }

                </CustomTableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      </div>
    )
  }

}

export default withStyles(styles)(strategyTable);
