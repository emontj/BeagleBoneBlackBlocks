const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const KEY_COLLECTION = 'keys';

firestore.settings( { timestampsInSnapshots: true } );

const KeyStorage = {
    put : put,
    getKey : getKey,
    workspaceExist : workspaceNameExist,
    getAll : getAll,
    remove : remove
};

/**
 * creates a DocumentReference to a document
 * @param {String} workpsaceName name of workspace
 * @returns {firebase.firestore.DocumentReference} reference to a document
 * that can be used to read write or listen to the location
 */
function createDocumentReference(workpsaceName) {
    const userEmail = firebase.auth().currentUser.email;
    const keyPath = `${USER_COLLECTION}/${userEmail}/${KEY_COLLECTION}/${workpsaceName}`;
    return firestore.doc(keyPath);
}

/**
 * creates a reference to a collection
 * @returns {firebase.firestore.CollectionReference}
 */
function createCollectionReference() {
    const userEmail = firebase.auth().currentUser.email;
    const keysCollectionPath = `${USER_COLLECTION}/${userEmail}/${KEY_COLLECTION}`;
    return firestore.collection(keysCollectionPath);
}

/**
 * Remove workspace record from database.
 * @param {String} workpsaceName name of workspace
 * @returns {boolean} true if succeds
 * @throws {FirebaseError} error if one occured in database.
 */
async function remove(workpsaceName){
    const documentReference = createDocumentReference(workpsaceName);
    await documentReference.delete();
    return true;
}

/**
 * Stores workspace key in database.
 * @param {String} workspaceName name of workspace
 * @param {String} workspaceKey unique id for workspace
 * @returns {boolean} true if succeeded. False otherwise.
 */
async function put(workspaceName, workspaceKey) {
    const documentReference = createDocumentReference(workspaceName);
    await documentReference.set( { key : workspaceKey } );
    return true;
};

/**
 * Retrieves key from database.
 * @param {String} workspaceName name of workspace
 * @returns {String} unique id for the workspace.
 */
async function getKey(workspaceName) {
    const documentReference = createDocumentReference(workspaceName);
    const documentSnapshot = await documentReference.get();
    return documentSnapshot.get('key');
};

/**
 * Checks if the workspace name already exist.
 * @param {String} name name of workspace
 * @returns {boolean} true if exist. False otherwise.
 */
async function workspaceNameExist(name) {
    const documentReference = createDocumentReference(name);
    const { exists } = await documentReference.get();
    return exists;
};

/**
 * Returns all keys and names of the users workspaces.
 * @returns {Promise< { key : String, name : String } []> }
 * objects that contain all of users workspaces data
 */
async function getAll(){
     const collectionReference = createCollectionReference();
     const { docs } = await collectionReference.get();
     return docs.map(docToWorkspaceData);
};

function docToWorkspaceData(doc) {
     return {
         'name' : doc.id,
         'key' : doc.get('key')
     };
 }