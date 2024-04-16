'use strict';

import { apiKey, imageBaseUrl, fetchData } from "./api.js";
import sidebar from "./sidebar.js";
import createMovieCard from "./movie-card.js";
import searchMovie from "./search.js";


//Genre name and url parameter from loca storage
let genreName = window.localStorage.getItem("genreName");
let urlParam  = window.localStorage.getItem("urlParam");

const pageContent = document.querySelector("[page-content]");

sidebar();

let currentPage = 1;
let totalPages = 0;



fetchData(`https://api.themoviedb.org/3/discover/
movie?api_key=${apiKey}&include_adult=false&language=en-US&page=${currentPage}&sort_by=popularity.desc&${urlParam}`, function({results: movieList, total_pages}){

    totalPages = total_pages;

    document.title = `${genreName} - Movies NextFlix`;

    const movieListElement = document.createElement("section"); 
    movieListElement.classList.add("movie-list", "genre-list");

    movieListElement.ariaLabel = `${genreName} Movies`;

    movieListElement.innerHTML = `

        <div class="title-wrapper">
            <h1 class="heading">All ${genreName} Movies</h1>
        </div>

        <div class="grid-list"></div>

        <button class="btn load-more" load-more>Load More</button>  
    `;


    /**
     * Add movie card based on fetched details from sidebar
     */

    for (const movie of movieList) {
        const movieCard = createMovieCard(movie);

        movieListElement.querySelector(".grid-list").appendChild(movieCard);
    }

    pageContent.appendChild(movieListElement);



    /**
     * LOAD MORE BUTTON FUNCTIONALITY
     */
    const loadMore = document.querySelector("[load-more]");

    loadMore.addEventListener("click", function() {
          
        if(currentPage > totalPages){
            this.style.display = "none"; //this === loading button
            return;
        }
        currentPage++;
        this.classList.add("loading") //this === loading button

        fetchData(`https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&include_adult=false&language=en-US&page=${currentPage}&sort_by=popularity.desc&${urlParam}`, ({results: movieList}) => {

            this.classList.remove("loading") //this === loading button

            for(const movie of movieList){
                const movieCard = createMovieCard(movie);
                
                movieListElement.querySelector(".grid-list").appendChild(movieCard);
            }
        });
    });

});

searchMovie();