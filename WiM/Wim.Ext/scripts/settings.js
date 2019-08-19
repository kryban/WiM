
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts

//get settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents

var TeamSettingsCollectionName = "WimCollection";

function ConfigureTeams(command) {

    //OpenTeamSettingsDialogAdvanced(command);
    //OpenTeamSettingsDialog(command);
    OpenConfiguratieDialoog(command);
}

function OpenConfiguratieDialoog(title) {

    VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {
        var extensionCtx = VSS.getExtensionContext();

        // Build absolute contribution ID for dialogContent
        //var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".teamsettings-form";
        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".manage-teams";

        // Show dialog
        var dialogOptions = {
            title: "Add new team: "
            //width: 300,
            //height: 200
        };

        dialogService.openDialog(contributionId, dialogOptions);
    });

    // advanced
    //VSS.getService(VSS.ServiceIds.Dialog).then(
    //    function (dialogService) {
    //        var registrationForm;
    //        var extensionCtx = VSS.getExtensionContext();
    //        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".teamsettings-form";

    //        var dialogOptions = {
    //            title: "Teamsettings Form: " + title +" --" + contributionId,
    //            width: 800,
    //            height: 600,
    //            getDialogResult: function () {
    //                // Get the result from registrationForm object
    //                return registrationForm ? registrationForm.getFormData() : null;
    //            },
    //            okCallback: function (result) {
    //                // Log the result to the console
    //                console.log(JSON.stringify(result));
    //            }
    //        };

    //        dialogService.openDialog(contributionId, dialogOptions).then(
    //            function (dialog) {
    //                // Get registrationForm instance which is registered in registrationFormContent.html
    //                dialog.getContributionInstance("teamsettings-form").then(
    //                    function (teamSettingsFormInstance) {

    //                        // Keep a reference of registration form instance (to be used above in dialog options)
    //                        registrationForm = teamSettingsFormInstance;

    //                        // Subscribe to form input changes and update the Ok enabled state
    //                        registrationForm.attachFormChanged(function (isValid) {
    //                            dialog.updateOkButton(isValid);
    //                        });

    //                        // Set the initial ok enabled state
    //                        registrationForm.isFormValid().then(function (isValid) {
    //                            dialog.updateOkButton(isValid);
    //                        });
    //                    });
    //            });
    //});
}

function DeleteTeams() {
    console.log("DeleteTeams() executed.");
    DeleteAllTeamSettings();
}


function CreateTeams() {
    console.log("CreateTeams() executing");
    SetTeamSettingsNew("Xtreme");
    console.log("CreateTeamsNew() executed.")
    //SetTeamSettings("Committers");
    //SetTeamSettings("Test");
    //SetTeamSettings("NieuweTest");
    //console.log("CreateTeams() executing");

    //promises = [];
    //promises.push(SetTeamSettingsNew("Xtreme"));
    //promises.push(SetTeamSettingsNew("Committers"));
    //promises.push(SetTeamSettingsNew("Test"));
    //promises.push(SetTeamSettingsNew("NieuweTest"));

    //Promise.all(promises).then(console.log("CreateTeamsNew() executed."));
}


function GetTeams() {
    console.log("GetTeams() executed");
    GetAllTeamSettings();
}

function DeleteAllTeamSettings() {

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There are " + docs.length + " in the collection.");
            docs.forEach(
                function (element) {
                    DeleteTeamSettings(dataService, element.id);
                }
            );
        });
    });
}

function SetTeamSettingsNew(teamName) {

    VSS.getService(VSS.ServiceIds.ExtensionData).then(
        function (dataservice) {
            getExistingSettings(dataservice, function () {
                checkIfExistBeforeAdding(docsNew, teamName, function () {
                    if (result !== undefined) {
                        addSetting(dataservice, teamName);
                    }
                });
            });

        });
}

var docsNew = [];

function getExistingSettings(dataservice, callback) {

    dataservice.getDocuments(TeamSettingsCollectionName).then(
        function (docs) {
            console.log("GetAllTeamSettingsNew :" + docs.length);

            docs.forEach(
                function (element) {
                    docsNew.push(element);
                }
            );
        }
    );

    callback();
}

var result;

function checkIfExistBeforeAdding(docs, teamName, callback) {
    result = docs.find(obj => { return obj.text === teamName; });
    console.log("checkNew: " + result);
    callback();
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

some_3secs_function(some_value, function () {
        some_5secs_function(other_value, function () {
                some_8secs_function(third_value, function () {
                        //All three functions have completed, in order.
        });
    });
});


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

        if (result === undefined) {
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

var configuredTeams = [];

function GetAllTeamSettings() {
    // Get data service
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There areee " + docs.length + " in the collection in GetAllTeamSettings function.");
            console.log("GetAllTeamSettings :" + docs.length);
            docs.forEach(
                function (element) {
                    configuredTeams.push(element);
                }
            );
        });

        console.log("Set configuredTeams: " + configuredTeams.length);
    });

    return configuredTeams;
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


function DeleteTeamSettings(dservice, docId) {

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
