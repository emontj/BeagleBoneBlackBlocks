const functions = require('firebase-functions');
const admin = require('firebase-admin');
const algoSearch = require('algoliasearch');
const config = require('./config.json');

const ALGOLIA_INDEX_NAME = config.algoIndexName;
const ALGO_APP_ID = config.algoAppId;
const ALGO_API_KEY = config.algoApiKey;

admin.initializeApp(functions.config().firebase);
const algoClient = algoSearch(ALGO_APP_ID, ALGO_API_KEY);

exports.storeWorkspaceInAlgo = functions
        .region('us-east1').firestore
        .document('workspaces/{workspaceId}')
        .onCreate((documentSnapshot, context) => {

            const workspaceData = {
                name : documentSnapshot.get('name'),
                objectID : context.params.workspaceId
            }

            const index = algoClient.initIndex(ALGOLIA_INDEX_NAME);
            return index.saveObject(workspaceData);
});