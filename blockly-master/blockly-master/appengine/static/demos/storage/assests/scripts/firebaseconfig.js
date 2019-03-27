const firebaseConfig = {
    apiKey: "AIzaSyBoB4oEzfalKFJQXKrTgFmucWeZU7yXg70",
    authDomain: "iotblocks-221600.firebaseapp.com",
    databaseURL: "https://iotblocks-221600.firebaseio.com",
    projectId: "iotblocks-221600",
    storageBucket: "iotblocks-221600.appspot.com",
    messagingSenderId: "354851545946"
  };


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}

const loginUiConfig = {
    'signInSuccessUrl': 'workspaces.html',
    'signInOptions': [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ]
};

const beagleBoneConfig = {
  serverUrl : 12345
}

const firestoreConfig = {
  usersCollection : 'users',
  workspacesCollection : 'workspaces'
}