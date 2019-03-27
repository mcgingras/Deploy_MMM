const dotenv = require('dotenv').config();

exports.getEnv = (v) => {
  return process.env[v];
}
