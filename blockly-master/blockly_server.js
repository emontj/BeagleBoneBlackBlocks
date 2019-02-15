const http = require('http');

const MAX_DATA_SIZE = 1e6;
const PORT_NUMBER = 5050;
const SERVER_URL = `http://192.168.7.2:${PORT_NUMBER}`;
const OKAY = 200;
const POST_REQUEST = 'POST;';

const server = http.createServer((request, response) => {

    if (request.method === POST_REQUEST) {
        const body = [];
        let dataSize = 0;

        request.on('data', data => {
            dataSize += data.length();
            if (dataSize >= MAX_DATA_SIZE){
                response.connection.destroy();
            }
            body.push(data);
        });

        request.on('end', () => {
            const code = Buffer.concat(body).toString();
            const result = new Function(code);

            response.writeHead(200, 'Content-Type', 'application/json');
            const resposneData = JSON.stringify({ 'response' : result });
            response.end( resposneData );
        });
    }
});

server.listen(PORT_NUMBER);
console.log(`BBB Web Server running at ${SERVER_URL}`);