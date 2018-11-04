const mongoose = require('mongoose');

mongoose.connect("mongodb://localhost:27017/chat");
mongoose.connection.on('error', function () {
    console.log('Could not connect to database...');
});
mongoose.connection.on('open', function () {
    console.log('Successfully connected to database...');
});