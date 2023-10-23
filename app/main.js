const net = require("net");

const pongResponse = `+PONG\r\n`

// Uncomment this block to pass the first stage
const server = net.createServer((connection) => {
  // Handle connection
  connection.on('data', () => {
    connection.write(pongResponse);
    connection.end; 
  })
});

server.listen(6379, "127.0.0.1");
