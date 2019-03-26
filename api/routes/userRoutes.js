'use strict';
module.exports = function(app) {
  var user = require('../controllers/userController');

  app.route('/user')
    .post(user.createUser);


  app.route('/user/:userId')
    .get(user.getUser);


  app.route('/auth')
    .post(user.auth);

};
