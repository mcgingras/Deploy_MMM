'use strict';
module.exports = function(app) {
  var strategy = require('../controllers/strategyController');

  app.route('/strategy')
    .post(strategy.createStrategy);

  app.route('/strategy/user/:userId')
    .get(strategy.getUserStrategies);

  app.route('/strategy/:strategyId')
    .get(strategy.getStrategy)
    .put(strategy.updateStrategy);

  app.route('/orders/')
    .post(strategy.getUserOrders);

  app.route('/feed/')
    .post(strategy.getDataFeed);

};
