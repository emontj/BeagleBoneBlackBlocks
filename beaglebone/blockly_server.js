const http = require('http');
const child_process = require('child_process');
const fs = require('fs');

const INTERNAL_SERVER_ERROR = 500;
const OKAY = 200;
const MAX_DATA_SIZE = 1e6;
const PORT_NUMBER = 5050;
const SERVER_URL = 'http://192.168.7.2:5050';
const POST_REQUEST = 'POST';
const CODE_FILE_PATH = __dirname + '/usercode.js';
const BONE_SCRIPT_REQUIRE_CODE = 'var b = require(\'bonescript\');';
const HEADERS = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
}

function responseToRequest(request, response) {

    if (request.method === POST_REQUEST) {

        getPostRequestData(request, function (code) {

            const codeWithBonescirptIncluded = BONE_SCRIPT_REQUIRE_CODE + code;
            
            fs.writeFile(CODE_FILE_PATH, codeWithBonescirptIncluded, function (error) {

                if (error) {
                    response.writeHead(INTERNAL_SERVER_ERROR, HEADERS);
                    response.end(responseAsJson);
                }
                else {
                    executeCode(function (programOutput) {
                        const responseData = JSON.stringify(programOutput);
                        response.writeHead(OKAY, HEADERS);
                        response.end(responseData);
                    });
                }
            });
        });
    }
}


/**
 * 
 * @param {*} request 
 * @param {function(string):void} callback 
 */
function getPostRequestData(request, callback) {
    const body = [];
    let dataSize = 0;

    request.on('data', function (data) {
        dataSize += data.length;
        if (dataSize >= MAX_DATA_SIZE) {
            response.connection.destroy();
        }
        body.push(data);
    });

    request.on('end', function () {
        const postData = Buffer.concat(body).toString();
        callback(postData);
    });
}

/**
 * 
 * @param {function({stdout : string, stderror : string, hasError : boolean}):void} callback 
 */
function executeCode(callback) {
    const child = child_process.spawn('node', [CODE_FILE_PATH]);
    const stdOutput = [];
    const errorOutput = [];

    child.stdout.on('data', function (data) {
        stdOutput.push(data);
    });

    child.stderr.on('data', function (data) {
        errorOutput.push(data);
    });

    child.on('exit', function (code, signal) {
        const programOutput = {};
        programOutput.stdout = stdOutput.join('\n') || "";
        programOutput.stderror = errorOutput.join('\n') || "";
        programOutput.hasError = errorOutput.length > 0;
        callback(programOutput);
    });
}


const server = http.createServer(responseToRequest);
server.listen(PORT_NUMBER);
console.log('BBB Web Server running at:' + SERVER_URL);