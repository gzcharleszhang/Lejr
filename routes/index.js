var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Ledger = require('../models/ledger');

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

router.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  var response = {
    success: false,
      message: "Error"
  };

  User.find({username: username}, function(err, users){
    if (users.length > 0){
      var user = users[0];
      if (user.password === password){
        response.success = true;
        response.message = "Successfully Authenticated"
      } else {
        response.message = "Wrong Password"
      }
    } else {
      response.message = "User does not exist"
    }
    res.send(response);
  })
});

router.post('/request', function(req, res){
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var amount = req.body.amount;

  var ledger = new Ledger({
      sender: sender,
      recipient: recipient,
      amount: amount
  });

  Ledger.createLedger(ledger, function(error, newLedger){
    console.log(newLedger);
  })
});

router.get('/ledger', function(req, res){
  Ledger.find().exec(function(error, ledgers){
    res.send(ledgers);
  })
});

router.get('/register', function(req, res, next){
  res.render('register');
});

router.get('/login', function(req, res, next){
  res.render('login');
});

module.exports = router;
