const net = require('net');

const store = {};

const server = net.createServer((connection) => {
    connection.on("data", (buffer) => {
        handleRequest(buffer, connection);
    });
});

server.listen(6379, "127.0.0.1");

function handleRequest(buffer, connection) {
    const request = parseRequest(buffer);
    console.log(request);
    const command = request.command;

    switch (command) {
        case "PING":
            connection.write("+PONG\r\n");
            break;
        case "ECHO":
            sendEchoResponse(request, connection);
            break;
        case "SET":
            setRequestValues(request, connection);
            break;
        case "GET":
            getRequestValues(request, connection);
        default:
            connection.write("-Unknown command\r\n");
    }
}

function parseRequest(buffer) {
    const requestLines = buffer.toString().trim().split("\r\n");
    const arrayLengthIndicator = requestLines[0];
    let command;
    let echoMessages = []

    if (arrayLengthIndicator.startsWith('*')) {
        const count = parseInt(arrayLengthIndicator.slice(1));
        command = requestLines[2].toUpperCase();
        console.log(requestLines)
        for (let i = 2; i <= count; i++) {
            echoMessages.push(requestLines[i * 2]);
        };
    } else {
        command = requestLines[0].toUpperCase();
        echoMessages = [];
    }

    return {
        command,
        echoMessages
    };
}

function sendEchoResponse(request, connection) {
    const response = request.echoMessages.join('\r\n');
    connection.write(`$${response.length}\r\n${response}\r\n`);
}

function setRequestValues(request, connection) {
    const response = request.echoMessages;
    store[response[0]] = response[1];
    connection.write(`+OK\r\n`);
}

function getRequestValues(request, connection) {
    const response = request.echoMessages;
    connection.write(`+${store[response[0]]}\r\n`)
}