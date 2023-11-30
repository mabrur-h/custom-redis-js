const net = require('net');
const handleRequest = require('./handle-request')

const server = net.createServer((connection) => {
    connection.on("data", (buffer) => {
        handleRequest(buffer, connection);
    });
});

server.listen(6379, "127.0.0.1");

// Install telnet. Run telnet localhost 6379. Send your request.