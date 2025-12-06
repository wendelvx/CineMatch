const axios = require('axios');

const TMDB_BASE_URL = 'https://api.themoviedb.org/3';
const API_KEY = process.env.TMDB_API_KEY;

exports.getMovies = async (genreId, page = 1) => {
  try {
    const response = await axios.get(`${TMDB_BASE_URL}/discover/movie`, {
      params: {
        api_key: API_KEY,
        language: 'pt-BR',
        sort_by: 'popularity.desc', 
        include_adult: false,
        include_video: false,
        page: page,
        with_genres: genreId 
      }
    });

   
    const formattedMovies = response.data.results.map(movie => ({
      id: movie.id,
      title: movie.title,
      overview: movie.overview,
      poster_path: movie.poster_path, // O front vai montar a URL completa da imagem
      release_date: movie.release_date ? movie.release_date.split('-')[0] : 'N/A', // Apenas o ano
      vote_average: movie.vote_average
    }));

    return formattedMovies;

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