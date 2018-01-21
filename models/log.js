var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ledger Schema

var LogSchema = mongoose.Schema({
    note: {
        type: JSON
    },
    note2: {
        type: String
    }
});

var Log = module.exports = mongoose.model('Log', LogSchema);

module.exports.createLog = function(newLog, callback){
    newLog.save(callback)
};