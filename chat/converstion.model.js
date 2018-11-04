const mongoose = require('mongoose'),
    Schema = mongoose.Schema;

const ConversationSchema = new Schema({
    participants: {
        type:[{ type: Schema.Types.ObjectId, ref: 'User'}]
    }
},{
    timestamps:true
});

module.exports = mongoose.model('Conversation', ConversationSchema);