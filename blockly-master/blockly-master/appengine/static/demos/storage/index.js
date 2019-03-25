const BEAGLE_BONE_URL = 'http://127.0.0.1:3000';


document.addEventListener("DOMContentLoaded", () => {
    init();
});


function init() {
    
    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveWorkspace);

    const runButton = document.getElementById('run-button');
    runButton.addEventListener('click', sendToBeagleBone);

    const configs = {
        media: '../../media/',
        toolbox: document.getElementById('toolbox')
    };
    const demoWorkspace = Blockly.inject('blocklyDiv', configs);

    // An href with #key trigers an AJAX call to retrieve saved blocks.
    if ('WorkspaceStorage' in window && window.location.hash.length > 1) {
      WorkspaceStorage.retrieveXml(window.location.hash.substring(1));
    }
}

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


/**
 * Stores main workspace in cloud storage
 */
async function saveWorkspace() {
    const workspace = Blockly.getMainWorkspace();
    const workspaceKey = 'testKey';
    const workspaceName = 'testName';
    const keyDidSave = await KeyStorage.put(workspaceName, workspaceKey);

    if (workspaceKey != null){
        const workspaceName = getWorkspaceName();
       

        if (keyDidSave) {
            // let user know it saved.
        }
        else {
            // let user know it did not save.
        }
    }
    else {
        // let user know it did not save
    }
}

function getWorkspaceName() {
    let workspaceName = undefined;
    const workspaceNameHtml = document.getElementById('workspaceName');
    if (workspaceNameHtml != null) {
        workspaceName = workspaceNameHtml.textContent;
    }
    return workspaceName;
}

async function restoreWorkspace() {
    const workspaceName = getWorkspaceName();
    const workspaceKey = await KeyStorage.get(workspaceName);

    if (workspaceKey != null) {
        const workspaceAsString = await BlocklyStorage.getFromCloud(workspaceKey);
        if (workspaceAsString != null) {
            const workspaceAsDom = Blockly.Xml.textToDom(workspaceAsString);
            const currentWorkspace = Blockly.getMainWorkspace();
            Blockly.Xml.domToWorkspace(currentWorkspace, workspaceAsDom);
        }
        else {
            // bad tings
        }
    }
    else {
        // bad tings
    }
}
