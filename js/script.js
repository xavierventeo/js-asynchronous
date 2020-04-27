
const getMovieHtml = movie => {
    return `
    <div class="movie" onclick="getMovieDetailed(${movie.id})">
        <img src="http://image.tmdb.org/t/p/w185${movie.poster_path}" alt="Imagen de la película">    
        <h3>${movie.title}</h3>  
    </div>
    `;   
}

const renderMovies = movies => {
    // Ver documentación de la API los parametros como el width: google: basepath img themoviedb
    document.querySelector('div.movies').innerHTML="";
    for (const movie of movies) {
         if (movie.poster_path != null) {
             document.querySelector('div.movies').innerHTML+= getMovieHtml(movie);
         }
     }
 }

const getMovieDetailedHtml = (movie) => {
    return `
    <div><h1>${movie.title}</h1><div>
    <div class="md-content row">
        <div class="md-image" col>
            <img src="http://image.tmdb.org/t/p/w300${movie.poster_path}" alt="Imagen de la película">
        </div>
        <div class="md-content col">    
            <p class="card-subtitle"><h3>Popularidad:</h3> ${movie.popularity}</p>
            <p class="card-subtitle"><h3>Overview:</h3></p>
            <p class="card-text">${movie.overview}</p>
            <p class="card-subtitle"><h3>Reparto:</h3></p>
            <p id="credits" "card-text"></p>
            <a href="#" onclick="getSimilarMovies(${movie.id})">Similar Movies</a>
        <div>
    </div>
    `;
}

//Utilizamos Promesas y axios
const getMovieDetailed = movie_id => {
    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}?api_key=${api_key}&language=es-ES`)
    .then (res => {
        const movie = res.data;
        document.querySelector('div.movies').innerHTML = getMovieDetailedHtml(movie);
        getMovieCredits(movie_id);
    })
}

//Utilizamos Promesas y fetch: Fetch siempre devuelve una promesa
const getPopularMovies = () => {
    fetch(`https://api.themoviedb.org/3/movie/popular?api_key=${api_key}&language=es-ES`)
    .then(res=>res.json())
    .then(res=> {
        const movies = res.results;
        renderMovies(movies);
    })
    .catch(error=>console.error(error));
}

//Obtenemos con axios para ello hay que buscar o bajarse la libreria axios y añadirla en la sección de scripts (axios cdn)
//Utilizamos Async / await y axions
const getLatestMovies = async () => {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/upcoming?api_key=${api_key}&language=es-ES`);
        const movies = res.data.results;
        renderMovies(movies);
    } catch (error) {
        console.error(error);
    }
}

const getSimilarMovies = async (movie_id) => {
    try {
        const res = await axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/similar?api_key=${api_key}&language=es-ES`);
        const movies = res.data.results;
        console.log(movies);
        renderMovies(movies);
    } catch (error) {
        console.error(error);
    }
}


//Buscar las películas que contengan el título de la caja buscadora
//Utilizamos async / await
const getFindMovies = async () => {
    try {
        const searchCriteria = document.getElementById("search").value;
        const res = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${api_key}&language=es-ES&query=${searchCriteria}`);
        const movies = res.data.results;
        renderMovies(movies);
    } catch (error) {
        console.error(error);
    }
}

//Draw the movie credits
const getMovieCreditsHtml = credits => {    
    let creditsHtml = "";
    let i = 0;

    while (i < credits.length) {
        let actor = credits[i];
        i++;
        let splitChar = i < credits.length ? `,`  : ``;
        creditsHtml += `${actor.character}${splitChar}`;
    }
    return creditsHtml;
}

//Utilizamos Promesas y axios
const getMovieCredits = movie_id => {
    axios.get(`https://api.themoviedb.org/3/movie/${movie_id}/credits?api_key=${api_key}&language=es-ES`)
    .then (res => {
        const credits = res.data.cast;
        document.getElementById('credits').innerHTML = getMovieCreditsHtml(credits);
    })
}
