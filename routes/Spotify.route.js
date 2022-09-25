const express = require('express');
const router = express.Router();
require('dotenv').config();

var spotifyUtils = require('../utils/Spotify.utils');

router.get('/login', async (req, res) => {
    const URL = await spotifyUtils.getAuthURL();
    res.redirect(URL);
});

router.get('/callback', async (req, res) => {
    const error = req.query.error;
    const code = req.query.code;
    const state = req.query.state;

    if (error) {
        console.error('Callback Error:', error);
        res.send(`Callback Error: ${error}`);
        return;
    }

    await spotifyUtils.getAccessToken(code);
    
});


module.exports = router;