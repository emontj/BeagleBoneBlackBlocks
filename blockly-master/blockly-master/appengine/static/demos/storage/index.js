

function displayWorkspaces(workspaces){
    let workplaceDiv = document.getElementById("workspaces");
    workspaces.forEach( workspace => {
        workplaceDiv.insertAdjacentHTML('beforeend', `<a href=${workspace.link}>${workspace.id}</a>\n`)
    });
}

function saveWorkspace() {
    BlocklyStorage.storeWorkspace()
        .then(Firestore.uploadLink)
        .catch(err => {
            console.log(err);
        });
}