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
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response, null, 3));
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
                response.message = "Successfully Authenticated";
            } else {
                response.message = "Wrong Password" // Error response
            }
        } else {
            response.message = "User does not exist" // Error response
        }

    });
    res.setHeader('Content-Type', 'application/json');
    res.send(JSON.stringify(response, null, 3));
});

// POST method for money request
router.post('/request', function(req, res){
    var sender = req.body.sender;
    var recipient = req.body.recipient;
    var amount = req.body.amount;
    console.log(amount);
    if (!amount){
        amount = 0;
    }


    var ledger = new Ledger({
        sender: sender,
        recipient: recipient,
        amount: amount
    });

    // Creates new ledger object and writes to mongodb
    Ledger.createLedger(ledger, function(error, newLedger){
        console.log(newLedger);
        var response = {
            success: true,
            message: "Successfully created ledger"
        };
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(response, null, 3));

    });

});



router.get('/ledger', function(req, res, next){
    Ledger.find().exec(function(err, ledgers){
        res.setHeader('Content-Type', 'application/json');
        res.send(JSON.stringify(ledgers, null, 3));
    })
});


module.exports = router;
