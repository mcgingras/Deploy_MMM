'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var StrategySchema = new Schema({
  market: {
    type: String,
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  spread: {
    type: String,
    required: true,
  },
  target: {
    type: String,
    required: true,
  },
  active: {
    type: Boolean,
    required: true,
    default: true,
  },
  publicAddress: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  channel: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('Strategy', StrategySchema);
