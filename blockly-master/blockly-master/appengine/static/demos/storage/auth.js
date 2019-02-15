export let user = 'brandoncole673@gmail.com';

firebase.auth().onAuthStateChanged(currUser => {
    user = currUser;
});