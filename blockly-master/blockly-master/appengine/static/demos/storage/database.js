/**
 * Home for all functions and variables
 * that handle interactions with firebase
 * firestore.
 */

var firestore = firebase.firestore(); // for firestore database access

const NEW_ENTRY_ADD_SUCCESS_MESSAGE = 'New entry added sucessfully'; 
const USER_COLLECTION = 'users'; // collection for users in firestore
const USER_NOT_SIGNED_IN_MESSAGE = 'Sign in before saving, please.';



function addUser(email){
    firestore.collection(USER_COLLECTION).doc(email).set({
        links : []
    })
    .then(function(){
        alert('New user added');
    })
    .catch(function(error){
        console.log(error);
    });
}
/**
 * 
 * @param {*} userId 
 * @param {*} blocksLink 
 */
function createNewUser(){
  /*var user = getCurrentUser();
  if (user == null){
      return;
  }*/
  var email = 'brandoncole673@gmail.com'
  var docRef = firestore.collection(USER_COLLECTION).doc(email);
  docRef.get().then(function(doc){
      if (doc.exists == false){
          addUser(email);
      }
  })
  .catch(function(error){
      console.log(error);
  });
}

/**
 * 
 */
function storeLink(link){
    var user = getCurrentUser();
  //  if (user == null){
       // alert(USER_NOT_SIGNED_IN_MESSAGE);
       // return;
 //   }
    
    var userDoc = firestore.collection(USER_COLLECTION).doc('brandoncole673@gmail.com');
    userDoc.update({
        links: firebase.firestore.FieldValue.arrayUnion(link)
    })
    .then(function(){
        alert("Updated");
    })
    .catch(function(error){
        alert(error);
    });
}

function displayLinks(links){
    // TODO: display the links on webpage
}

function getLinks(){
    var user = getCurrentUser();
    var docRef = firestore.collection(USER_COLLECTION).doc(user.email);
    docRef.get().then(function(doc){
        if (doc.exists){
            var docData = doc.data();
            displayLinks(docData.links);
        }
        else{
            console.log('doc does not exist');
        }
    });
}
