const express = require('express');
const router = express.Router();
const { Entries, Token } = require('../models');
const jwt = require('jsonwebtoken');

const jwtToReqUser = function (req, res, next) {
    console.log('req user middleware fired')
    const token = req.headers.authorization;
    const authToken = token.split(' ');
    req.user = authToken[1]
    console.log(req.user)
    next()
}


router.get('/:tripID', jwtToReqUser, async function(req, res) {
    const { tripID } = req.params;
    
    if (req.user) {
        const jwToken = await Token.findOne({ where: { token: req.user } })
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

// create get route for single entry


router.get('/:tripID/create', jwtToReqUser, async function(req, res) {
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

router.post('/:tripID/create', jwtToReqUser, async function(req, res) {
    const { date, title, content, photos, locations } = req.body;
    const { tripID } = req.params;

    try {
        const decoded = jwt.verify(req.user, process.env.JWT_SECRET);
        const userID = decoded.id;
        const entry = await Entries.create({ date, title, content, photos, locations, tripID, userID: userID })
        res.json(entry)       
    } catch (error) {
       console.log(error) 
    }
})

module.exports = router;