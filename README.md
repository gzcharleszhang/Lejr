# Lejr - Winner of RBC's Best REST API Prize at UofTHacks V

HTTP Request URL: https://lejrbackend.herokuapp.com/ <br>
To Use the API: <br>
POST - /register<br>
parameters: { <br>
    username: String,<br>
    password: String,<br>
    email: String,<br>
}<br>
response: {<br>
    success: Boolean,<br>
    message: String<br>
}<br>
<br>
POST - /login<br>
parameters: {<br>
    username: String,<br>
    password: String<br>
}<br>
response: {<br>
    success: Boolean,<br>
    message: String<br>
}<br>
<br>
POST - /request<br>
parameters: {<br>
    sender: String,<br>
    recipient: String,<br>
    amount: Number<br>
}<br>
response: {<br>
    success: Boolean,<br>
    message: String<br>
}<br>
<br>
GET - /ledger<br>
response: [{<br>
    sender: String,<br>
    recipient: String,<br>
    amount: Number,<br>
    fulfilled: Boolean<br>
    invoiceNumber: String <br>
}]<br>
