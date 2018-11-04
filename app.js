const
	express = require('express'),
    bodyParser = require('body-parser');

require('./utility/dbUtils');

let PORT = process.env.PORT || 8080;
let app = express();

let server = require('http').Server(app);
server.listen(PORT, function () {
	console.log('Server Running on Port: '+PORT);
});

let io = require('socket.io').listen(server);
let sockets=require('./socket.config');
sockets.init(io);

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

let routes = require('./chat/chat.routes');
routes.init(io);

app.use('/user', require('./user/user.routes'));
app.use('/chat', routes.getRouter());
app.get('/', function (req, res) {
	res.send('Hello from chat server. Start chatting...');
});
app.get('*', function (req, res) {
	res.status(404).send("PAGE NOT FOUND");
});
