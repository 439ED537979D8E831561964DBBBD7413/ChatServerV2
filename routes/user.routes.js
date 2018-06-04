const router = require('express').Router();
const User = require('../models/user.model');

module.exports = router;

router.post('/login', function (req, res) {

    //console.log('login request: ' +req.body);
    let name = req.body.name;
    let phone = req.body.phone;

    User.findOne({phone:phone}, function (error, user) {

        if(!error){

            if(!user){

                User.create({name:name, phone:phone}, function (error, user) {

                    if(!error){
                        //console.log('user created');
                        res.send({success:true, id:user._id, name:user.name});
                    }

                });

            }else {
                //console.log('user found');
                res.send({success:true, id:user._id, name:user.name});

            }

        }

    });

});