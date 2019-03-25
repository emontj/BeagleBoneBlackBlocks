'use strict';

const STORAGE_URL = '/storage';
const KEY_DATA_TYPE_NAME = 'key';
const XML_DATA_TYPE_NAME = 'xml';

const BlocklyStorage = {
    putInCloud: putInCloud,
    getFromCloud: getFromCloud
}

/**
 * Retrieves blocks from cloud storage.
 * @param {String} key unique id for blocks.
 * @returns {Promise<String>} blocks as string in xml format.
 * @throws {Error} bad http response.
 */
function getFromCloud(key) {
    return sendToCloudStoarge(KEY_DATA_TYPE_NAME, key);
}

/**
 * Stores blocks in cloud storage.
 * @param {object} blocks blocks to be stored.
 * @returns {Promise<String>} Unique id for blocks. Used to retrieve blocks.
 */
function putInCloud(blocks) {
    const hasOneBlockStack = blocks.getTopBlocks(false).length === 1
     && blocksAsXml.querySelector;

    if (hasOneBlockStack) {
        const block = xml.querySelector('block');
        if (block) {
            block.removeAttribute('x');
            block.removeAttribute('y');
        } 
    }
    const blocksAsDom = Blockly.Xml.workspaceToDom(blocks, true);
    const blocksAsString = Blockly.Xml.domToText(blocksAsDom);
    return sendToCloudStoarge(XML_DATA_TYPE_NAME, blocksAsString);
};

/**
 * Sends blocks to cloud storage.
 * @param {String} dataType type of data to be sent.
 * @param {String} data content to be sent.
 * @returns {Promise<String>} returns key or xml depending on the type of data
 * @throws {Error} bad response
 */
async function sendToCloudStoarge(dataType, data) {
    const requestSettings = getCloudRequestSettings(dataType, data);
    const response = await fetch(STORAGE_URL, requestSettings);
    if (response.ok) { return response.text(); }
   // throw new Error(response.statusText);
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

/**
 * Backup code blocks to localStorage.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
function putInLocalStorage(workspace) {
    if (localStorageIsSupported()) {
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