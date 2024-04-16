'use strict';

import { apiKey, fetchData } from "./api.js";

const sidebar = () => {

    /**
     * fetch all genres e.g [ {"id": "123", "name":, "action" } ]
     * then change genre format e.g {123: "Action"}
     */
    const genreList = {};

    fetchData(`https://api.themoviedb.org/3/genre/movie/list?api_key=${apiKey}`, 
    function({genres}) {
        for(const {id, name} of genres) {
            genreList[id] = name
        }

        genreLink();
    });


    const sidebarInner = document.createElement("div");
    sidebarInner.classList.add("sidebar-inner");


    sidebarInner.innerHTML = `
    
    <div class="sidebar-inner">

        <div class="sidebar-list">
            <p class="title">Genre</p>
           
        </div>

        <div class="sidebar-list">
            <p class="title">Language</p>
            <a href="./movie-list.html" onClick='getMovieList("with_original_language=en", "English")' menu-close class="sidebar-link">English</a>
            <a href="./movie-list.html" onClick='getMovieList("with_original_language=hi", "Hindi")' menu-close class="sidebar-link">Hindi</a>
            <a href="./movie-list.html" onClick='getMovieList("with_original_language=bn", "Bengali")' menu-close class="sidebar-link">Bengali</a>
        </div>

        <div class="sidebar-footer">
            <p class="copyright">Copyright 2024 <a href="https://youtube.com/@delacliqueentertainment4456">Code-lova</a></p>
            <img src="./assets/images/tmdb-logo.svg" alt="the movie database logo" width="130" height="17">

        </div>
    </div>
    
    `;

    const genreLink = function() {

        for(const [genreId, genreName] of Object.entries(genreList)){

            const link = document.createElement("a");
            link.classList.add("sidebar-link");
            link.setAttribute("href", "./movie-list.html");
            link.setAttribute("menu-close", "");
            link.setAttribute("onclick", `getMovieList("with_genres=${genreId}", "${genreName}")`);
            link.textContent = genreName;

            sidebarInner.querySelectorAll(".sidebar-list")[0].appendChild(link);
        }

        const sidebar = document.querySelector("[sidebar]");
        sidebar.appendChild(sidebarInner);

        toggleSidebar(sidebar);
    }

    const toggleSidebar = (sidebar) => {
        /**
         * Toggle sidebar in mobile screen
         */

        const sidebarBtn = document.querySelector("[menu-btn]");
        const sidebarTogglers = document.querySelectorAll("[menu-toggler]");
        const sidebarClose = document.querySelectorAll("[menu-close]");
        const overlay = document.querySelector("[overlay]");

        addEventOnElements(sidebarTogglers, "click", function() {
            sidebar.classList.toggle("active");
            sidebarBtn.classList.toggle("active");
            overlay.classList.toggle("active");

        });


        addEventOnElements(sidebarClose, "click", function() {
            sidebar.classList.remove("active");
            sidebarBtn.classList.remove("active");
            overlay.classList.remove("active");

        });
    }
}

export default sidebar;