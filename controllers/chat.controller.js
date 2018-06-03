const Conversation = require('../models/converstion.model'),
    Message = require('../models/message.model'),
    User = require('../models/user.model'),
    global_file = require('../my_global_file');

let my_io = undefined;

module.exports.init = function (io) {

    my_io = io;

};

module.exports.getConversations = function (req, res) {

    const userId = req.body.id;

    Conversation.find({ participants: userId})
        .select('_id')
        .exec(function (error, conversations) {

            if(!error){

                var fullConversations = [];

                conversations.forEach(function (conversation) {

                    Message.find({'conversationId':conversation._id})
                        .sort('-createdAt')
                        .limit(1)
                        .exec(function (error, message) {

                            if(!error){
                                fullConversations.push(message);

                                if(fullConversations.length === conversations.length){
                                    res.send({success:true, conversations:fullConversations});
                                }
                            }

                        });

                });

            }else {
                res.send({success:false, message:"Could not fetch conversations"});
            }

        });

};

module.exports.getConversation = function (req, res) {

    const conversationId = req.body.conversationId;

    Message.find({ conversationId: conversationId})
        .select('createdAt body author')
        .sort('-createdAt')
        .populate({
            path: 'author',
            select: 'name'
        })
        .exec(function(err, messages) {
            if (err) {
                res.send({ error: err });
                return next(err);
            }

            res.send({success:true, conversation: messages ,message:"Everything OK"});
        });


};

module.exports.newConversation = function (req, res) {

    const sender = req.body.sender_id;
    const recipient = req.body.recipient_id;
    const composedMessage = req.body.message;

    const conversation = new Conversation({

        participants:[sender, recipient]

    });

    conversation.save(function (error, newConversation) {

        if(!error){

            const message = new Message({
                conversationId:newConversation._id,
                body:composedMessage,
                author:sender
            });

            message.save(function (error, newMessage) {

                if(!error){

                    //joining rooms
                    let socket1 = my_io.sockets.connected[global_file.loggedUsers[sender]];
                    let socket2 = my_io.sockets.connected[global_file.loggedUsers[recipient]];
                    let emitEvent = true;

                    if(socket1 !== undefined){
                        socket1.join(newConversation._id);
                    }else {
                        emitEvent = false;
                    }
                    if(socket2 !== undefined){
                        socket2.join(newConversation._id);
                    }else {
                        emitEvent = false;
                    }

                    //send response
                    res.send({success:true, conversationId:newConversation._id,message:"Conversation started successfully"});

                    //emit event
                    if(emitEvent){

                        User.findOne({_id:sender}).select('name profilePic -_id').exec(function (error, user) {

                            if(!error) {
                                let toSend = {conversationId:newConversation._id, author:sender, message:composedMessage };
                                toSend.name = user.name;
                                toSend.profilePic = user.profilePic;
                                toSend.author = data.author;
                                toSend.conversationId = data.conversationId;
                                toSend.message = data.message;

                                my_io.in(newConversation._id).emit('new message', toSend);
                            }

                        });

                    }

                }else {
                    console.log("NEW CONVERSATION MESSAGE: " + error);
                    res.send({success:true, conversationId:newConversation._id,message:"Conversation started but message not sent."});
                }

            });

        }else {
            console.log("NEW CONVERSATION: " + error);
            res.send({success:false, message:"Could not start a conversation."});
        }

    });

};

module.exports.sendReply = function (req, res) {

    const reply = new Message({

        conversationId:req.body.conversationId,
        body:req.body.message,
        author:req.body.sender_id

    });

    reply.save(function (error, reply) {

        if(!error){
            res.send({success:true, message:"Message successfully sent"});
        }else {
            console.log("CHAT REPLY: "+error);
            res.send({success:false, message:"Message could not sent"});
        }

    });

};
