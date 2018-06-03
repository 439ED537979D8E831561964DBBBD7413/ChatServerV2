const router = require('express').Router();
module.exports.init = function(io){

    const controller = require('../controllers/chat.controller');
    //pass io instance
    controller.init(io);

    router.post('/allConversations', controller.getConversations);
    router.post('/oneConversation', controller.getConversation);
    router.post('/newConversation', controller.newConversation);
    router.post('/reply', controller.sendReply);
    return router;
};