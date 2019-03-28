const firestore = firebase.firestore();

 /** @constant {string} name of collection where user data is stored */
const USERS_COLLECTION = firestoreConfig.usersCollection;

console.log(`USER_COLLECTION: ${USERS_COLLECTION}`);
/** @constant {string} name of collection that stores workspaces*/
const WORKSPACES_COLLECTIONS = firestoreConfig.workspacesCollection;

firestore.settings({ timestampsInSnapshots: true });

/**
 * Contains functions for manipulating storage
 * @type {Object}
 * @property {function}
 */
const WorkspaceStorage = {
    put: put,
    get: get,
    exist: exists,
    getAll: getAll,
    remove: remove
};

/**
 * creates a DocumentReference to a document
 * @param {String} workpsaceName name of workspace
 * @returns {firebase.firestore.DocumentReference} reference to a document
 * that can be used to read write or listen to the location
 */
function createDocumentReference(workpsaceName) {
    const userEmail =  firebase.auth().currentUser.email;;
    if (userEmail) {
        const documentPath = `${USERS_COLLECTION}/${userEmail}/${WORKSPACES_COLLECTIONS}/${workpsaceName}`;
        return firestore.doc(documentPath);
    }
    throw new UserSignInError('user is not signed in');
}

/**
 * creates a reference to a collection
 * @returns {firebase.firestore.CollectionReference}
 */
function createCollectionReference() {
    const userEmail = firebase.auth().currentUser.email;
    if (userEmail) {
        const collectionPath = `${USERS_COLLECTION}/${userEmail}/${WORKSPACES_COLLECTIONS}`;
        return firestore.collection(collectionPath);
    }
    throw new UserSignInError('user is not signed in');
}

/**
 * Remove workspace record from database.
 * @param {String} workspaceName name of workspace
 * @returns {boolean} true if succeds. Throws otherwise
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
async function remove(workspaceName) {
    const documentReference = createDocumentReference(workspaceName);
    await documentReference.delete();
    return true;
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
async function put({name, blocks}) {
    const documentReference = createDocumentReference(name);
    await documentReference.set({blocks : blocks});
    return true;
};

/**
 * Retrieves key from database.
 * @param {String} name - name of workspace
 * @returns {{name : string, blocks : string}} workspace.
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
async function get(name) {
    const documentReference = createDocumentReference(name);
    const documentSnapshot = await documentReference.get();
    const workspace = documentSnapshot.data();
    return workspace;
};

/**
 * Checks if the workspace name already exist.
 * @param {String} name name of workspace
 * @returns {boolean} true if exist. False otherwise.
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
async function exists(name) {
    const documentReference = createDocumentReference(name);
    const { exists } = await documentReference.get();
    return exists;
};

/**
 * Returns all keys and names of the users workspaces.
 * @returns {Promise<{name : string, blocks : string}[]>} all workspace names
 * objects that contain all of users workspaces data
 * @throws {FirebaseError} error if one occured in database.
 * @throws {UserSignInError} if user not signed in
 */
async function getAll() {
    const collectionReference = createCollectionReference();
    const { docs } = await collectionReference.get();
    const workspaces = docs.map(toWorkspace);
    return workspaces;
};

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
