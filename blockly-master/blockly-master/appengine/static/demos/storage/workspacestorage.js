/**
 * @license
 * Visual Blocks Editor
 *
 * Copyright 2012 Google Inc.
 * https://developers.google.com/blockly/
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @fileoverview Loading and saving blocks with localStorage and cloud storage.
 * @author q.neutron@gmail.com (Quynh Neutron)
 */
'use strict';

// Create a namespace.
var WorkspaceStorage = {};

const STORAGE_URL = '/storage';

/**
 * Backup code blocks to localStorage.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
WorkspaceStorage.backupBlocks_ = function(workspace) {
    if ('localStorage' in window) {
        var xml = Blockly.Xml.workspaceToDom(workspace);
        // Gets the current URL, not including the hash.
        var url = window.location.href.split('#')[0];
        window.localStorage.setItem(url, Blockly.Xml.domToText(xml));
    }
};

/**
 * Bind the localStorage backup function to the unload event.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
WorkspaceStorage.backupOnUnload = function(opt_workspace) {
    var workspace = opt_workspace || Blockly.getMainWorkspace();
    window.addEventListener('unload',
        function() {WorkspaceStorage.backupBlocks_(workspace);}, false);
};



/**
 * Restore code blocks from localStorage.
 * @param {Blockly.WorkspaceSvg=} opt_workspace Workspace.
 */
WorkspaceStorage.restoreBlocks = function(opt_workspace) {
    const url = window.location.href.split('#')[0];
    if ('localStorage' in window && window.localStorage[url]) {
        const workspace = opt_workspace || Blockly.getMainWorkspace();
        const xml = Blockly.Xml.textToDom(window.localStorage[url]);
        Blockly.Xml.domToWorkspace(xml, workspace);
    }
};

/**
 * Stores blocks in cloud storage
 * @param workspace blocks
 * @returns {Promise<Boolean>} returns true if successful. False if not.
 */
WorkspaceStorage.put = async function(workspace) {
    if ( workspace == null ) {
        return false;
    }
    const workspaceAsDom = Blockly.Xml.workspaceToDom(workspace, true);
    
    const hasOneBlockStack = workspace.getTopBlocks(false).length === 1
        && workspaceAsDom.querySelector;

    if (hasOneBlockStack) {
        // Remove x/y coordinates from XML if there's only one block stack.
        // There's no reason to store this, removing it helps with anonymity.
        const block = workspaceAsDom.querySelector('block');
        if (block) {
            block.removeAttribute('x');
            block.removeAttribute('y');
        }
    }
    const workspaceAsString = Blockly.Xml.domToText(workspaceAsDom);
    const workspaceKey = await sendToCloudStorage('xml', workspaceAsString);
    return workspaceKey;
};


async function sendToCloudStorage(dataType, data){
    if ( dataType == null || data == null ) {
        return null;
    }

    const formData = new FormData();
    data = encodeURIComponent(data);
    formData.append(dataType, data);

    const configuration = {
        method : 'POST',
        body : formData,
        headers : new Headers( {'Content-Type' : 'application/x-www-form-urlencoded'} )
    };

    const response = await fetch(STORAGE_URL, configuration);
    if (response.ok){
        return await response.text();
    }
    throw new Error(response.statusText);
}


WorkspaceStorage.get = async function(key) {
    const workspaceAsString = await sendToCloudStorage('key', key);
    return workspaceAsString;
};

/**
 * Global reference to current AJAX request.
 * @type {XMLHttpRequest}
 * @private
 */
WorkspaceStorage.httpRequest_ = null;

/**
 * Fire a new AJAX request.
 * @param {string} url URL to fetch.
 * @param {string} name Name of parameter.
 * @param {string} content Content of parameter.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
WorkspaceStorage.makeRequest_ = function(url, name, content, workspace) {
    if (WorkspaceStorage.httpRequest_) {
        // AJAX call is in-flight.
        WorkspaceStorage.httpRequest_.abort();
    }
    WorkspaceStorage.httpRequest_ = new XMLHttpRequest();
    WorkspaceStorage.httpRequest_.name = name;
    WorkspaceStorage.httpRequest_.onreadystatechange =
        WorkspaceStorage.handleRequest_;
    WorkspaceStorage.httpRequest_.open('POST', url);
    WorkspaceStorage.httpRequest_.setRequestHeader('Content-Type',
        'application/x-www-form-urlencoded');
    WorkspaceStorage.httpRequest_.send(name + '=' + encodeURIComponent(content));
    WorkspaceStorage.httpRequest_.workspace = workspace;
};

/**
 * Callback function for AJAX call.
 * @private
 */
WorkspaceStorage.handleRequest_ = function() {
    if (WorkspaceStorage.httpRequest_.readyState == 4) {
        if (WorkspaceStorage.httpRequest_.status != 200) {
            WorkspaceStorage.alert(WorkspaceStorage.HTTPREQUEST_ERROR + '\n' +
                'httpRequest_.status: ' + WorkspaceStorage.httpRequest_.status);
        } else {
            var data = WorkspaceStorage.httpRequest_.responseText.trim();
            if (WorkspaceStorage.httpRequest_.name == 'xml') {
                window.location.hash = data;
                WorkspaceStorage.alert(WorkspaceStorage.LINK_ALERT.replace('%1',
                    window.location.href));
                storeLink(window.location.href);
            } else if (WorkspaceStorage.httpRequest_.name == 'key') {
                if (!data.length) {
                    WorkspaceStorage.alert(WorkspaceStorage.HASH_ERROR.replace('%1',
                        window.location.hash));
                } else {
                    WorkspaceStorage.loadXml_(data, WorkspaceStorage.httpRequest_.workspace);
                }
            }
            WorkspaceStorage.monitorChanges_(WorkspaceStorage.httpRequest_.workspace);
        }
        WorkspaceStorage.httpRequest_ = null;
    }
};

/**
 * Start monitoring the workspace.  If a change is made that changes the XML,
 * clear the key from the URL.  Stop monitoring the workspace once such a
 * change is detected.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
WorkspaceStorage.monitorChanges_ = function(workspace) {
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

/**
 * Load blocks from XML.
 * @param {string} xml Text representation of XML.
 * @param {!Blockly.WorkspaceSvg} workspace Workspace.
 * @private
 */
WorkspaceStorage.loadXml_ = function(xml, workspace) {
    try {
        xml = Blockly.Xml.textToDom(xml);
    } catch (e) {
        WorkspaceStorage.alert(WorkspaceStorage.XML_ERROR + '\nXML: ' + xml);
        return;
    }
    // Clear the workspace to avoid merge.
    workspace.clear();
    Blockly.Xml.domToWorkspace(xml, workspace);
};

/**
 * Present a text message to the user.
 * Designed to be overridden if an app has custom dialogs, or a butter bar.
 * @param {string} message Text to alert.
 */
WorkspaceStorage.alert = function(message) {
    window.alert(message);
};
