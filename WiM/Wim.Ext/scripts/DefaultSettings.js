var TeamSettingsCollectionName = "WimCollection";

//DeleteAll();
DeleteCurrentTeams();
//CreateTeams();




//function DeleteAll() {

//    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

//        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

//            docs.forEach(
//                function (element) {
//                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function () {
//                        console.log("deleted");
//                    });
//                });

//            console.log("DeleteAll() triggered.");
//        });
//        VSS.notifyLoadSucceeded();
//    });
//}

function DeleteCurrentTeams() {
    console.log("DeleteCurrentTeams()");
    DeleteAllSettings();
}

function DeleteAllSettings() {

    console.log("DeleteAllettings()");

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There are " + docs.length + " in the collection.");
            docs.forEach(
                function (element) {
                    DeleteTeamSettings(dataService, element.id, element.text);
                }
            );
            VSS.notifyLoadSucceeded();
        });

        VSS.notifyLoadSucceeded();
    });
}

function DeleteTeamSettings(dservice, docId, docText) {

    console.log("DeleteTeamSettings() " + docId + " " + docText);

    if (dservice !== null) {
        dservice.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
            console.log("Doc verwijderd");
            VSS.notifyLoadSucceeded();
        });
    }

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
            console.log("Doc verwijderddd");
            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });
}

function CreateTeams() {
    console.log("CreateTeams() executing");
    SetTeamSettingsNew("Xtreme");
    SetTeamSettingsNew("Committers");
    SetTeamSettingsNew("Test");
    SetTeamSettingsNew("NieuweTest");
    console.log("CreateTeamsNew() executed.");
}

function SetTeamSettingsNew(teamName) {

    console.log("SetTeamSettingsNew(): " + teamName);

    VSS.getService(VSS.ServiceIds.ExtensionData).then(
        function (dataservice) {

            var newDoc = {
                type: "team",
                text: teamName
            };

            dataservice.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
            });

            VSS.notifyLoadSucceeded();
        });
}
