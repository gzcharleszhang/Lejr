# LejrBackend

HTTP Request URL: https://lejrbackend.herokuapp.com/

POST - /register
parameters: {
    username: String,
    password: String,
    email: String,
}
response: {
    success: Boolean,
    message: String
}

POST - /login
parameters: {
    username: String,
    password: String
}
response: {
    success: Boolean,
    message: String
}

POST - /request
parameters: {
    sender: String,
    recipient: String,
    amount: Number
}
response: {
    success: Boolean,
    message: String
}

GET - /ledger
response: [{
    sender: String,
    recipient: String,
    amount: Number,
    fulfilled: Boolean
}]