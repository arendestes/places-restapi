const axios = require('axios');

const HttpError = require('../models/http-error');

const API_KEY = 'AIzaSyCN9OeY - z4TL8HjAFoHc8m4TIPlWgoc_ZI';

const getCoordsForAddress = async (address) => {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(address)}&key=${API_KEY}`);
    
    const data = response.data;

    if(!data || data.status === 'ZERO_RESULTS'){
        error = new HttpError("Could not find location for address.", 422);
        throw error;
    };

    const location = data.results[0].geometry.location;

    return location;
};

module.exports = getCoordsForAddress;