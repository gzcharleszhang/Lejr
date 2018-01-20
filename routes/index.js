var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Ledger = require('../models/ledger');

/* POST method for user registration */
router.post('/register', function(req, res, next) {
  var email = req.body.email;
  var password = req.body.password;
  var username = req.body.username;

  var user = new User({
      email: email,
      password: password,
      username: username
  });

  // Creates new user
  User.createUser(user, function(error, newUser){
    if (error) throw error;

    console.log(newUser);
    var response = {
      success: true,
        message: "Successfully registered user"
    };
    res.send(response);
  });
});

// User registration for user login
router.post('/login', function(req, res){
  var username = req.body.username;
  var password = req.body.password;

  var response = {
    success: false,
      message: "Error"
  };

  // Queries for user in mongodb
  User.find({username: username}, function(err, users){
    // If user exists
    if (users.length > 0){
      var user = users[0];
      // Success response
      if (user.password === password){
        response.success = true;
        response.message = "Successfully Authenticated"
      } else {
        response.message = "Wrong Password" // Error response
      }
    } else {
      response.message = "User does not exist" // Error response
    }
    res.send(response);
  })
});

// POST method for money request
router.post('/request', function(req, res){
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var amount = req.body.amount;
  var sourceMoneyRequestId = req.body.sourceMoneyRequestId;

  var ledger = new Ledger({
      sender: sender,
      recipient: recipient,
      amount: amount,
      sourceMoneyRequestId: sourceMoneyRequestId
  });

  // Creates new ledger object and writes to mongodb
  Ledger.createLedger(ledger, function(error, newLedger){
    console.log(newLedger);
    var response = {
      success: true,
        message: "Successfully created ledger"
    };
    res.send(response);
  })
});


// GET method for ledger
router.get('/ledger', function(req, res){
  // Finds and returns all ledgers in mongodb
  Ledger.find().exec(function(error, ledgers){
    res.send(ledgers);
  })
});

// POST method for notifications (callback from Interac)
router.post('/notifications', function(req, res, next){
  var updates = req.body.body.moneyRequestUpdates;
  var status = updates.state;
  var requestId = updates.sourceMoneyRequestId;
  if (status === "COMPLETED"){
    Ledger.find({sourceMoneyRequestId: requestId}, function(err, ledgers){
      var ledger = ledgers[0];
      ledger.fulfilled = true;
      ledger.save();
      console.log(ledger);
      res.send("success")
    })
  } else {
      res.send("error")
  }
});

router.get('/register', function(req, res, next){
  res.render('register');
});

router.get('/login', function(req, res, next){
  res.render('login');
});

router.get('/request', function(req, res, next){
  res.render('request')
});

module.exports = router;
