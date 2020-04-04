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
    if (query.Fname.length < 1 || query.UserId < 1 || query.Password < 1 || query.Email < 1) {
        flag = false
    }
    console.log("LENGHT:", query.Fname.length)
    if (flag == true) {
        customerModel.find({ "UserId": query.UserId }, (err, data) => {
            if (err)
                res.json({ msg: "Error in connections", code: -2 })
            else {
                console.log(data)
                if (data.length > 0) {
                    res.json({ msg: "Customer Already Exists", code: -1 })
                } else {

                    //query["type"] = "admin"
                    //customerModel.updateOne({ "UserId": query.UserId }, { $set: { "Fname": query.Fname, "Lname": query.Lname, "Password": query.Password, "Email": query.Email, "Contact": query.Contact, type: "customer" } }, { upsert: true }, 
                    customerModel(query).save((err, data) => {
                        if (err)
                            res.json({ msg: "Error in connections", code: -2 })
                        else {
                            console.log(data)
                            res.json({ msg: "Customer Added", code: 0 })
                        }
                    })

                }

            }
        })
    } else {
        res.json({ msg: "Invalid Data", code: -1 })
    }



})
module.exports = router