const express = require('express');
const router = express.Router();
const movieController = require('../controllers/movieController');

router.get('/', movieController.listMovies);      
router.get('/genres', movieController.listGenres); 

module.exports = router;