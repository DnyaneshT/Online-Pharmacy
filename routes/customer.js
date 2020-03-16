const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const customerSchema = new mongoose.Schema({
    "Fname": { type: String, required: true },
    "Lname": { type: String, required: false },
    "UserId": { type: String, required: true },
    "Password": { type: String, required: true },
    "Email": { type: String, required: true },
    "Contact": { type: Number, required: false }
}, { strict: false })

var customerModel = mongoose.model('customerModel', customerSchema, 'customer') //modelname schemaname collectionname

//login
router.post('/login', (req, res) => {
    var query = req.body.criteria
    customerModel.find({ "UserId": query.UserId, "Password": query.Password }, (err, data1) => {
        if (err) {
            res.json({ msg: "Error in connections", code: -2 })
            console.log("Invalid Fname or Lname!")
        } else if (data1.length == 0) {
            console.log(query.Password)
            res.json({ msg: "Invalid UserId and Password", code: -1 })
        } else {
            var data = JSON.parse(JSON.stringify(data1)) //JSON-> string -> JSON
            console.log("Login Successful")
            if (data[0].type == "admin") {
                res.json({ msg: "A", code: 0, data: "Logged in as Admin" })
            } else {
                res.json({ msg: "C", code: 0, data: "Logged in as Customer" })
            }
        }
    })
})

//add new cutomers
router.post('/newCustomer', (req, res) => {
    var query = req.body.criteria
    var flag = true
    if (query.Fname.length < 0 && query.UserId < 0 && query.Password < 0 && query.Email < 0) {
        flag = false
    }
    console.log(flag)
    if (flag == true) { /*  |  */
        query["type"] = "customer" /*Will add rest of the fields here v */
        customerModel(query).update({ "UserId": query.UserId, "Password": query.Password }, { $set: { "Fname": query.Fname, "Lname": query.Lname } }, { upsert: true }, (err, data) => {
            if (err)
                res.json({ msg: "Error in connections", code: -2 })
            else {
                console.log(data)
                res.json({ msg: "Customer Added", code: 0, })
            }
        })
    } else {
        res.json({ msg: "Invalid Data", code: -1 })
    }
})
module.exports = router