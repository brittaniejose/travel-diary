const express = require('express');
const router = express.Router();
const { Trips, Entries, Token } = require('../models');

// Trip Routes
router.get('/', async function(req, res, next) {
    const token = req.headers.authorization;
    const authToken = token.split(' ');
    
    if (authToken[1]) {
        const jwToken = await Token.findOne({ where: { token: authToken[1] } })
        if (jwToken) {
            const trips = await Trips.findAll()
            res.json(trips);
        } else {
            res.json({message: 'Access Denied'})
        }
    } else {
        res.json({message: 'Access Denied'})
    }
   
})

// Create Trip Component
router.post('/create', async function(req, res, next) {
    const { startDate, name, endDate, userID } = req.body 
    const trip = await Trips.create({ startDate: startDate, endDate: endDate, name: name, userID: userID });
    res.json(trip)
})

router.get('/:tripID/entries', async function(req, res, next) {
    const { tripID } = req.params;
    const token = req.headers.authorization;
    const authToken = token.split(' ');
    
    if (authToken[1]) {
        const jwToken = await Token.findOne({ where: { token: authToken[1] } })
        if (jwToken) {
            const entries = await Entries.findAll({ where: { tripID: tripID }})
            res.json(entries);
        } else {
            res.json({message: 'Access Denied'})
        }
    } else {
        res.json({message: 'Access Denied'})
    }
   
})

module.exports = router;