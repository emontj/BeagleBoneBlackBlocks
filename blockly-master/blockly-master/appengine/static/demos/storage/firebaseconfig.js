/**
 * Initializes firebase to allow use
 * throughout all webpages.
 */

var config = { // initialize firebase
    apiKey: "AIzaSyBoB4oEzfalKFJQXKrTgFmucWeZU7yXg70",
    authDomain: "iotblocks-221600.firebaseapp.com",
    databaseURL: "https://iotblocks-221600.firebaseio.com",
    projectId: "iotblocks-221600",
    storageBucket: "iotblocks-221600.appspot.com",
    messagingSenderId: "354851545946"
  };

  firebase.initializeApp(config);