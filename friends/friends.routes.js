const router = require('express').Router();
const controller = require('./friends.controller');

router.post('/new', controller.NewFriendship);
router.put('/get', controller.GetFriendship);
router.put('/delete', controller.DeleteFriendship);

module.exports = router;