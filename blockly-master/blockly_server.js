const http = require('http');
const child_process = require('child_process');
const fs = require('fs');
const MAX_DATA_SIZE = 1e6;
const PORT_NUMBER = 3000;
const SERVER_URL = 'http://127.0.0.1:3000';
const POST_REQUEST = 'POST';
const CODE_FILE_PATH = __dirname + '/usercode.js';
const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin' : '*'
}

const INTERNAL_SERVER_ERROR = 500;
const OKAY = 200;
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

            fs.writeFile(CODE_FILE_PATH, code, function(error) {
                if (error) {
                    response.writeHead(INTERNAL_SERVER_ERROR, HEADERS);
                    const resposneData = JSON.stringify({ 'response' : error.message });
                    response.end( resposneData );
                }
                else {
                    const child = child_process.spawn('node', [CODE_FILE_PATH]);
                    const output = [];

                    child.stdout.on('data', function(data) {
                        output.push(data);
                    });

                    child.stderr.on('data', function(data) {
                        output.push(data);
                    });

                    child.on('exit', function(code, signal){
                        const responseData = output.join('\n');
                        response.writeHead(OKAY, HEADERS);
                        const resposneData = JSON.stringify({ 'response' : responseData });
                        response.end( resposneData );
                    });
                }
            });
        });
    }
});

server.listen(PORT_NUMBER);
console.log(`BBB Web Server running at ${SERVER_URL}`);