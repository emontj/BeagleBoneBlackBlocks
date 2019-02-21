const BEAGLE_BONE_URL = 'http://192.168.7.2:5050';

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
    }
    else {
       // display error
    }
}
