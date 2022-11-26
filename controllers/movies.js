const Movie = require('../models/movie');
const BadRequetError = require('../errors/bad-request-err');
const NotFoundError = require('../errors/not-found-err');
const Forbidden = require('../errors/forbidden-err');

const createMovie = (req, res, next) => {
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    owner: req.user._id,
    movieId,
  })
    .then((movie) => res.send(movie))
    .catch((err) => {
      if (err.name === 'ValidationError') {
        next(new BadRequetError('Переданы некорректные данные при создании карточки фильма'));
      } else {
        next(err);
      }
    });
};

const findMovies = (req, res, next) => {
  Movie.find({ owner: req.user._id })
    .then((movies) => {
      res.send(movies);
    })
    .catch(next);
};

const deleteCard = (req, res, next) => {
  Movie.findById({ _id: req.params.cardId })
    .orFail(() => new NotFoundError('Карточка фильма не найдена'))
    .then((movie) => {
      if (!movie.owner.equals(req.user._id)) {
        next(new Forbidden('Это не ваша карточка фильма'));
      } else {
        Movie.deleteOne({ _id: req.params.cardId })
          .then(() => res.send({ message: 'Фильм удален' }))
          .catch(next);
      }
    })
    .catch(next);
};

module.exports = {
  createMovie,
  findMovies,
  deleteCard,
};
