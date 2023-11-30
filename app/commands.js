const store = require('./store');

const parseRequest = function(buffer) {
    const requestLines = buffer.toString().trim().split("\r\n");
    const arrayLengthIndicator = requestLines[0];
    let command;
    let echoMessages = []

    if (arrayLengthIndicator.startsWith('*')) {
        const count = parseInt(arrayLengthIndicator.slice(1));
        command = requestLines[2].toUpperCase();
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

const sendEchoResponse = function(request, connection) {
    const response = request.echoMessages.join('\r\n');
    connection.write(`$${response.length}\r\n${response}\r\n`);
}

const setRequestValues = function(request, connection) {
    const response = request.echoMessages;
    const key = response[0];
    const value = response[1];
    const expireCommand = response[2];
    const expireTime = response[3];
    store[key] = [value];
    
    if (expireCommand?.toUpperCase() === 'PX' && expireTime) {
        setTimeout(() => {
            delete store[key]
        }, expireTime)
    }
    connection.write(`+OK\r\n`);
}

const getRequestValues = function(request, connection) {
    const response = request.echoMessages;
    const value = store[response[0]];

    if (value) {
        connection.write(`+${value}\r\n`);
    } else {
        connection.write(`$-1\r\n`);
    }
}

module.exports = { parseRequest, sendEchoResponse, setRequestValues, getRequestValues }