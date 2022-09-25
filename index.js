const SpotifyWebApi = require('spotify-web-api-node');
const express = require('express');
require('dotenv').config();

const app = express();

const spotifyRouter = require('./routes/Spotify.route');

app.use('/spotify', spotifyRouter);

app.listen(8888, () =>
    console.log('HTTP Server up. Now go to http://localhost:8888/login in your browser.')
);