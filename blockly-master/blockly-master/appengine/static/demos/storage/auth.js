
function getCurrentUser(){
  return firebase.auth().currentUser;
}

function signOutCurrUser(){
  firebase.auth().signOut();
}

function isUserSignedIn(){
  return currUser != null;
}