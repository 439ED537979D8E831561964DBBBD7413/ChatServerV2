const User = require('./user.model');
const bCrypt = require('bcrypt');
const config = require('../config.json');
const jwt = require('jsonwebtoken');

module.exports.Login = function(req, res){

    const _phone = req.body.phone;
    const password = req.body.password;
    
    User.findOne({phone: _phone})
    .then((user)=>{

        if(!user){
            res.send({success:false, message:"User Not Found"});
        }else{
            
            let match = bCrypt.compareSync(password, user.password);
            if(match){
                res.send({success:true, data:user, message:"Everything OK"});
            }else{
                res.send({success:false, message:"Passowrd Incorrect"});
            }

        }

    })
    .catch((err)=>{
        console.log("User login error: "+err);
        res.send({success:false, message:"Error logging in. "+err});
    });
    

};

module.exports.Register = function(req, res){

    let body = req.body;

    let salt = bCrypt.genSaltSync(config.SALT_WORK_FACTOR);
    let hash = bCrypt.hashSync(body.password, salt);
    body.password = hash;

    User.create(body)
    .then((user)=>{

        res.send({success:true, data:user, message:"Everything OK"});

    })
    .catch((err)=>{

        console.log("User creation error: "+err);
        res.send({success:false, message:"Error creating account "+err});

    });

};

module.exports.ForgetPassword = function(req, res){

    const MODE = Number(req.params.MODE);

    if(MODE === config.SEND_EMAIL){

        const email = req.body.email;
        User.findOne({phone:req.body.phone}).select('_id name')
        .then((user)=>{

            if(!user){
                res.send({success:false, message:"User Not Found."});
            }else{
                let token = jwt.sign({user_id:user._id}, config.SECRET_KEY, {expiresIn: 1800000});
                let text = "Password Reset Token: \n\n " + token + "\n\n This will expire in 30 minutes.";
                require('../utility/utils').sendEmail(user.name, email, text);
                res.send({success:true, message:"Password Reset Token has been sent to your email."});
            }
        })
        .catch((err)=>{

            res.send({success:false, message:"Error: "+err})

        });

    }else if(MODE === config.RESET_PASSWORD){

        const password = req.body.password;
        const token = req.body.token;

        jwt.verify(token, config.SECRET_KEY, (err, decoded)=>{

            if(err){
                res.send({success:false, message:"Invalid Password Reset Token"});
            }else{

                let salt = bCrypt.genSaltSync(config.SALT_WORK_FACTOR);
                let hash = bCrypt.hashSync(password, salt);
                User.updateOne({_id:decoded.user_id}, {$set:{password:hash}}, {new:true})
                .then((user)=>{
                    res.send({success:true, message:"Everything OK"});
                })
                .catch((err)=>{
                    res.send({success:false, message:"Could not change Password. Error: "+err})
                });

            }

        });

    }else{
        res.send({success:false, message:"Invalid Operation Requested"});
    }

};

module.exports.UsersForMe = function(req, res){

    const userId = req.body.user_id;
    const Friend = require('../friends/friends.model');

    Friend.find({from:userId}).select('-_id to').exec((err, friends)=>{

        if(!err){

            User.find({
                $and:[
                    {_id:{ $nin: friends}},
                    {_id:{ $ne: userId }}
                ]
                
            }).select('name profilePic about _id')
            .exec((err, users)=>{

                if(!err){
                    res.send({success:true, data:users, message:"Everything OK"});
                }else{
                    res.send({success:false, message:"Error: "+err});
                }

            });

        }else{
            res.send({success:false, message:"Error: "+err});
        }

    });

};