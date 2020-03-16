//code 0 -> Success
//code -1 -> Error
//code -2 -> Connection Error
const mongoose = require('mongoose')
var medicine = require('./routes/medicine')
var customer = require('./routes/customer')
var bodyParser = require('body-parser') //middleware to parse data under req.body

const express = require('express')
const app = express()

//mongoose connection setup
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/OnlinePharmacy', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

//bodyparser setup
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

//middleware
app.use('/customer', customer)
app.use('/medicine', medicine)

const port = 8000
app.get('/', (req, res) => {
    res.send("SUCEESS")
})

app.listen(port, () => {
    console.log("listening")
})