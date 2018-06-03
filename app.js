const
	express = require('express'),
	mongoose = require('mongoose'),
    bodyParser = require('body-parser');

let PORT = process.env.PORT || 8080;
let app = express();
let server = require('http').Server(app);
server.listen(PORT, function () {
	console.log('Server Running on Port: '+PORT);
});

let io = require('socket.io').listen(server);
require('./socket.config')(io);

mongoose.connect("mongodb://localhost:27017/chat");
mongoose.connection.on('error', function () {
    console.log('Could not connect to database...');
});
mongoose.connection.on('open', function () {
    console.log('Successfully connected to database...');
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let routes = require('./routes/chat.routes')(io);

app.use('/chat', routes);
app.get('/', function (req, res) {
	res.send('Hello from chat server. Start chatting...');
});
app.get('*', function (req, res) {
	res.status(404).send("PAGE NOT FOUND");
});