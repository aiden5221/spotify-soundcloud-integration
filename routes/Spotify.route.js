const express = require('express');
const { STATUS_CODES } = require('http');
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

    const response = await spotifyUtils.getAccessToken(code);
    res.send('Successfully Signed In!')
});

router.get('/getMe', async (req, res) => {
    const response = await spotifyUtils.getMe();
    res.send(response)
});

router.get('/getPlaylists', async (req, res) => {
    const options = {
        limit: 50,
    }
    const response = await spotifyUtils.getPlaylists(options);
    res.send(response)
});

router.get('/getTracks/:playlistId', async (req, res) => {
    const { playlistId } = req.params;
    const response = await spotifyUtils.getTracks(playlistId);
    res.send(response);
});


module.exports = router;