'use strict';

var mongoose = require('mongoose');
var ethUtil = require('ethereumjs-util');
var User = mongoose.model('User');


exports.createUser  = function(req, res) {
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
      return res.json(user[0]);

      // UPDATE THE NONCE!
      // DO SOMETHING WITH JWT?
    } else {
      return res
        .status(401)
        .send({ error: 'Signature verification failed' });
   }
  })
}
