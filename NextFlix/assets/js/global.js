'use strict';

/**
 *  Add event on multiple element
 * 
 */

const addEventOnElements = function(elements, eventType, callback){
    for(const elem of elements) elem.addEventListener(eventType, callback);
}


/**
 * toggle search box on mobile devices
 */

const searchBox = document.querySelector("[search-box]");
const searchTogglers  = document.querySelectorAll("[search-toggler]");

addEventOnElements(searchTogglers, "click", function(){
    searchBox.classList.toggle("active");
});


/**
 * Store movieId in local stroage when you click any movie card
 */

const getMovieDetail = (movieId) => {
    window.localStorage.setItem("movieId", String(movieId))
}



const getMovieList = (urlParam, genreName) => {
    window.localStorage.setItem("urlParam", urlParam);
    window.localStorage.setItem("genreName", genreName);

}