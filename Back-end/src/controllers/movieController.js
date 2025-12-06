const tmdbService = require('../services/tmdbService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

exports.listMovies = async (req, res) => {
  try {
    const { roomCode, page } = req.query;

    let genreToSearch = '28'; 

    if (roomCode) {
      const room = await prisma.room.findUnique({ where: { code: roomCode } });
      if (room) {
        genreToSearch = room.genreId;
      }
    }

    const movies = await tmdbService.getMovies(genreToSearch, page);
    
    return res.json(movies);
  } catch (error) {
    console.error(error);
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