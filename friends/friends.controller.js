const Friend = require('./friends.model');

module.exports.NewFriendship = function(req, res){

    Friend.create(req.body)
    .then((friendship)=>{
        res.send({success:true, message:"Everything OK"});
    })
    .catch((err)=>{
        res.send({success:false, message:"Error adding friend: "+err});
    });

};

module.exports.GetFriendship = function(req, res){

    const userId = req.body.user_id;
    Friend.find({from:userId}).select('to').populate('to', '_id name profilePic')
    .then((friendships)=>{

        res.send({success:true, data:friendships, message:"Everything OK"});

    })
    .catch((err)=>{
        res.send({success:false, message:"Error: "+err});
    });

};

module.exports.DeleteFriendship = function(req, res){

    

};