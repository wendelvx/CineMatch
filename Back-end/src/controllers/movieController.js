const tmdbService = require('../services/tmdbService');

exports.listMovies = async (req, res) => {
  try {
    const { genre, page } = req.query; 
    
    const movies = await tmdbService.getMovies(genre, page);
    
    return res.json(movies);
  } catch (error) {
    return res.status(500).json({ error: 'Erro ao buscar filmes.' });
  }
};

exports.listGenres = async (req, res) => {
    try {
        const genres = await tmdbService.getGenres();
        return res.json(genres);
    } catch (error) {
        return res.status(500).json({ error: 'Erro ao buscar gêneros.' });
    }
};