const http = require('http');

const MAX_DATA_SIZE = 1e6;
//const PORT_NUMBER = 5050;
//const SERVER_URL = 'http://192.168.7.2:5050';
const PORT_NUMBER = 3000;
const SERVER_URL = 'http://127.0.0.1:3000';
const POST_REQUEST = 'POST';
const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*'
}

const server = http.createServer( function(request, response) {

    if (request.method === POST_REQUEST) {
        const body = [];
        let dataSize = 0;

        request.on('data', function(data) {
            dataSize += data.length;
            if (dataSize >= MAX_DATA_SIZE){
                response.connection.destroy();
            }
            body.push(data);
        });

        request.on('end', function() {
            const code = Buffer.concat(body).toString();
            const userFunction = new Function(code);
            const result = userFunction();
            response.writeHead(200, HEADERS);
            const resposneData = JSON.stringify({ 'response' : result });
            response.end( resposneData );
        });
    }
});

server.listen(PORT_NUMBER);
console.log(`BBB Web Server running at ${SERVER_URL}`);