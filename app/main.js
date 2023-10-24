const net = require("net");

const pongResponse = `+PONG\r\n`;

const server = net.createServer((connection) => {
  // Handle connection
  connection.on('data', () => {
    connection.write(pongResponse);
    connection.end; 
  })
});

server.listen(6379, "127.0.0.1");
