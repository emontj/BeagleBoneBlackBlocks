const WORKSPACES_COLLECTION_NAME = config.firestore.collectionNames.workspaces;
const BLOCKS_COLLECTION_NAME = config.firestore.collectionNames.blocks;

const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

const WorkspaceStorage = {}; // namespace for workspace.js

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