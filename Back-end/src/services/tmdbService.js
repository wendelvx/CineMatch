const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

exports.getMovies = async (genreId, startPage = 1) => {
  try {
    const pagesToFetch = [startPage, startPage + 1, startPage + 2];

    const requests = pagesToFetch.map(page => 
      axios.get(`${TMDB_BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          language: 'pt-BR',
          sort_by: 'popularity.desc',
          include_adult: false,
          include_video: false,
          page: page,
          with_genres: genreId
        }
      })
    );

    const responses = await Promise.all(requests);

    const allMovies = responses.flatMap(response => response.data.results);

    const formattedMovies = allMovies.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path, 
      release_date: movie.release_date ? movie.release_date.split('-')[0] : 'N/A', 
      vote_average: movie.vote_average
    }));

    const uniqueMovies = formattedMovies.filter((movie, index, self) =>
      index === self.findIndex((t) => (
        t.id === movie.id
      ))
    );

    return uniqueMovies;

  } catch (error) {
    console.error('Erro na TMDB:', error.message);
    throw new Error('Falha ao buscar filmes externos.');
  }
};

exports.getGenres = async () => {
    const response = await axios.get(`${TMDB_BASE_URL}/genre/movie/list`, {
        params: { api_key: API_KEY, language: 'pt-BR' }
    });
    return response.data.genres;
};