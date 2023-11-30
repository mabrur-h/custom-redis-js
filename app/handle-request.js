const { sendEchoResponse, setRequestValues, getRequestValues, parseRequest} = require('./commands')

const handleRequest = function(buffer, connection) {
    const request = parseRequest(buffer);
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
            break;
        default:
            connection.write("-Unknown command\r\n");
    }
}

module.exports = handleRequest;