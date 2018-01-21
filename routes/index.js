var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Ledger = require('../models/ledger');
var Log = require('../models/log');
var request = require('request');

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
    function makeid() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for (var i = 0; i < 10; i++)
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        return text;
    }
    var paymentURL;
  var sender = req.body.sender;
  var recipient = req.body.recipient;
  var amount = req.body.amount;
  var sourceMoneyRequestId = makeid();

    // Set the headers
    var headers = {
        'thirdPartyAccessId': 'CA1TAUCyPsSfqkzX',
        'salt': 'jason',
        'secretKey': 'bkSFj52Ip9BLPbW+swg5oUAuA2pI2B0Lr4PENEmR1s0='
    };

    // Configure the request
    var options = {
        url: 'https://gateway-web.beta.interac.ca/publicapi/api/v1/access-tokens',
        method: 'GET',
        headers: headers
    };
    request(options, function (error, response, body) {
        if (!error && response.statusCode === 200) {
            // Print out the response body
            console.log(body);
        }
        var token = JSON.parse(body);
        headers = {
          accessToken: 'Bearer ' + token.access_token,
            thirdPartyAccessId: 'CA1TAUCyPsSfqkzX',
            requestId: sourceMoneyRequestId,
            deviceId: 'jason',
            apiRegistrationId: 'CA1ARhhdGyUQ2kqj',
            'content-type': 'application/json'
        };
        var reqBody = {
            "referenceNumber": "string",
            "sourceMoneyRequestId": sourceMoneyRequestId,
            "requestedFrom": {
                "contactName": "Jason",
                "language": "en",
                "notificationPreferences": [
                    {
                        "handle": "jason368@hotmail.ca",
                        "handleType": "email",
                        "active": true
                    }
                ]
            },
            "amount": 100,
            "currency": "CAD",
            "editableFulfillAmount": false,
            "requesterMessage": "Pay up!",
            "invoice": {
                "invoiceNumber": "string",
                "dueDate": "2018-02-01T16:12:12.000Z"
            },
            "expiryDate": "2018-02-01T16:12:12.000Z",
            "supressResponderNotifications": true,
            "returnURL": "string",
            "creationDate": "string",
            "status": 0,
            "fulfillAmount": 0,
            "responderMessage": "string",
            "notificationStatus": 0
        };
        options = {
            url: 'https://gateway-web.beta.interac.ca/publicapi/api/v2/money-requests/send',
            method: 'POST',
            body: JSON.stringify(reqBody),
            headers: headers
        };

        request(options, function (err, resq, body){
                // Print out the response body
                var result = JSON.parse(body);

                paymentURL = result.paymentGatewayUrl;
            //console.log(paymentURL);
            console.log(paymentURL);
            res.send(paymentURL);
        })

    });

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

  });

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

    var log = new Log({
        log: req.params.body
    });
    Log.createLog(log, function(err, newLog){
        console.log(newLog);
    });
  var updates = req.body.moneyRequestUpdates[0];

  var status = updates.state;
  var requestId = updates.sourceMoneyRequestId;

  if (status === "COMPLETED"){
    Ledger.find({sourceMoneyRequestId: requestId}, function(err, ledgers){
      var ledger = ledgers[0];
      ledger.fulfilled = true;
      ledger.save();
      console.log(ledger);


        var log = new Log({
            log: ledger
        });
        Log.createLog(log, function(err, newLog){
            console.log(newLog);
        });
        res.send("success")
    })
  } else {
      Ledger.find({sourceMoneyRequestId: requestId}, function(err, ledgers){
          var ledger = ledgers[0];
          ledger.fulfilled = true;
          ledger.save();
          console.log(ledger);
          var log = new Log({
              log: ledger
          });
          Log.createLog(log, function(err, newLog){
              console.log(newLog);
          });
          res.send("success")
      })
      //res.send("error")
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
