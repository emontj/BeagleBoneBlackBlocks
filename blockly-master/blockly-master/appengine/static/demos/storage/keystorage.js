const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const KEY_COLLECTION = 'keys';

firestore.settings( { timestampsInSnapshots: true } );
const KeyStorage = {};

function getKeyReference(workpsaceName) {
    const {email} = firebase.auth().user;
    const keyPath = `${USER_COLLECTION}/${email}/${KEY_COLLECTION}/${workpsaceName}`;
    return firestore.doc(keyPath);
}

function getKeyCollectionReference() {
    const keysCollectionPath = `${USER_COLLECTION}/${email}/${KEY_COLLECTION}`;
    return firestore.collection(keysCollectionPath);

}

KeyStorage.put = async function(name, key) {
    if (name == null || key == null) {
        return false;
    }

    const keyReference = getKeyReference(name);
    await keyReference.set( { key } );
    return true;
};

KeyStorage.get = async function(name) {
    if (name == null){
        return null;
    }
    const documentReference = getKeyReference(name);
    const { doc } = await documentReference.get();
    return doc.get('key');
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
     const collectionReference = getKeyCollectionReference(name);
     const { docs } = await collectionReference.get();
     return docs.map(docToWorkspaceData);
};

 function docToWorkspaceData(doc) {
     return {
         'name' : doc.id,
         'key' : doc.get('key')
     };
 }