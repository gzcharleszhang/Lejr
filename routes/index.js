var express = require('express');
var router = express.Router();
var User = require('../models/user');

/* GET home page. */
router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;

  var user = new User({
      email: email,
      password: password,
      username: username
  });

  User.createUser(user, function(error, newUser){
    if (error) throw error;

    console.log(newUser);
  });
  res.redirect('/register');
});

router.get('/register', function(req, res, next){
  res.render('register');
});





module.exports = router;
