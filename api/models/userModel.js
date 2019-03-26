'use strict';
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var UserSchema = new Schema({
  publicAddress: {
    type: String,
    required: true,
    unique: true
  },
  nonce: {
    type: Number,
    required: true,
    default: Math.floor(Math.random() * 1000000)
  },
  username: {
    type: String,
    unique: true
  }
});

module.exports = mongoose.model('User', UserSchema);
