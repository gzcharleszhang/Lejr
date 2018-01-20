var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// User Schema

var UserSchema = mongoose.Schema({
   username: {
       type: String
   },
    email: {
       type: String
    },
    password: {
       type:String
    }
});

var User = module.exports = mongoose.model('User', UserSchema);

module.exports.createUser = function(newUser, callback){
    newUser.save(callback);
};