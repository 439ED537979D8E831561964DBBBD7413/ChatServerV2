const global_file = require('./my_global_file');
const User = require('./models/user.model');

module.exports.init = function (io) {

    io.on('connection', function (socket) {

        socket.on('log me', function (userId) {

            global_file.loggedUsers[userId] = socket.id;

        });

        socket.on('join', function (conversationId) {
            if(!(socket.rooms.indexOf(conversationId)>=0)){
                socket.join(conversationId);
            }
        });

        socket.on('leave', function (conversationId) {
            if(socket.rooms.indexOf(conversationId)>=0){
                socket.leave(conversationId);
            }
        });

        socket.on('new message', function (data) {
            let toSend = {};

            User.findOne({_id: data.sender_id}).select('name profilePic -_id').exec(function (error, user) {

                if(!error) {

                    toSend.name = user.name;
                    toSend.profilePic = user.profilePic;
                    toSend.author = data.author;
                    toSend.conversationId = data.conversationId;
                    toSend.message = data.message;

                    io.to(data.conversationId).emit('new message', toSend);
                }

            });

        });

        socket.on('typing', function (data) {

           //data contains name and conversationId. Send data.name and handle on client side
            io.to(data.conversationId).emit('typing', data.name);

        });

        socket.on('stop typing', function (data) {

            //data contains conversationId
            io.to(data.conversationId).emit('stop typing');

        });

    });

    io.on('disconnect', function () {

    });

};