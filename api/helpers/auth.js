const dotenv = require('dotenv').config();
const jwt    = require('jsonwebtoken');

exports.isAuth = (req) => {
  if (!req.get('Authorization')){
    console.log("No Bearer token present.");
    return false;
  }

  const bearer = req.get('Authorization');

  try {
    var decoded = jwt.verify(bearer, process.env.SECRET);
    console.log(decoded);
    return true;
  } catch(err) {
    console.log(err);
    return false;
  }

}
