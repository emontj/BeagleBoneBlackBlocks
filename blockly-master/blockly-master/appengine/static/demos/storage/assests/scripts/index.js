const SERVER_URL = config.beagleBone.serverUrl;
const localHost = 'http://127.0.0.1:5050';
document.addEventListener("DOMContentLoaded", init);

async function init() {

    document.getElementById('search-button').onclick = async event => {
        event.preventDefault();
        console.log("byeee");
        const keywords = document.getElementById('search-input').value;
        const keywordsAsArray = keywords.split(' ');

        try {
            const workspaces = await WorkspaceStorage.find(keywordsAsArray);
            console.log("beboop", workspaces);
            const workspacesAsJsonString = JSON.stringify(workspaces);
            localStorage.setItem('searchResults', workspacesAsJsonString);
            localStorage.setItem('searchedString', keywords);
            console.log(workspaces);
            location.href = 'search.html';
        } catch (error) {
            console.log(error);
        }


    };

    const saveButton = document.getElementById('save-button');
    saveButton.addEventListener('click', saveWorkspace);

    const runButton = document.getElementById('run-button');
    runButton.addEventListener('click', executeCodeOnBeagleBone);

    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            loadWorkspace();
        } else {
            /**
             * TODO:
             * Force user to sign in.
             */
        }
    });
}

async function executeCodeOnBeagleBone() {
    const workspace = Blockly.getMainWorkspace();
    const javascriptCode = Blockly.JavaScript.workspaceToCode(workspace);
    const requestParams = {
        method: 'POST',
        body: javascriptCode
    }
    const response = await fetch(localHost, requestParams);

    if (response.ok) {
        const outputResult = await response.json();

        document.getElementById("outputDiv").innerHTML = outputResult.hasError ? 
                outputResult.stderror : outputResult.stdout;

        document.getElementById("jsCodeDiv").innerHTML = js_beautify(javascriptCode);

    }
}


/**
 * Stores main workspace in cloud storage
 */
async function saveWorkspace() {
    let workspaceName = localStorage.getItem('workspaceName');
    workspaceName = prompt('Name Your Workspace:', workspaceName).trim();

    if (!validWorkspaceName(workspaceName)) {
        /**
         * TODO:
         * Let user know they need ot make a new name
         */
    }

    try {
        const blocks = getBlocks();
        await WorkspaceStorage.put({ blocks: blocks, name: workspaceName });

    } catch (error) {

        if (error instanceof UserSignInError) {
            /**
             * TODO: Handle bad request
             */
        }

        if (error instanceof HttpResponseError) {
            /**
             * TODO:
             * handle bad response
             */
        }
    }

    document.getElementById("workspaceName").innerHTML = workspaceName;

    /**
     * TODO:
     * Let user know it saved succesfully.
     */
}

function getBlocks() {
    const workspace = Blockly.getMainWorkspace();
    const workspaceAsDom = Blockly.Xml.workspaceToDom(workspace, true);
    const blocks = Blockly.Xml.domToText(workspaceAsDom);
    return blocks;
}

function validWorkspaceName(workspaceName) {
    return workspaceName != "" &&
        workspaceName != null;
}

async function loadWorkspace() {
    const configs = {
        media: '../../media/',
        toolbox: document.getElementById('toolbox')
    };
    const currentWorkspace = Blockly.inject('blocklyDiv', configs);
    currentWorkspace.addChangeListener(displayCode);

    const workspaceName = localStorage.getItem('workspaceName');
    const editingWorkspace = workspaceName != 'null';

    if (editingWorkspace) {
        const blocks = await WorkspaceStorage.getBlocks(workspaceName);
        const blocksAsDom = Blockly.Xml.textToDom(blocks);
        Blockly.Xml.domToWorkspace(blocksAsDom, currentWorkspace);
        document.getElementById("workspaceName").innerHTML = workspaceName;
    }
}

function displayCode() {
    const currentWorkspace = Blockly.getMainWorkspace();
    const javascriptCode = Blockly.JavaScript.workspaceToCode(currentWorkspace);
    document.getElementById("jsCodeDiv").innerHTML = js_beautify(javascriptCode);
}