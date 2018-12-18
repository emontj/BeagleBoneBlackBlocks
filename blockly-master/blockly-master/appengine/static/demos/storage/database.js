const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const WORKSPACES_COLLECTION = 'workspaces';
const workspaceName = 'testName';
const testEmail = 'brandoncole673@gmail.com';

firestore.settings({
    timestampsInSnapshots: true
});

var Firestore = {};

var usedWorkspaceNames = new Set();

Firestore.uploadLink = function(name, link) {
    let userEmail = firebase.auth().currentUser.email;
    let workspaceDocRef = firestore.collection(USER_COLLECTION)
        .doc(userEmail).collection(WORKSPACES_COLLECTION)
        .doc(name);
     return workspaceDocRef.set({link : link}).then( () => {
         usedWorkspaceNames.add(name);
     });
}

Firestore.nameIsTaken = async function nameIsTaken(workspaceName){
    if (usedWorkspaceNames.has(workspaceName)){
        console.log('Document name is in cache');
        return true;
    }
    let {exists} = await firestore.collection(USER_COLLECTION)
        .doc(testEmail).collection(WORKSPACES_COLLECTION)
        .doc(workspaceName).get();
    console.log('Document found in firebase', exists);
    if (exists){ usedWorkspaceNames.add(workspaceName); }
    return exists;
}

 Firestore.getAllWorkspaces = async function(){
    let {docs} = await firestore.collection(USER_COLLECTION)
        .doc(testEmail).collection(WORKSPACES_COLLECTION).get();

    return docs.map( doc => {
        let workspace = doc.data();
        return {
            id : doc.id,
            link : workspace.link
        }
    });
}

Firestore.getWorkspaceLink = async function(workspaceName){
    let workspaceDoc = await firestore.collection(USER_COLLECTION)
        .doc(testEmail).collection(WORKSPACES_COLLECTION)
        .doc(workspaceName).get();
    let {link} = workspaceDoc.data();
    return link;
}