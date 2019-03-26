'use strict';
var mongoose = require('mongoose');
var jwt = require('jsonwebtoken');
const dotenv = require('dotenv').config();
var Strategy = mongoose.model('Strategy');

const { VeilInstance, VeilStrategy } = require('../veil/veil.js');

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
  if (!req.get('Authorization')){
    res.send("no bearer token sent!");
  }

  const bearer = req.get('Authorization');
  try {
    var decoded = jwt.verify(bearer, 'secret');
  } catch(err) {
    res.send(err);
  }

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
