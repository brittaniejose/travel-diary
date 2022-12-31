const express = require('express');
const router = express.Router();
const { Entries } = require('../models');

router.post('/create', async function(req, res) {
    const { date, title, content, photos, locations, tripID, userID } = req.body;
    const entry = await Entries.create({ date, title, content, photos, locations, tripID, userID: userID })
    res.json(entry)    
})

module.exports = router;