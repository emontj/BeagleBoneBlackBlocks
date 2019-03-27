const BEAGLE_BONE_URL = 'http://127.0.0.1:3000';

document.addEventListener("DOMContentLoaded", () => {
    firebase.auth().onAuthStateChanged(function (user) {
        if (user) {
            // localStorage.setItem('email',user.email);
            init();
        } else {
            console.log("Shitttyyy")
        }

    });

});


function init() {

    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveWorkspace);

    const runButton = document.getElementById('run-button');
    runButton.addEventListener('click', sendToBeagleBone);

    loadWorkspace();

    // An href with #key trigers an AJAX call to retrieve saved blocks.
    if ('WorkspaceStorage' in window && window.location.hash.length > 1) {
        WorkspaceStorage.retrieveXml(window.location.hash.substring(1));
    }
}

async function sendToBeagleBone() {

    const javascriptCode = Blockly.JavaScript.workspaceToCode(demoWorkspace);

    const config = {
        method: 'POST',
        body: javascriptCode
    };

    const response = await fetch(BEAGLE_BONE_URL, config);

    if (response.ok) {
        const jsonData = await response.json();
        console.log(jsonData['response']);
        document.getElementById("outputDiv").innerHTML = jsonData['response'];
        document.getElementById("jsCodeDiv").innerHTML = javascriptCode;
    }
    else {
        // display error
    }
}


/**
 * Stores main workspace in cloud storage
 */
async function saveWorkspace() {
    let workspaceName = localStorage.getItem('workspaceName') || "";
    workspaceName = window.prompt('Name Your Workspace:', workspaceName);
    workspaceName = workspaceName.trim();
    
    if (workspaceName != "" && workspaceName != null) {
        document.getElementById("workspaceName").innerHTML = workspaceName;

        const workspace = Blockly.getMainWorkspace();
        const workspaceAsDom = Blockly.Xml.workspaceToDom(workspace, true);
        const blocks = Blockly.Xml.domToText(workspaceAsDom);
        try {
            const keyDidSave = await KeyStorage.put({
                blocks: blocks,
                name: workspaceName
            });
        } catch (error) {

            if (error instanceof UserSignInError) {

            }

            if (error instanceof HttpResponseError) {

                if (error.statusCode > 500) {
                    // server error
                }
                else {
                    // user error
                }
            }
        }
    }


}

async function loadWorkspace() {
    const workspaceName = localStorage.getItem('workspaceName');
    document.getElementById("workspaceName").innerHTML = workspaceName;

    const configs = {
        media: '../../media/',
        toolbox: document.getElementById('toolbox')
    };

    const currentWorkspace = Blockly.inject('blocklyDiv', configs);
    const workspace = await KeyStorage.get(workspaceName);
    const blocksAsDom = Blockly.Xml.textToDom(workspace.blocks);
    Blockly.Xml.domToWorkspace(blocksAsDom, currentWorkspace);
}
