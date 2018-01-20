var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.post('/register', function(req, res, next) {
  var email = req.query.email;
  var password = req.query.password;
  var username = req.query.username;

  var user = new User({
      email: email,
      password: password,
      username: username
  });

  user.createUser(user, function(error, newUser){
    if (error) throw error;

    console.log(newUser);
  });
  
});

module.exports = router;
