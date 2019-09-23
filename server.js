var http = require('http');
const app = require('./index');

const port = process.env.PORT || 8000;
const server  = http.createServer(app);

server.listen(port);
