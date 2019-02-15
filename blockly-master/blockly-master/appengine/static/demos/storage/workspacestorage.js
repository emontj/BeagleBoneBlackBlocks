const user = { email: 'brandoncole673@gmail.com' }
const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const WORKSPACE_COLLECTION = 'workspaces';
const WORKSPACE_NAMES_COLLECTION = 'names';

firestore.settings( { timestampsInSnapshots: true } );

var WorkspaceStorage = {} // create namespace

/**
 * 
 * @param {String} workspaceName name of workspace
 * @param {String} xmlWorkspace xml representation of workspace
 * @returns {Promise<void>} 
 */
WorkspaceStorage.put = function( { workspaceName, xmlWorkspace } ) {
    const workspaceRef = getWorkspaceRef(workspaceName);
    workspaceRef.set({ xmlWorkspace });
    const namesCollectionRef = getCollection(WORKSPACE_NAMES_COLLECTION);
    namesCollectionRef.add({ workspaceName });
}

WorkspaceStorage.get = async function(workspaceName) {
    const workspaceRef = getWorkspaceRef(workspaceName);
    const firestoreDoc = await workspaceRef.get();
    return firestoreDoc.get('xmlWorkspace');
}

/**
 * Returns all workspaces the user has saved.
 * @returns {Promise<Array<Workspace>>} array of workspaces
 */
WorkspaceStorage.getNames = async function() {
    const workspaceCollectionRef = getWorkspaceCollectionRef();
    const { docs } = await workspaceCollectionRef.get();
    return docs.map(docToWorkspaceName);
}

function docToWorkspaceName(firestoreDoc) {
    return firestoreDoc.id;
}

/**
 * Returns whether or not a workspace exist in the database.
 * @param {String} workspaceName name of the workpace to be checked for
 * @returns {Promise<Boolean>} true if exist. false if not.
 */
WorkspaceStorage.doesExist = async function(workspaceName) {
    const workspaceRef = getWorkspaceRef(workspaceName);
    const { exists } = await workspaceRef.get();
    return exists;
}

WorkspaceStorage.remove = function(workspaceName) {
    const workspaceRef = getWorkspaceRef(workspaceName);
    workspaceRef.delete();
}

function getWorkspaceRef(workspaceName) {
    const workspacePath = getWorkspacePath(workspaceName);
    return firestore.doc(workspacePath);
}

/**
 * Returns the path of the workspace in database
 * @param {String} workspaceName name of workspace
 * @returns {String} path of workspace in database
 */
function getWorkspacePath(workspaceName) {
    return `${USER_COLLECTION}/${user.email}/${WORKSPACE_COLLECTION}/${workspaceName}`;
}

/**
 * Returns a reference to the location of a collection in the database
 * @returns {firebase.firestore.DocumentReference} object that refers to location of collection
 */
function getCollection(collectionName) {
    const collectionPath = getCollectionPath(collectionName);
    return firestore.collection(collectionPath);
}

function getCollectionPath() {
    return `${USER_COLLECTION}/${user.email}/${collectionName}`;
}