var mongoose = require('mongoose');
var Schema = mongoose.Schema;

// Ledger Schema

var LedgerSchema = mongoose.Schema({
   sender: {
       type: String
   },
    recipient: {
       type: String
    },
    amount: {
       type: Number
    },
    fulfilled: {
       type: Boolean,
        default: false
    },
    sourceMoneyRequestId: {
        type: String
    }
});

var Ledger = module.exports = mongoose.model('Ledger', LedgerSchema);

module.exports.createLedger = function(newLedger, callback){
    newLedger.save(callback)
};