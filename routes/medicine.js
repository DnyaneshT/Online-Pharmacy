const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')

const medicineSchema = new mongoose.Schema({
    "Name": { type: String, required: true },
    "Price": { type: Number, required: false },
    "Quantity": { type: Number, required: true },
    "Treatment": { type: Array, required: true },
    "Deleted": { type: Boolean, required: true }
}, { strict: false })


var medicineModel = mongoose.model('medicineModel', medicineSchema, 'medicine') //modelname schema collectionname

//show all
router.get('/showAll', (req, res) => {
    medicineModel.find({ "Deleted": false }, (err, data) => {
        if (err)
            res.json({ msg: "Connection error", code: -2 })
        else {
            res.json({ msg: "Success", code: 0, data: data })
        }
    })
})

//find by name
router.get('/findByName/:name', (req, res) => {
    var query = req.params.name
    medicineModel.find({ "Name": query, "Deleted": false }, (err, data) => {
        if (err)
            res.json({ msg: "Connection error", code: -2 })
        else if (data.length == 0) {
            res.json({ msg: "Not Found", code: -1, data: data })
        } else {
            res.json({ msg: "Found!", code: 0, data: data })
        }
    })
})

// find by treatment
router.get('/findByTreatment/:treatment', (req, res) => {
    var query = req.params.treatment
    medicineModel.find({ "Treatment": { $in: [query] } }, (err, data) => {
        if (err)
            res.json({ msg: "Connection error", code: -2 })
        else if (data.length == 0) {
            res.json({ msg: "Not Found", code: -1, data: data })
        } else {
            res.json({ msg: "Success", code: 0, data: data })
        }
    })
})

//insert
router.post('/addNew', (req, res) => {
    var query = req.body.criteria
    medicineModel(query).save((err, data) => {
        if (err)
            res.json({ msg: "Connection error", code: -2 })
        else {
            res.json({ msg: "Inserted", code: 0, data: {} })
        }
    })
})

//soft delete
router.post('/delete', (req, res) => {
    var query = req.body.criteria
    medicineModel.updateOne({ "Name": query.Name }, { $set: { "Deleted": true } }, (err, data) => {
        if (err)
            res.json({ msg: "Connection error", code: -2 })
        else {
            res.json({ msg: "Deleted", code: 0, data: data })
        }
    })
})

module.exports = router