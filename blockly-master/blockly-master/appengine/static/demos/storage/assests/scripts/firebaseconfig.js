const config = {
   algo: {
     appId: "A0CZO7F0WN",
     apiKey: "cc4a55bb4e5c9100112436b0a181d8a0",
     indexName: "workspaces"
   },
  firebase: {
    apiKey: "AIzaSyBoB4oEzfalKFJQXKrTgFmucWeZU7yXg70",
    authDomain: "iotblocks-221600.firebaseapp.com",
    databaseURL: "https://iotblocks-221600.firebaseio.com",
    projectId: "iotblocks-221600",
    storageBucket: "iotblocks-221600.appspot.com",
    messagingSenderId: "354851545946"
  },
  loginUi: {
    'signInSuccessUrl': 'workspaces.html',
    'signInOptions': [
      firebase.auth.GoogleAuthProvider.PROVIDER_ID,
      firebase.auth.FacebookAuthProvider.PROVIDER_ID,
      firebase.auth.TwitterAuthProvider.PROVIDER_ID,
      firebase.auth.GithubAuthProvider.PROVIDER_ID,
      firebase.auth.EmailAuthProvider.PROVIDER_ID,
      firebase.auth.PhoneAuthProvider.PROVIDER_ID
    ]
  },
  beagleBone: {
    serverUrl: 1234
  },
  firestore: {
    collectionNames: {
      blocks: "blocks",
      workspaces: "workspaces"
    }
  }
};

function initializeFirebase() {
  if (!firebase.apps.length) {
    firebase.initializeApp(config.firebase);
  }
}

initializeFirebase();