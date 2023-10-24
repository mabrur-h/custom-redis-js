const net = require('net');

const server = net.createServer((connection) => {
    connection.on("data", (buffer) => {
        handleRequest(buffer, connection);
    });
});

server.listen(6379, "127.0.0.1");

function handleRequest(buffer, connection) {
    const request = parseRequest(buffer);
    const command = request.command;

    switch (command) {
        case "PING":
            connection.write("+PONG\r\n");
            break;
        case "ECHO":
            sendEchoResponse(request, connection);
            break;
        default:
            connection.write("-Unknown command\r\n");
    }
}

function parseRequest(buffer) {
    const requestLines = buffer.toString().trim().split("\r\n");
    const commandLine = requestLines.length === 1 ? requestLines[0] : requestLines[2];
    
    return {
        command: commandLine.toUpperCase(),
        echoMessage: requestLines[4] || ''
    };
}

function sendEchoResponse(request, connection) {
    const response = request.echoMessage;
    connection.write(`$${response.length}\r\n${response}\r\n`);
}