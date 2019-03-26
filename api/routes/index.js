'use strict';

module.exports = function(app) {
  var userRoutes = require('./userRoutes');
  var strategyRoutes = require('./strategyRoutes');

  userRoutes(app);
  strategyRoutes(app);
};
