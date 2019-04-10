import {config, initializeFirebase} from "./firebaseconfig.js";
import * as WorkspaceStorage from "./workspacestorage.js";
import { HttpResponseError, UserSignInError } from "./errors.js";

document.addEventListener("DOMContentLoaded", init);

async function init() {
    initializeFirebase();

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
    const requestParams = {
        method : 'POST',
        body : Blockly.JavaScript.workspaceToCode(workspace)
    }
    const response = await fetch(beagleBoneConfig.serverUrl, requestParams);

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
        await WorkspaceStorage.put({ blocks: blocks , name: workspaceName });

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

    const workspaceName = localStorage.getItem('workspaceName');
    const editingWorkspace = workspaceName != 'null';

    if (editingWorkspace) {
        const blocks = await WorkspaceStorage.getBlocks(workspaceName);
        const blocksAsDom = Blockly.Xml.textToDom(blocks);
        Blockly.Xml.domToWorkspace(blocksAsDom, currentWorkspace);
        document.getElementById("workspaceName").innerHTML = workspaceName;
    }
}