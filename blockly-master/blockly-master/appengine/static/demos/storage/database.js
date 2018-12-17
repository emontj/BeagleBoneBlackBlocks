const firestore = firebase.firestore();
const USER_COLLECTION = 'users';
const WORKSPACES_COLLECTION = 'workspaces';
const workspaceName = 'testName';
const testEmail = 'brandoncole673@gmail.com';

firestore.settings({
    timestampsInSnapshots: true
});

var Firestore = {};

Firestore.uploadLink = function(workspaceLink) {
    let userEmail = firebase.auth().currentUser.email;

    let workspaceDocRef = firestore.collection(USER_COLLECTION)
        .doc(userEmail).collection(WORKSPACES_COLLECTION)
        .doc(workspaceName);

     return workspaceDocRef.set({
        link : workspaceLink
    });
}

Firestore.nameIsTaken = async function nameIsTaken(workspaceName){
    let {exists} = firestore.collection(USER_COLLECTION)
        .doc(testEmail).collection(WORKSPACES_COLLECTION)
        .doc(workspaceName).get();
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