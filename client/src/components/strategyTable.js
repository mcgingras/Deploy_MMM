import React, { Component } from 'react';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';

import triangle from '../img/triangle.svg';
import square from '../img/square.svg';

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
    }

  }

  componentWillMount(){
    console.log(sessionStorage.getItem('publicAddress'));
    fetch(`http://localhost:3000/strategy/user/${sessionStorage.getItem('publicAddress')}`)
    .then((res) => res.json())
    .then((strategies) => this.setState({strategies}));
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
                        <a onClick={() => {window.open('https://kovan.veil.co/market/'+n.market)}} className="market--link">View Market</a>
                      </div>
                      <p className="market--title">{n.name}</p>
                  </div>
                </TableCell>
                <TableCell className={this.props.classes.cell}>null</TableCell>
                <TableCell className={this.props.classes.cell}>{n.target}%</TableCell>
                <TableCell className={this.props.classes.cell}>{n.spread}%</TableCell>
                <CustomTableCell className={this.props.classes.cell}><span>{`${n.amount} ETH`}</span></CustomTableCell>
                <TableCell className={this.props.classes.cell}>null</TableCell>
                <CustomTableCell className={this.props.classes.cell}>
                  <button onClick={() => this.props.editStrategy(n)} className="button button-grey">Edit</button>
                  {n.active
                    ? <button onClick={() => this.props.toggleStrategy(n, false)} className="button button-red"><img src={square}/>Stop</button>
                    : <button onClick={() => this.props.toggleStrategy(n, true)} className="button button-purple"><img src={triangle}/>Restart</button>
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
