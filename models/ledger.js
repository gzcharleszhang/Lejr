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
       type: Number,
        default: 0
    },
    fulfilled: {
       type: Boolean,
        default: false
    },
    invoiceNumber: {
        type: String,
        default: 'p9fnqwkfnpoie'
    }
});

var Ledger = module.exports = mongoose.model('Ledger', LedgerSchema);

module.exports.createLedger = function(newLedger, callback){
    newLedger.save(callback)
};