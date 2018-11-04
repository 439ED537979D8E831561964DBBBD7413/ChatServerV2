const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({

    name:{
        type: String,
        required: true
    },
    phone:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        require: true,
    },
    about:{
        type: String,
        default: ""
    },
    profilePic:{
        type: String,
        default: ""
    },
    token:{
        type:String,
        default:""
    }

},{
    timestamps: true
});

module.exports = mongoose.model("User", userSchema);
