
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts

function ConfigureTeams(command) {

    //OpenTeamSettingsDialogAdvanced(command);
    //OpenTeamSettingsDialog(command);
    OpenConfiguratieDialoog(command);
}

function GetTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get document by id
        dataService.getDocument("MyCollection", "MyDocumentId").then(function (doc) {
            // Assuming document has a property named foo
            console.log("Doc foo: " + doc.foo);
        });
    });
}

function GetAllTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments("MyCollection").then(function (docs) {
            console.log("There are " + docs.length + " in the collection.");
        });
    });
}

function SetTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Prepare document first
        var newDoc = {
            fullScreen: false,
            screenWidth: 500
        };

        dataService.createDocument("MyCollection", newDoc).then(function (doc) {
            // Even if no ID was passed to createDocument, one will be generated
            console.log("Doc id: " + doc.id);
        });
    });
}

function ChangeTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Prepare document first
        var myDoc = {
            id: 1,
            fullScreen: false,
            screenWidth: 500
        };

        dataService.setDocument("MyCollection", myDoc).then(function (doc) {
            console.log("Doc id: " + doc.id);
        });
    });
}

function DeleteTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        var docId = "1234-4567-8910";
        // Delete document
        dataService.deleteDocument("MyCollection", docId).then(function () {
            console.log("Doc deleted");
        });
    });
}

VSS.notifyLoadSucceeded();
