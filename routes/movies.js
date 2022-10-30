const router = require('express').Router();

const {
  createMovie,
  findMovies,
  deleteCard,
} = require('../controllers/movies');

const {
  validationMovieId,
  validationCreateMovie,
} = require('../middlewares/validations');

router.post('/', validationCreateMovie, createMovie);
router.get('/', findMovies);
router.delete('/:cardId', validationMovieId, deleteCard);

module.exports = router;
