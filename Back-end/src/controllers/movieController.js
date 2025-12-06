const tmdbService = require('../services/tmdbService');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();


const getSeedFromCode = (code) => {
  if (!code) return 1;
  let hash = 0;
  for (let i = 0; i < code.length; i++) {
    const char = code.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; 
  }
  return Math.abs(hash); 
};


const shuffleWithSeed = (array, seed) => {
  let m = array.length, t, i;
  
  const random = () => {
    var x = Math.sin(seed++) * 10000;
    return x - Math.floor(x);
  };

  while (m) {
    i = Math.floor(random() * m--);
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }
  return array;
};

exports.listMovies = async (req, res) => {
  try {
    const { roomCode } = req.query; 

    let genreToSearch = '28'; 
    let seed = 1;

    if (roomCode) {
      seed = getSeedFromCode(roomCode);

      const room = await prisma.room.findUnique({ where: { code: roomCode } });
      if (room) {
        genreToSearch = room.genreId;
      }
    }

   
    const startPage = (seed % 10) + 1; 

    let movies = await tmdbService.getMovies(genreToSearch, startPage);
    
    
    movies = shuffleWithSeed(movies, seed);

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