'use strict';
const mongoose = require('mongoose');
const dotenv  = require('dotenv').config();
const { isAuth } = require('../helpers/auth');
const { VeilStrategy, SimpleBinaryStrategy } = require('../veil/veil');
const Strategy = mongoose.model('Strategy');
const { BigNumber } = require('@0x/utils');


exports.createStrategy = function(req, res) {
  if(!isAuth(req)){
    return res.send("Not Authorized");
  }

  const { market } = req.body;
  const s = new SimpleBinaryStrategy(market);

  // do we require target to be between 0 and 1?

  const target = parseFloat(req.body.target);
  const spread = parseFloat(req.body.spread);
  const amount = parseFloat(req.body.amount);
  //
  async function run(){
    await s.openOrders(target,spread,amount);
  }
  run();

  var new_strategy  = new Strategy(req.body);
  new_strategy.save(function(err, strategy) {
    if (err)
      return res.send(err);
    return res.json(strategy);
  });
};

exports.updateStrategy = async function(req, res) {
  if(!isAuth(req)){
    return res.send("Not Authorized");
  }

  const { market, active } = req.body;
  const v = new SimpleBinaryStrategy(market);
  const response = await v.cancelOrders(market);

  if(active){ // if updating an active market we want to place orders again
    const t = parseFloat(req.body.target);
    const s = parseFloat(req.body.spread);
    const a = parseFloat(req.body.amount);
    v.openOrders(t,s,a)
    .then(r => {
      if(r.errors){
        return res.send({errors: r.errors[0]});
      }
      else{
        Strategy.findOneAndUpdate({_id: req.params.strategyId}, req.body, {new:true}, function(err, strategy) {
          if (err)
            return res.send(err);
          return res.json(strategy);
        });
      }
    })
  }
}

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

exports.getUserOrders = async function(req, res) {
  // if(!isAuth(req)){
  //   return res.send("Not Authorized");
  // }

  const { market } = req.body;
  const v = new VeilStrategy(market);
  const response = await v.getOrders(market);
  return res.json(response);
}
