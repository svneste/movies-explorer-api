const router = require('express').Router();
const NotFoundError = require('./not-found-err');

router.all('*', (req, res, next) => {
  next(new NotFoundError('Такой страницы не существует'));
});

module.exports = router;
