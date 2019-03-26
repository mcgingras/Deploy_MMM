'use strict';
var mongoose = require('mongoose');
var Strategy = mongoose.model('Strategy');

const Veil = require('veil-js');
const dotenv = require('dotenv').config();

class VeilInstance {
  constructor(m,a,u){
    this.veil = new Veil.default(m,a,u);
  }

  async openOrders(market, target, spread, amount){
    const halfSpread = spread / 2;
    const bidPrice = target - halfSpread;
    const askPrice = target + halfSpread;
    const m = await this.veil.getMarket(market);

    try {
      const longQuote  = await this.veil.createQuote(m, "buy", "long", amount, bidPrice);
      const shortQuote = await this.veil.createQuote(m, "buy", "short", amount, 1-askPrice);
      const longOrder = await this.veil.createOrder(longQuote, { postOnly: true });
      const shortOrder = await this.veil.createOrder(shortQuote, { postOnly: true });
      return "created successfully"
    } catch(e) {
      console.log(e);
      return e;
    }
  };

  async cancelOrders(market){
    try{
      const m = await this.veil.getMarket(market);
      const orders = await this.veil.getUserOrders(m);
      // prob want to check for orders first before mapping
      orders.results.map((order) => {
        if(order.status === 'open'){
          this.veil.cancelOrder(order.uid);
        }
      })
      return "orders canceled"
    } catch(e) {
      console.log("error " + e);
      return e;
    }
  }
}

// TODO: protect these routes with a JWT or something
exports.createStrategy = function(req, res) {
  // do we require target to be between 0 and 1?
  // const { market } = req.body;
  // const m = process.env.MNEMONIC;
  // const a = process.env.ADDRESS;
  // const u = process.env.API_URL;
  //
  // const v = new VeilInstance(m,a,u);
  //
  // const target = parseFloat(req.body.target);
  // const spread = parseFloat(req.body.spread);
  // const amount = parseFloat(req.body.amount);
  //
  // async function run(){
  //   await v.openOrders(market,target,spread,amount);
  // }
  // run();

  var new_strategy  = new Strategy(req.body);
  new_strategy.save(function(err, strategy) {
    if (err)
      return res.send(err);
    return res.json(strategy);
  });

};

exports.getStrategy = function(req, res) {
  Strategy.findById(req.params.strategyId, function(err,strategy) {
    if (err)
      return res.send(err);
    return res.json(strategy);
  });
};

exports.getUserStrategies = function(req, res) {
  Strategy.find({publicAddress : req.params.userId}, function(err,strategy) {
    if (err)
      return res.send(err);
    return res.json(strategy);
  });
};

exports.updateStrategy = async function(req, res) {
  const { market } = req.body;

  const m = process.env.MNEMONIC;
  const a = process.env.ADDRESS;
  const u = process.env.API_URL;

  const v = new VeilInstance(m,a,u);
  const response = await v.cancelOrders(market);
  // IF RESPONSE IS GOOD 
  Strategy.findOneAndUpdate({_id: req.params.strategyId}, req.body, function(err, strategy) {
    if (err)
      return res.send(err);
    return res.json(strategy);
  })
}
