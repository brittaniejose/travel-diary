const express = require('express');
const router = express.Router();
const { Entries, Token, Trips } = require('../models');
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

// GET Route for Entries by Trip
router.get('/:tripID', jwtToReqUser, async function(req, res) {
    const { tripID } = req.params;
    
    const entries = await Entries.findAll({ where: { tripID: tripID }})
    res.json(entries);

})

// GET Route for single entry
router.get('/:tripID/entry/:entryID', jwtToReqUser, async function(req, res) {
    const { tripID, entryID } = req.params;
    const entry = await Entries.findOne({ where: { id: entryID }})

    res.json(entry);


})

// GET Route to CREATE Entry

router.get('/:tripID/create', jwtToReqUser, async function(req, res) {
    res.json("Access Granted") 

})

// POST Route For CREATE Entry
router.post('/:tripID/create', jwtToReqUser, async function(req, res) {
    const { date, title, photos, content, locations } = req.body;
    const { tripID } = req.params;
    
    console.log(req.body, 'req.body ln 109')

    const entry = await Entries.create({ date, title, content, photos, locations, tripID, userID: req.user.userID })

    entryObj = {
        entry: entry,
        message: "Entry Successfully Created"
    }

    res.json(entryObj) 

})



// POST Route to DELETE Entry
router.post('/delete/:entryID', jwtToReqUser, async function(req, res) {
    const { entryID } = req.params;

    try {
      await Entries.destroy({ where: { id: entryID }})
      res.status(201).json({message: "entry deleted"})  
    } catch (error) {
        console.log(error)
    }
})

// GET Route to Edit Entry
router.get('/edit/:entryID', jwtToReqUser, async function(req, res) {
    const { entryID } = req.params;

    try {
        const entry = await Entries.findOne({ where: { id: entryID }})
        res.json(entry);
        
    } catch (error) {
        console.log(error)
    }
})

// POST Route to Edit Entry
router.post('/edit/:entryID', jwtToReqUser, async function(req, res) {
    const { entryID } = req.params;
    const { date, title, content, photos, locations } = req.body;

    try {
        await Entries.update({date, title, content, photos, locations}, { where: { id: entryID }})
        res.status(201).json({message: "entry updated"})  
    } catch (error) {
        console.log(error)
    }
})




module.exports = router;