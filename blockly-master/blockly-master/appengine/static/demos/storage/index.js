const BEAGLE_BONE_URL = 'https://192.168.7.2:5050';



function displayWorkspaces(workspaces){
   //TODO Display workspace names on screen
}

async function saveWorkspace() {
  //TODO save workspace to to storage
}

async function sendToBeagleBone(){
    const javascriptCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);
    const config = {
        method: 'POST',
        body: javascriptCode
    };
    const response = await fetch(BEAGLE_BONE_URL, config);
    if (response.ok){
        const jsonData = response.json();
        console.log(jsonData['message']);
    }
    else{
        console.log('Could not run on beaglebone');
    }
}