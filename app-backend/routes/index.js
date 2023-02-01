var express = require('express');
var router = express.Router();
const { User, Token } = require('../models');
const jwt = require('jsonwebtoken');
const path = require('path');


/* GET home page. */
router.get('/', function(req, res, next) {
  res.sendFile(path.join(__dirname, './dist', 'index.html'));
});


module.exports = router;
