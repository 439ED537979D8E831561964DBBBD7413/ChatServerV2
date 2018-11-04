const router = require('express').Router();
module.exports.init = function(io){

    const controller = require('./chat.controller');
    //pass io instance
    controller.init(io);

    router.post('/hasConversation', controller.hasConversation);
    router.post('/allConversations', controller.getConversations);
    router.post('/oneConversation', controller.getConversation);
    router.post('/newConversation', controller.newConversation);
    router.post('/reply', controller.sendReply);
};

module.exports.getRouter = function () {
    return router;
};