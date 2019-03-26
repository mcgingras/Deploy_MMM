var express = require('express');
var mongoose = require('mongoose');
var cors = require('cors')
const path = require("path")
var bodyParser = require('body-parser');
require("dotenv").config()


var app = express();
var port = process.env.PORT || 3000;

var User = require('./api/models/userModel');
var Strategy = require('./api/models/strategyModel');

mongoose.Promise = global.Promise;
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/veil');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

var routes = require('./api/routes/index');
routes(app);

app.use(express.static(path.join(__dirname, "client", "build")))

app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});

app.listen(port);

console.log('Veil MMM started on: ' + port);
