'use strict';

const apiKey = 'c9e3bd262637d47857e083900fc18e36';
const imageBaseUrl = 'https://image.tmdb.org/t/p/';

/**
 * Fetch data from api endpoint from server usig the auth
 * then pass in JSON data to a call back function along with optional
 * parameter if any  
 * 
 */

const fetchData = function(url, callback, optionalParam) {
    fetch(url)
        .then(response => response.json())
        .then(data => callback(data, optionalParam)); 
}


export {imageBaseUrl, apiKey, fetchData}