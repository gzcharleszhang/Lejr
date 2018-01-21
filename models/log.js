var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ledger Schema

var LogSchema = mongoose.Schema({
    log: {
        type: JSON
    }
});

var Log = module.exports = mongoose.model('Log', LogSchema);

module.exports.createLog = function(newLog, callback){
    newLog.save(callback)
};