import { config, initializeFirestore } from "./firebaseconfig.js";

const WORKSPACES_COLLECTION_NAME = config.firestore.collectionNames.workspaces;

const BLOCKS_COLLECTION_NAME = config.firestore.collectionNames.blocks;

//const mongo = initMongo();

initializeFirestore();

async function initMongo() {
    const client = stitch.Stitch.initializeDefaultAppClient('beagleboneblocks-trrvw');

    const db = client.getServiceClient(stitch.RemoteMongoClient.factory, 'BeagleBoneBlocks').db('workspaceData');

    await client.auth.loginWithCredential(new stitch.AnonymousCredential());

    return db;
}

    /**
     * 
     * @param {string} workspaceName name of workspace to search
     * @returns { string[] } names of workspaces found
     */
    async function findByName(workspaceName) {

        const workspacesReference = firebase.firestore()
            .collection(WORKSPACES_COLLECTION_NAME);

        const { docs } = await workspacesReference
            .where('name', '==', workspaceName).get();

        return docs.map(doc => doc.get('name'));
    }

    /**
     * 
     * @param {string[]} keywords - words used to search against a workspace description.
     * @returns 
     */
    async function findByDescription(keywords) {
        const workspaceRef = firestore.collection(WORKSPACES_COLLECTION_NAME);

        let docs = await Promise.all(keywords.map(async keyword => {
            return await workspaceRef.where('description',
                'array-contains', keyword).get();
        }));

        docs = docs.flat();

        return docs.map(doc => doc.get('name'));
    }


    /**
     * Remove workspace record from database.
     * @param {String} workspaceName name of workspace
     * @returns {boolean} true if succeds. Throws otherwise
     * @throws {FirebaseError} error if one occured in database.
     * @throws {UserSignInError} if user not signed in
     */
    async function remove(workspaceName) {
        const userEmail = firestore.auth().currentUser.email;
        const documentId = `${userEmail}-${workspaceName}`;

        let docPath = `${WORKSPACES_COLLECTION_NAME}/${documentId}`;
        await firebase.firestore().doc(docPath).delete();

        docPath = `${BLOCKS_COLLECTION_NAME}/${documentId}`;
        await firebase.firestore().doc(docPath).delete();

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
    async function put({ name, blocks }) {

        const userEmail = firebase.auth().currentUser.email;

        const documentId = `${userEmail}-${name}`;

        await mongo.insertOne({ name: name, email: userEmail });

        await firebase.firestore()
            .collection(BLOCKS_COLLECTION_NAME)
            .doc(documentId)
            .set({ blocks: blocks });

        return true;
    };

    /**
     * Retrieves key from database.
     * @param {String} name - name of workspace
     * @returns {{name : string, blocks : string}} workspace.
     * @throws {FirebaseError} error if one occured in database.
     * @throws {UserSignInError} if user not signed in
     */
    async function getBlocks(name) {
        const userEmail = firebase.auth().currentUser.email;
        const documentId = `${userEmail}-${name}`;
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
        const userEmail = firebase.auth().currentUser.email;

        const workspacesReference = firebase.firestore()
            .collection(WORKSPACES_COLLECTION_NAME);

        const { docs } = await workspacesReference
            .where('email', '==', userEmail)
            .get();

        return docs.map(doc => doc.data());
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

    export { put, getBlocks };
