'use strict';
/**
 * Import all components
 */

import sidebar from "./sidebar.js";

import { apiKey, imageBaseUrl, fetchData } from "./api.js";

import createMovieCard from "./movie-card.js"

import searchMovie from "./search.js";

const pageContent =  document.querySelector("[page-content]");


sidebar();




    /**
     * Home page section (Top rated, upcoming, trending videos)
     */

    const HomePageSections = [

        {
            title: "Upcoming Movies",
            path: "/movie/upcoming"
        },
        {
            title: "Weekly Tredning Movies",
            path: "/trending/movie/week"
        },
        {
            title: "Top Rated Movies",
            path: "/movie/top_rated"
        },
    ]

 /**
     * fetch all genres e.g [ {"id": "123", "name":, "action" } ]
     * then change genre format e.g {123: "Action"}
     */
const genreList = {

    /**
     * create genre string from genre_id e.g [123, 43] -> "Action", "Romance"
     */

    asString(genreIdList) {
        let newGenreList = [];

        for(const genreId of genreIdList) {
            this[genreId] && newGenreList.push(this[genreId]); // this genreList
        }
        return newGenreList.join(", ")
    }

};

fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`, 
function({genres}) {
    for(const {id, name} of genres) {
        genreList[id] = name
    }
    
fetchData(`https://api.themoviedb.org/3/movie/popular?api_key=${apiKey}&page=1`, heroBanner);

});



const heroBanner = function({results: movieList}) {
    const banner  = document.createElement("section");
    banner.classList.add("banner");
    banner.ariaLabel = "Popular movies";

    banner.innerHTML = `

        <div class="banner-slider"></div>

        <div class="slider-control">
            <div class="control-inner"></div>
        </div>
        

    `;



    let controlItemIndex = 0;

    for (const [index, movie] of movieList.entries()) {
        const {
            backdrop_path,
            title,
            release_date,
            genre_ids,
            overview,
            poster_path,
            vote_average,
            id
        } = movie;

        const sliderItem = document.createElement("div");
        sliderItem.classList.add("slider-item");
        sliderItem.setAttribute("slider-item", "");

        sliderItem.innerHTML = `

        <img src="${imageBaseUrl}w1280${backdrop_path}" class="img-cover" alt="${title}" loading="${index === 0 ? "eager": "lazy"}">

        <div class="banner-content">

            <h2 class="heading">${title}</h2>

            <div class="meta-list">
                <div class="meta-item">${release_date.split("-")[0]}</div>

                <div class="meta-item card-badge">${vote_average.toFixed(1)}</div>
            </div>

            <p class="genre">${genreList.asString(genre_ids)}</p>
            <p class="banner-text">${overview}</p>

            <a href="./detail.html" class="btn" onClick="getMovieDetail(${id})">
                <img src="./assets/images/play_circle.png" alt="play-circle" width="24" height="24" aria-hidden="true">

                <span class="span">Watch Now</span>
            </a>
        </div>
        
        `;

        banner.querySelector(".banner-slider").appendChild(sliderItem);


        const controlItem = document.createElement("button");
        controlItem.classList.add("poster-box", "slider-item");
        controlItem.setAttribute("slider-control", `${controlItemIndex}`);

        controlItemIndex++;

        controlItem.innerHTML = `

            <img src="${imageBaseUrl}w154${poster_path}" alt="Slide to ${title}" 
            loading="lazy" draggable="false" class="img-cover">
        `;

        banner.querySelector(".control-inner").appendChild(controlItem);
    }


    pageContent.appendChild(banner);

    addHeroSlide();

     /**
     * Fetch data for homepage section (Top rated, upcoming, trending videos)
     */

     for(const {title, path} of HomePageSections) {
        fetchData(`https://api.themoviedb.org/3${path}?api_key=${apiKey}&page=1`, createMovieList, title);

     }
  
}


/**
 * Hero slider functionality
 */

const addHeroSlide = function () {

    const sliderItems = document.querySelectorAll("[slider-item]");

    const sliderControls = document.querySelectorAll("[slider-control]");

    let lastSliderItem = sliderItems[0];
    let lastSliderControl =  sliderControls[0]; 


    lastSliderItem.classList.add("active");
    lastSliderControl.classList.add("active");

    const sliderStart = function() {
        lastSliderItem.classList.remove("active");
        lastSliderControl.classList.remove("active");

        //`this` == slider-control
        sliderItems[Number(this.getAttribute("slider-control"))]
        .classList.add("active");
        this.classList.add("active");

        lastSliderItem = sliderItems[Number(this.getAttribute("slider-control"))];

        lastSliderControl = this;
    }


    addEventOnElements(sliderControls, "click", sliderStart);


}


const createMovieList = function({results: movieList}, title){
    const movieListElem = document.createElement("section");
    movieListElem.classList.add("movie-list");
    movieListElem.ariaLabel = `${title}`;

    movieListElem.innerHTML = `
    
        <div class="title-wrapper">
            <h3 class="title-large">${title}</h3>
        </div>
        <div class="slider-list">
            <div class="slider-inner"></div>
        </div>
    
    `;

    for(const movie of movieList) {
        const movieCard = createMovieCard(movie) // call from movie_card.js

        movieListElem.querySelector(".slider-inner").appendChild(movieCard)
    }

    pageContent.appendChild(movieListElem);
}

searchMovie();
