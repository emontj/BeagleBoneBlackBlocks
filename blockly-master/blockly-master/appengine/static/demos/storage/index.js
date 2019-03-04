 import { saveAs } from '/node_modules/file-saver/dist/FileSaver.js';
 //var FileSaver = require('../../../../../../../node_modules/file-saver/src/FileSaver.js');
//const BEAGLE_BONE_URL = 'http://192.168.7.2:5050';
const BEAGLE_BONE_URL = 'http://127.0.0.1:3000';

console.log(Object.keys(fs));

async function sendToBeagleBone(){
    
    const javascriptCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    const config = {
        method: 'POST',
        body: javascriptCode
    };

    const response = await fetch(BEAGLE_BONE_URL, config);

    if (response.ok){
        const jsonData = await response.json();
        console.log(jsonData['response']);
        document.getElementById("outputDiv").innerHTML= jsonData['response'];
        document.getElementById("jsCodeDiv").innerHTML= javascriptCode;
    }
    else {
       // display error
    }
}

function testing(){
    console.log("heeey");
}

function downloadAsFile(){
    
}


let button = document.getElementById("hi");
button.addEventListener("click", function (event) {
    const javascriptCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    var content = javascriptCode;
    // any kind of extension (.txt,.cpp,.cs,.bat)
    var filename = "hello.js";

    var blob = new Blob([content], {
    type: "text/plain;charset=utf-8"
    });

   saveAs(blob, filename);
});