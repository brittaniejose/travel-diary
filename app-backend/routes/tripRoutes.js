const express = require('express');
const router = express.Router();
const { Trips, Token } = require('../models');
const jwt = require('jsonwebtoken');

// Auth Middleware

const jwtToReqUser = function (req, res, next) {
    console.log('req user middleware fired')
    const token = req.headers.authorization;
    const authToken = token.split(' ');
    req.user = authToken[1]
    console.log(req.user)
    next()
}

// Trip Routes
router.get('/', jwtToReqUser, async function(req, res, next) { 
    
    try {
        const jwToken = await Token.findOne({ where: { token: req.user } })
        if (jwToken) {
            const decoded = jwt.verify(req.user, process.env.JWT_SECRET);
            const userID = decoded.id;
            const trips = await Trips.findAll({ where: { userID: userID }})
            res.json(trips);
        } else {
            res.json({message:"Access Denied"})
        }     
    } catch (error) {
        if (error.message.includes("jwt expired")) {
            res.json({message: "Token Expired"})
        }
    }
   
})

// Create Trip Component routes

router.get('/create', jwtToReqUser, async function(req, res) {
    if (req.user) {
        const jwToken = await Token.findOne({ where: { token: req.user }});
        if (jwToken) {
           res.json("Access Granted") 
        } else {
            res.json({message: 'Access Denied'})
        }
    } else {
        res.json({message: 'Access Denied'})
    }
})

router.post('/create', jwtToReqUser, async function(req, res, next) {
    const { startDate, name, endDate } = req.body;
    
    try {
        const decoded = jwt.verify(req.user, process.env.JWT_SECRET);
        const userID = decoded.id;
        const trip = await Trips.create({ startDate, endDate, name, userID }, { validate: true });
        res.json(trip)
        
    } catch (error) {
        console.log(error)
    } 
})



module.exports = router;