const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const KEY_COLLECTION = 'keys';



firestore.settings( { timestampsInSnapshots: true } );
const KeyStorage = {};

function getKeyReference(workpsaceName) {
    const userEmail = firebase.auth().currentUser.email;
    const keyPath = `${USER_COLLECTION}/${userEmail}/${KEY_COLLECTION}/${workpsaceName}`;
    return firestore.doc(keyPath);
}

function getKeyCollectionReference() {
    const userEmail = firebase.auth().currentUser.email;
    const keysCollectionPath = `${USER_COLLECTION}/${userEmail}/${KEY_COLLECTION}`;
    return firestore.collection(keysCollectionPath);

}

KeyStorage.put = async function(workspaceName, workspaceKey) {
    if (!(workspaceName && workspaceKey)) {
        return false;
    }

    const keyReference = getKeyReference(workspaceName);
    await keyReference.set( { key: workspaceKey } );
    return true;
};

KeyStorage.get = async function(workspaceName) {
    if (workspaceName == null) {
        return null;
    }
    const documentReference = getKeyReference(workspaceName);
    const { doc } = await documentReference.get();
    return doc.get('key') || null;
};

KeyStorage.nameIsUsed = async function(name) {
    if (name == null){
        return null;
    }
    const documentReference = getKeyReference(name);
    const { exists } = await documentReference.get();
    return exists;
};

 KeyStorage.getWorkspaceData = async function(){
     const collectionReference = getKeyCollectionReference();
     const { docs } = await collectionReference.get();
     return docs.map(docToWorkspaceData);
};

 function docToWorkspaceData(doc) {
     return {
         'name' : doc.id,
         'key' : doc.get('key')
     };
 }