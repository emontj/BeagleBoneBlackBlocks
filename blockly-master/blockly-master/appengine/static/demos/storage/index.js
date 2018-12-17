

function displayWorkspaces(workspaces){
    let workplaceDiv = document.getElementById("workspaces");
    workspaces.forEach( workspace => {
        workplaceDiv.insertAdjacentHTML('beforeend', `<a href=${workspace.link}>${workspace.id}</a>\n`)
    });
}

async function saveWorkspace() {
    let workspaceName = document.getElementById('name').value;
    if (workspaceName === null || workspaceName === undefined || workspaceName === ''){
        alert('NAME IS EMPTY');
        return;
    }
    let isTaken = await Firestore.nameIsTaken(workspaceName);
    if (isTaken){
        alert('NAME IS TAKE!');
        return;
    }
    BlocklyStorage.storeWorkspace()
        .then(link => {
            return Firestore.uploadLink(workspaceName, link);
        })
        .catch(err => {
            console.log(err);
        });
}