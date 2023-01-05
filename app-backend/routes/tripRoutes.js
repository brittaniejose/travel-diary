const express = require('express');
const router = express.Router();
const { Trips, Token } = require('../models');
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
        
        if (req.user) {
            next()
        } else {
            console.log('token undefined, entryRoutes middleware')
            res.json({message: 'Access Denied'})
        }    
        
    } catch (error) {
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
    
    // try {
    //     const jwToken = await Token.findOne({ where: { token: req.user.token } })
    //     if (jwToken) {
    //     } else {
    //         res.json({message:"Access Denied"})
    //     }
    // } catch (error) {
    //     if (error.message.includes("jwt expired")) {
    //         res.json({message: "Token Expired"})
    //     }
    // }
   
})

// GET Route to Create Trip 

router.get('/create', jwtToReqUser, async function(req, res) {

    res.json("Access Granted") 

    // try {
    //     if (req.user) {
    //         const jwToken = await Token.findOne({ where: { token: req.user }});
    //         if (jwToken) {
    //         } else {
    //             res.json({message: 'Access Denied'})
    //         }
    //     }     
    // } catch (error) {
    //     if (error.message.includes("jwt expired")) {
    //         res.json({message: "Token Expired"})
    //     }
    // }
})

// POST Route to Create Trip
router.post('/create', jwtToReqUser, async function(req, res, next) {
    const { startDate, name, endDate } = req.body;
    
    try {
        const trip = await Trips.create({ startDate, endDate, name, userID }, { validate: true });
        res.json(trip)
        
    } catch (error) {
        console.log(error)
    } 
})



module.exports = router;