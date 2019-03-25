'use strict';

const STORAGE_URL = '/storage';
const KEY_DATA_TYPE_NAME = 'key';
const XML_DATA_TYPE_NAME = 'xml';

const BlocklyStorage = {
    put : put,
    get : get
}
/**
 * Backup code blocks to localStorage.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
function putInLocalStorage({workspaceName, workspace}) {
    if ( localStorageIsSupported() ) {
        const domWorkspace = Blockly.Xml.workspaceToDom(workspace);
        const xmlWorkspace = Blockly.Xml.domToText(domWorkspace);
        localStorage.setItem(workspace, xmlWorkspace);
    }
};

function localStorageIsSupported() {
    return 'localStorage' in window;
}

function getCurrentUrlNoHash() {
    return window.location.href.split('#')[0];
}

/**
 * Bind the localStorage backup function to the unload event.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
function backupOnUnload(opt_workspace) {
    const workspace = opt_workspace || Blockly.getMainWorkspace();
    window.addEventListener('unload', () => {
        BlocklyStorage.putInLocalStorage(workspace);
    }, false);
};

/**
 * Restore code blocks from localStorage.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
function getFromLocalStorage(workspaceName) {
    return localStorage.getItem(workspaceName) || null;
};

/**
 * Stores workspace contents in cloud storage. Returns unique id for workspace.
 * @param {object} workspace workspace to be stored in cloud
 * @returns {String} 6 charcter string. Unique id for workspace
 */
function put(workspace) {
    if (workspace === undefined || workspace === null) return null;
    const xmlWorkspace = getWorkspaceAsXml(workspace);
    return sendToCloudStoarge(XML_DATA_TYPE_NAME, xmlWorkspace);
};

function getWorkspaceAsXml(workspace) {
    let workspaceAsDom = Blockly.Xml.workspaceToDom(workspace, true);
    if (hasOneBlockStack(workspace, workspaceAsDom)) {
        removeCoordinates(workspaceAsDom);  // There's no reason to store this,
    }                                       // removing it helps with anonymity.
    return Blockly.Xml.domToText(workspaceAsDom);
}

function hasOneBlockStack(workspace, blocksAsXml) {
    return workspace.getTopBlocks(false).length === 1
        && blocksAsXml.querySelector;
}

function removeCoordinates(xml) {
    const block = xml.querySelector('block');
    if (block) {
        block.removeAttribute('x');
        block.removeAttribute('y');
    }
}

/**
 * Sends data to storage via http request
 * @param {String} dataType type of data to be sent
 * @param {String} data content
 * @returns {Promise<String>} returns key or xml depending on the type of data
 * return null if bad response is returned.
 */
async function sendToCloudStoarge(dataType, data) {
    const requestSettings = getCloudRequestSettings(dataType, data);
    const response = await fetch(STORAGE_URL, requestSettings);
    if (response.ok) { return response.text(); }
    console.log('Response error', response.statusText);
    return null;
}

function getCloudRequestSettings(dataType, data) {
    const formData = new FormData();
    formData.append(dataType, data);
    return {
        method: 'POST',
        body: formData,
        headers: new Headers({ 'Content-Type': 'application/x-www-form-urlencoded' })
    };
}

function get(key) {
    return sendToCloudStoarge(KEY_DATA_TYPE_NAME, key);
};

/**
 * Start monitoring the workspace.  If a change is made that changes the XML,
 * clear the key from the URL.  Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
function monitorChanges_(workspace) {
    var startXmlDom = Blockly.Xml.workspaceToDom(workspace);
    var startXmlText = Blockly.Xml.domToText(startXmlDom);
    function change() {
        var xmlDom = Blockly.Xml.workspaceToDom(workspace);
        var xmlText = Blockly.Xml.domToText(xmlDom);
        if (startXmlText != xmlText) {
            window.location.hash = '';
            workspace.removeChangeListener(bindData);
        }
    }
    var bindData = workspace.addChangeListener(change);
};

