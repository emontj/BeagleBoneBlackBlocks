const WORKSPACES_COLLECTION_NAME = config.firestore.collectionNames.workspaces;
const BLOCKS_COLLECTION_NAME = config.firestore.collectionNames.blocks;
const ALGO_API_KEY = config.algo.apiKey;
const ALGO_APP_ID = config.algo.appId;
const ALGO_INDEX_NAME = config.algo.indexName;

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const algoClient = algoliasearch(ALGO_APP_ID, ALGO_API_KEY); // initialize client 
const algoWorkspacesIndex = algoClient.initIndex(ALGO_INDEX_NAME);

const WorkspaceStorage = {}; // namespace for workspace.js

/**
 * Returns workspace data that contains any of the keywords
 * 
 * @param {string[]} keywords - words used to search for workspaces
 * @returns {{name : string}[]} list of workspaces
 */
WorkspaceStorage.find = async keywords => {
    const searchResults = keywords.map(searchWorkspaceIndex);
    const workspaces = await Promise.all(searchResults);
    return workspaces.flat().map(algoObjectToIndex);
};

/**
 * Searches index for workspaces that use keyword
 * @param {string} keyword - word used to scan for workspaces
 * @returns {Promise<{name : string}[]>} workspaces  
 */
const searchWorkspaceIndex = async keyword => {

    return new Promise( (resolve, reject) => {

        algoWorkspacesIndex.search(keyword, (error, results) => {

            if (error) {
                reject(error);
            }
            else {
                resolve(results.hits);
            }
        });
    });
}

const algoObjectToIndex = algoObject => ( {name : algoObject.name} );

/**
 * Remove workspace record from database.
 * @param {String} workspaceName name of workspace
 * @returns {boolean} true if succeds. Throws otherwise
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
WorkspaceStorage.remove = async workspaceName => {
    const { email } = firebase.auth().currentUser;
    const documentId = `${email}-${workspaceName}`;

    await removeAlgoObjectFromIndex(documentId);
    
    const workspaceDocumentPath = `${WORKSPACES_COLLECTION_NAME}/${documentId}`;
    await firebase.firestore()
        .doc(workspaceDocumentPath)
        .delete();

    const blocksDocumentPath = `${BLOCKS_COLLECTION_NAME}/${documentId}`;
    await firebase.firestore()
        .doc(blocksDocumentPath)
        .delete();

    return true;
};

const removeAlgoObjectFromIndex = objectId => {
    return new Promise( (resolve, reject) => {
        algoClient.deleteObject(objectId, (error, content) => {

            if (error){
                reject(error);
            }
            else {
                resolve(content);
            }
        })
    });
}

/**
 * Stores workspace key in database.
 * @async
 * @param {Object} workspace - workspace data
 * @param {string} workspace.name - name of workspace
 * @param {string} workspace.blocks - blocks that make up the program
 * @returns {boolean} true if succeeded. Throws otherwise
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
WorkspaceStorage.put = async function ({ name, blocks }) {
    const { email } = firebase.auth().currentUser;
    const documentId = `${email}-${name}`;

    const workspaceDocumentpath = firebase.firestore()
        .collection(WORKSPACES_COLLECTION_NAME)
        .doc(documentId);

    await workspaceDocumentpath.set({ name, email });

    const blocksDocumentPath = firebase.firestore()
        .collection(BLOCKS_COLLECTION_NAME)
        .doc(documentId);

    await blocksDocumentPath.set({ blocks });

    return true;
};

/**
 * Retrieves key from database.
 * @param {String} name - name of workspace
 * @returns {{name : string, blocks : string}} workspace.
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
WorkspaceStorage.getBlocks = async name => {
    const { email } = firebase.auth().currentUser;
    const documentId = `${email}-${name}`;
    const documentPath = `${BLOCKS_COLLECTION_NAME}/${documentId}`;

    const documentSnapshot = await firebase.firestore()
        .doc(documentPath).get();

    return documentSnapshot.get('blocks');
};

/**
 * Checks if the workspace name already exist.
 * @param {String} name name of workspace
 * @returns {boolean} true if exist. False otherwise.
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
WorkspaceStorage.exists = async function (name) {
    const documentReference = createDocumentReference(name);
    const { exists } = await documentReference.get();
    return exists;
};

/**
 * Returns all keys and names of the users workspaces.
 * @returns {Promise<string[]>} all workspace names
 * objects that contain all of users workspaces data
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
WorkspaceStorage.getAllNames = async function () {
    const { email } = firebase.auth().currentUser;

    const collectionReference = firebase.firestore()
        .collection(WORKSPACES_COLLECTION_NAME);

    const { docs } = await collectionReference
        .where('email', '==', email)
        .get();

    return docs.map(doc => ({ name: doc.get('name') }));
};

function parseName(documentId) {
    const parts = documentId.split('-');
    return parts[0];
}

/**
 * converts firestore document to workspace object.
 * @param {Object} documentSnapshot - current record of firestore document
 * @returns {{name : string, blocks : string}} object containing workspace data
 */
function toWorkspace(documentSnapshot) {
    return {
        name: documentSnapshot.id,
        blocks: documentSnapshot.get('blocks')
    };
}