const SpotifyWebApi = require('spotify-web-api-node');

const spotifyApi = new SpotifyWebApi({
    redirectUri: 'http://localhost:8888/spotify/callback',
    clientId: process.env.CLIENTID,
    clientSecret: process.env.CLIENTSECRET,
});

const scopes = [
    'ugc-image-upload',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'app-remote-control',
    'user-read-email',
    'user-read-private',
    'playlist-read-collaborative',
    'playlist-modify-public',
    'playlist-read-private',
    'playlist-modify-private',
    'user-library-modify',
    'user-library-read',
    'user-top-read',
    'user-read-playback-position',
    'user-read-recently-played',
    'user-follow-read',
    'user-follow-modify'
];


const getAuthURL = () => {
    return spotifyApi.createAuthorizeURL(scopes)
}

const getAccessToken = async (code) => {
    spotifyApi
    .authorizationCodeGrant(code)
    .then(data => {
        const access_token = data.body['access_token'];
        const refresh_token = data.body['refresh_token'];
        const expires_in = data.body['expires_in'];
        
        spotifyApi.setAccessToken(access_token);
        spotifyApi.setRefreshToken(refresh_token);
    
        console.log('access_token:', access_token);
        console.log('refresh_token:', refresh_token);
        console.log(`Sucessfully retreived access token. Expires in ${expires_in} s.`);
        return('Success! You can now close the window.');
    })
    .catch(error => {
        console.error('Error getting Tokens:', error);
        return(`Error getting Tokens: ${error}`);
    });

}

const getMe = async ()  => {
    try {
        const { body: { display_name, email, href, id } } = await spotifyApi.getMe();

        return { 
            userId : id,
            userEmail : email,
            userName: display_name,
            userHref: href,
        }
    } catch (error) {
        return error
    }
}


const getPlaylists = async (options) => {
    try {

        var { userId } = await getMe();

        const curPlaylists = await spotifyApi.getUserPlaylists(userId, options);

        return curPlaylists?.body?.items
    } catch (error) {
        console.error(error);
        return error.message;
    }
}

const getTracks = async (playlistId) => {
    try{
        var totalTracks = [];

        // Init call to get the limit of the playlist
        const { body: { items, total }} = await spotifyApi.getPlaylistTracks(playlistId, { limit: 80 });

        // Append the current items from init to totalTracks 
        totalTracks = totalTracks.concat(items);


        // While totalTracks.length is less than total gotten from init call
        while(totalTracks.length < total){

            // Get total playlists with offset of totalTracks.length
            var curTracks = await spotifyApi.getPlaylistTracks(playlistId, { limit: 80, offset: totalTracks.length });
            totalTracks = totalTracks.concat(curTracks?.body?.items);

        }
        
        return totalTracks;
    }catch (error) {
        console.error(error);
        return error.message;
    }
}


module.exports = { 
    getAccessToken, 
    getAuthURL,
    getPlaylists,
    getTracks,
    getMe,
};


// To get new refresh token 

// setInterval(async () => {
//     const data = await spotifyApi.refreshAccessToken();
//     const access_token = data.body['access_token'];

//     console.log('The access token has been refreshed!');
//     console.log('access_token:', access_token);
//     spotifyApi.setAccessToken(access_token);
// }, expires_in / 2 * 1000);