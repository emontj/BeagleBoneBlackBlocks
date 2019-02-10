async function testStoreWorkspace(){
    const name = 'test';
    const workspace = Blockly.getMainWorkspace();
    try {
        const workspaceIsSaved = await WorkspaceStorage.put(workspace);
        console.log(workspaceIsSaved);
    } catch (e) {
        console.error(e.message);
    }
}

testStoreWorkspace();