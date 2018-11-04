const router = require('express').Router();
const controller = require('./user.controller');

router.post('/register', controller.Register);
router.put('/login', controller.Login);
router.put('/resetPassword/:MODE', controller.ForgetPassword);
router.use('/friend', require('../friends/friends.routes'));
router.put('/profile', );

module.exports = router;