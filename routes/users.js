const router = require('express').Router();

const {
  findUser,
  refreshUserInfo,
} = require('../controllers/users');

const {
  validationUpdateUser,
} = require('../middlewares/validations');

router.get('/me', findUser);
router.patch('/me', validationUpdateUser, refreshUserInfo);

module.exports = router;
