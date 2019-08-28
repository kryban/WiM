
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts

//see all settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents

var TeamSettingsCollectionName = "WimCollection";

function ConfigureTeams(command) {

    //OpenTeamSettingsDialogAdvanced(command);
    //OpenTeamSettingsDialog(command);
    OpenTeamsConfiguratieDialoog(command);
}
var teamsForm = ["yo","yi"]; 
var extenralSetted;

function OpenTeamsConfiguratieDialoog(title) {

    VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {

        var extensionCtx = VSS.getExtensionContext();

        // Build absolute contribution ID for dialogContent
        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".manage-teams";

        // Show dialog
        var dialogOptions = {
            title: "Add new team: "
            //width: 300
            , height: 500
            //, okText: "OK"
            , cancelText: "Annuleer" 
            , getDialogResult: function () {
                // Get the result from registrationForm object
                //console.log("getDialogResult(): " + teamsForm);
              }
            , okCallback: function (result) {
                // Log the result to the console
                //console.log("okCallback(): ");//JSON.stringify(result));

                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    // Reload whole page
                    console.log("navigationService.reload()");
                    navigationService.reload();
                });
            }
        };

        dialogService.openDialog(contributionId, dialogOptions).then(
            function (dialog) {

                dialog
                    .getContributionInstance("Bandik.WimDevOpExtension.manage-teams")
                    .then(function(manageTeamsinstance) {
                        teamsForm = manageTeamsinstance;
                    }
                );

                dialog.updateOkButton(true);
            }
        );
    });
}

function DeleteCurrentTeams() {
    console.log("DeleteCurrentTeams()");
    DeleteAllTeamSettings();
}

function CreateTeams() {
    console.log("CreateTeams() executing");
    SetTeamSettingsNew("Xtreme");
    SetTeamSettingsNew("Committers");
    SetTeamSettingsNew("Test");
    SetTeamSettingsNew("NieuweTest");
    console.log("CreateTeamsNew() executed.");
}

function executeInOrder(callback) {
    callback();
}

function GetTeams() {
    console.log("GetTeams() executed");
    GetAllTeamSettings();
}

function DeleteAllTeamSettings() {

    console.log("DeleteAllTeamSettings()");

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There are " + docs.length + " in the collection.");
            docs.forEach(
                function (element) {
                    DeleteTeamSettings(dataService, element.id, element.text);
                }
            );
        });
    });
}

var configuredTeams = [];

var result;

function SetTeamSettingsNew(teamName) {

    console.log("SetTeamSettingsNew(): " + teamName);

    VSS.getService(VSS.ServiceIds.ExtensionData).then(
        function (dataservice) {
            dataservice.getDocuments(TeamSettingsCollectionName).then(
                function (docs) {
                    console.log("GetAllTeamSettingsNew :" + docs.length);
                    configuredTeams = [];
                    docs.forEach(
                        function (element) {
                            configuredTeams.push(element);
                        }
                    );

                    //////////////////
                    result = configuredTeams.find(obj => obj.text === teamName);
                    console.log("checkNew: " + result);

                    if (typeof result === 'undefined') {

                        var newDoc = {
                            text: teamName
                        };

                        dataservice.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                            // Even if no ID was passed to createDocument, one will be generated
                            console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
                        });

                        console.log("SettingNew NOT exists.");
                    }

                    console.log("SettingNew ALREADY exists.");
                    //////////////////

                }
            );
        });
}

function getExistingSettings(dataservice) {

    dataservice.getDocuments(TeamSettingsCollectionName).then(
        function (docs) {
            console.log("GetAllTeamSettingsNew :" + docs.length);

            docs.forEach(
                function (element) {
                    configuredTeams.push(element);
                }
            );
        }
    );
}

function checkIfExistBeforeAdding(docs, teamName) {
    result = docs.find(obj => obj.text === teamName); 
    console.log("checkNew: " + result);
}

function addSetting(dataService, teamName) {
    var newDoc = {
        text: teamName
    };

    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
        // Even if no ID was passed to createDocument, one will be generated
        console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
    });

    console.log("SettingNEw NOT exists.");
}

//some_3secs_function(some_value, function () {
//        some_5secs_function(other_value, function () {
//                some_8secs_function(third_value, function () {
//                        //All three functions have completed, in order.
//        });
//    });
//});


function SetTeamSettings(teamName) {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        var temp = [];
        var result;

        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(
            function (docs) {
            //console.log("There areee " + docs.length + " in the collection in GetAllTeamSettings function.");
            console.log("GetAllTeamSettings :" + docs.length);

            result = docs.find(obj => { return obj.text === teamName; });
            docs.forEach(
                function (element) {
                    temp.push(element);
                }
            );
        });

        if (typeof result === 'undefined') {
            console.log("Setting exists.");
        }
        else {
            // Prepare document first
            var newDoc = {
                text: teamName
            };

            dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                console.log("SetTeamSetting (CreateTeams) : " + doc.text);
            });

            console.log("Setting NOT exists.");
        }
              
    });
}

function GetTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get document by id
        dataService.getDocument(TeamSettingsCollectionName, "MyDocumentId").then(function (doc) {
            // Assuming document has a property named foo
            console.log("Doc foo: " + doc.foo);
        });
    });
}

//var foo = [];

function GetAllTeamSettings() {


    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There areee " + docs.length + " in the collection in GetAllTeamSettings function.");
            console.log("GetAllTeamSettings :" + docs.length);

            //foo = docs;

            return docs;
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

        dataService.setDocument(TeamSettingsCollectionName, myDoc).then(function (doc) {
            console.log("Doc id: " + doc.id);
        });
    });
}


function DeleteTeamSettings(dservice, docId, docText) {

    console.log("DeleteTeamSettings() " + docId + " " + docText);

    if (dservice !== null) {
        dservice.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
            console.log("Doc verwijderd");
        });
    }

    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        //var docId = "1234-4567-8910";
        // Delete document
        dataService.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
            console.log("Doc verwijderddd");
        });
    });
}

VSS.notifyLoadSucceeded();
