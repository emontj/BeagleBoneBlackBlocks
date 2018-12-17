
function getUser(){
  return firebase.auth().currentUser;
}

function signOut(){
  firebase.auth().signOut();
}

function isUserSignedIn(){
  return currUser != null;
}