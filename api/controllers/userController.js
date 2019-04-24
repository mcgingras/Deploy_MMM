'use strict';
const mongoose = require('mongoose');
const ethUtil = require('ethereumjs-util');
const jwt = require('jsonwebtoken');
const { getEnv } = require('../helpers/env');
const dotenv = require('dotenv').config();
const User = mongoose.model('User');

exports.getEnv = function(req, res) {
  console.log(getEnv(req.body.q));
  return res.send("okay")
}

exports.createUser = function(req, res) {
  var new_user  = new User(req.body);
  new_user.save(function(err, user) {
    if (err)
      return res.send(err);
    return res.json(user);
  });
};

exports.getUser = function(req,res) {
  User.find({publicAddress : req.params.userId}, function(err,user) {
    if (err)
      return res.send(err);
    return res.json(user);
  });
};

exports.auth = function(req,res) {
  if(process.env.ADDRESS != req.body.publicAddress){
    console.log("not");
    return res.json("failed");
  }

  else{
    User.find({publicAddress : req.body.publicAddress}, function(err,user) {
      const msg = `I am signing my one-time nonce: ${user[0].nonce}`;
      const msgBuffer = ethUtil.toBuffer(msg);
      const msgHash = ethUtil.hashPersonalMessage(msgBuffer);
      const signatureBuffer = ethUtil.toBuffer(req.body.signature);
      const signatureParams = ethUtil.fromRpcSig(signatureBuffer);
      const publicKey = ethUtil.ecrecover(
        msgHash,
        signatureParams.v,
        signatureParams.r,
        signatureParams.s
      );
      const addressBuffer = ethUtil.publicToAddress(publicKey);
      const address = ethUtil.bufferToHex(addressBuffer);

      if (address.toLowerCase() === req.body.publicAddress.toLowerCase()) {
        const token = jwt.sign({ test: 'test' }, process.env.SECRET); // change this test stuff
        return res.json(token);
      } else {
        return res
          .status(401)
          .send({ error: 'Signature verification failed' });
     }
    })
  }
}

exports.getVeil = function(req,res){
  return res.json(process.env.API_URL);
}
