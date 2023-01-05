const express = require('express');
const router = express.Router();
const { Entries, Token, Trips } = require('../models');
const jwt = require('jsonwebtoken');

// Auth Middleware
const jwtToReqUser = function (req, res, next) {
    try {
        console.log('req user middleware fired')
        const token = req.headers.authorization;
        const authToken = token.split(' ');
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

// GET Route for Entries by Trip
router.get('/:tripID', jwtToReqUser, async function(req, res) {
    const { tripID } = req.params;
    
    const entries = await Entries.findAll({ where: { tripID: tripID }})
    res.json(entries);
    // try {
    //     if (req.user) {
    //         const jwToken = await Token.findOne({ where: { token: req.user } })
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

// GET Route for single entry
router.get('/:tripID/entry/:entryID', jwtToReqUser, async function(req, res) {
    const { tripID, entryID } = req.params;
    const entry = await Entries.findOne({ where: { id: entryID }})
    const trip = await Trips.findOne({ where: { id: tripID } })
    const entryObj = {
        trip: trip,
        entry: entry
    }
    // console.log(entry, 'entry obj')
    res.json(entryObj);

    // try {
    //     if (req.user) {
    //         const jwToken = await Token.findOne({ where: { token: req.user } })
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

// GET Route to CREATE Entry

router.get('/:tripID/create', jwtToReqUser, async function(req, res) {
    res.json("Access Granted") 

    // try 
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

// POST Route For CREATE Entry
router.post('/:tripID/create', jwtToReqUser, async function(req, res) {
    const { date, title, content, photos, locations } = req.body;
    const { tripID } = req.params;
    
    const entry = await Entries.create({ date, title, content, photos, locations, tripID, userID: req.user.userID })
    res.json(entry) 

    // try {
    //     const decoded = jwt.verify(req.user, process.env.JWT_SECRET);
    //     const userID = decoded.id;
    // } catch (error) {
    //    console.log(error) 
    //    if (error.message.includes("jwt expired")) {
    //     res.json({message: "Token Expired"})
    //     }
    // }
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

    try {
        await Entries.update({ where: { id: entryID }})
        res.status(201).json({message: "entry updated"})  
    } catch (error) {
        console.log(error)
    }
})




module.exports = router;