const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const userSchema = new Schema({

    name:String,
    phone:{
        type:String,
        unique:true,
        required:true
    },
    profilePic:{
        type:String,
        default:""
    }
},
    {
        timestamps:true
    });

module.exports = mongoose.model('User',userSchema);