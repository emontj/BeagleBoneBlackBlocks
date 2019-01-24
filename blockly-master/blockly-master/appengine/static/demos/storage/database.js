const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const WORKSPACES_COLLECTION = 'workspaces';
const NAMES_COLLECTION = 'names';
const workspaceName = 'testName';
const testEmail = 'brandoncole673@gmail.com';

firestore.settings({
    timestampsInSnapshots: true
});

let WorkspaceStorage = {};

function getWorkspaceDocReference(name) {
    const documentPath = `${USER_COLLECTION}/${user.email}/${WORKSPACES_COLLECTION}/${name}`;
    return firestore.doc(documentPath);
}

function getNamesCollectionReference() {
    const collectionPath = `${USER_COLLECTION}/${user.email}/${NAMES_COLLECTION}`;
    return firestore.collection(collectionPath);
}

WorkspaceStorage.put = function(name, workspace) {
    const documentReference = getWorkspaceDocReference(name);
    documentReference.set( { workspace : workspace} );
    const collectionReference = getNamesCollectionReference();
    return collectionReference.add( { name : name } );
};

WorkspaceStorage.nameIsUsed = async function(name){
   const documentReference = getWorkspaceDocReference(name);
   const { exists } = await documentReference.get();
   return exists;
};

WorkspaceStorage.getNames = async function() {
    const collectionRef = getNamesCollectionReference();
    const { docs } = await collectionRef.get();
    return docs.map( doc => doc.id);
};

