const express = require('express');
const router = express.Router();
const { Trips, Entries } = require('../models');
const jwt = require('jsonwebtoken');

// Auth Middleware
const jwtToReqUser = function (req, res, next) {
    
    try {
        console.log('req user middleware fired')
        const token = req.headers.authorization;
        console.log(token, 'token ln 10 triproutes')
        const authToken = token.split(' ');
        console.log(authToken, 'authToken ln 12 triproutes')
        const decoded = jwt.verify(authToken[1], process.env.JWT_SECRET);
        const userID = decoded.id;
        console.log(userID, "userID tripRoutes ln 15")
        req.user = { token: authToken[1], userID: userID }
        console.log(req.user)
        next()
    } catch (error) {
        if (error.message.includes("jwt must be provided")) {
            
            console.log('token undefined, entryRoutes middleware')
            res.json({message: 'Access Denied'})
        }
        if (error.message.includes("jwt expired")) {
            console.log("token expired entryRoutes middleware'")
            res.json({message: "Token Expired"})
        } 
    }
}

// GET Trip Route
router.get('/', jwtToReqUser, async function(req, res, next) { 

    const trips = await Trips.findAll({ where: { userID: req.user.userID }})
    res.json(trips);
    

   
})

// GET Route to Create Trip 

router.get('/create', jwtToReqUser, async function(req, res) {

    res.json("Access Granted") 

})

// POST Route to Create Trip
router.post('/create', jwtToReqUser, async function(req, res, next) {
    const { startDate, name, endDate } = req.body;
    
    try {
        const trip = await Trips.create({ startDate, endDate, name, userID: req.user.userID });

        tripObj = {
            trip: trip,
            message: "Trip Successfully Created"
        }

        res.json(tripObj)
        
    } catch (error) {
        console.log(error)
    } 
})

router.post('/delete/:tripID', jwtToReqUser, async function (req, res) {
    const { tripID } = req.params;

    try {
        await Entries.destroy({ where: { tripID: tripID }})
        await Trips.destroy({ where: { id: tripID }})
        res.status(201).json({message: "trip deleted"})  
      } catch (error) {
          console.log(error)
      }
})



module.exports = router;