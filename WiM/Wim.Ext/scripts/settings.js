
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
//see all settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents

//CreateTeams();

var TeamSettingsCollectionName = "WimCollection";
var configuredTeams = [];
var result;

function ConfigureTeams(command) {

    //OpenTeamSettingsDialogAdvanced(command);
    //OpenTeamSettingsDialog(command);

    //OpenTeamsConfiguratieDialoog(command);
    $('.modal_teams').show();
}
//var teamsForm = ["yo","yi"]; 
var extenralSetted;

function OpenTeamsConfiguratieDialoog(title) {

    //VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {

    //    var extensionCtx = VSS.getExtensionContext();
    //    var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".manage-teams";

    //    var dialogOptions = {
    //        title: "Manage teams"
    //        , height: 500
    //        , okText: "OKK"
    //        //, cancelText: "Annuleer" 
    //        , getDialogResult: function () {
    //          }
    //        , okCallback: function (result) {
    //            VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
    //                // Reload whole page
    //               log("navigationService.reload()");
    //                navigationService.reload();
    //                VSS.notifyLoadSucceeded();
    //            });
    //        }
    //    };

    //    dialogService.openDialog(contributionId, dialogOptions).then(
    //        function (dialog) {

    //            dialog
    //                .getContributionInstance("Bandik.WimDevOpExtension.manage-teams")
    //                .then(function(manageTeamsinstance) {
    //                    teamsForm = manageTeamsinstance;
    //                }
    //            );

    //            dialog.updateOkButton(true);
    //            VSS.notifyLoadSucceeded();
    //        }
    //    );

    //    VSS.notifyLoadSucceeded();
    //});

    //var updateButton = document.getElementById('updateDetails');
    
    //var outputBox = document.getElementsByTagName('output')[0];
    //var selectEl = document.getElementsByTagName('select')[0];
    var _teamConfirmBtn = document.getElementById('teamDialogConfirm');
    

    if (typeof teamDialog.showModal === "function") {
        teamDialog.showModal();
    } else {
        alert("The dialog API is not supported by this browser");
    }

    // “Update details” button opens the <dialog> modally
    //updateButton.addEventListener('click', function onOpen() {
    //    if (typeof favDialog.showModal === "function") {
    //        favDialog.showModal();
    //    } else {
    //        alert("The dialog API is not supported by this browser");
    //    }
    //});
    // "Favorite animal" input sets the value of the submit button
    //selectEl.addEventListener('change', function onSelect(e) {
    //    confirmBtn.value = selectEl.value;
    //});
    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
    teamDialog.addEventListener('close', function onClose() {
        //teamInpChangeHandler();
        log("closing teamsettings");
    });
}

//(function () {
//    var updateButton = document.getElementById('updateDetails');
//    var favDialog = document.getElementById('favDialog');
//    var outputBox = document.getElementsByTagName('output')[0];
//    var selectEl = document.getElementsByTagName('select')[0];
//    var confirmBtn = document.getElementById('confirmBtn');

//    // “Update details” button opens the <dialog> modally
//    updateButton.addEventListener('click', function onOpen() {
//        if (typeof favDialog.showModal === "function") {
//            favDialog.showModal();
//        } else {
//            alert("The dialog API is not supported by this browser");
//        }
//    });
//    // "Favorite animal" input sets the value of the submit button
//    selectEl.addEventListener('change', function onSelect(e) {
//        confirmBtn.value = selectEl.value;
//    });
//    // "Confirm" button of form triggers "close" on dialog because of [method="dialog"]
//    favDialog.addEventListener('close', function onClose() {
//        outputBox.value = favDialog.returnValue + " button clicked - " + (new Date()).toString();
//    });
//})();


//function executeInOrder(callback) {
//    callback();
//}

function GetTeams() {
    console.log("GetTeams() executed");
    GetAllTeamSettings();
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
            VSS.notifyLoadSucceeded();
        }
    );
}

function checkIfExistBeforeAdding(docs, teamName) {
    result = docs.find(function(obj) { return obj.text === teamName; }); 


    console.log("checkNew: " + result);
}

function addSetting(dataService, teamName) {
    var newDoc = {
        text: teamName
    };

    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
        console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
    });

    console.log("SettingNEw NOT exists.");
}

function SetTeamSettings(teamName) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        var temp = [];
        var result;

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            console.log("GetAllTeamSettings :" + docs.length);

            result = docs.find(function(obj) { return obj.text === teamName; });
            docs.forEach(
                function (element) {
                    temp.push(element);
                });

                VSS.notifyLoadSucceeded();
            });

        if (typeof result === 'undefined') {
            console.log("Setting exists.");
        }
        else {
            var newDoc = {
                type: "team",
                text: teamName
            };

            dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                console.log("SetTeamSetting (CreateTeams) : " + doc.text);
            });

            console.log("Setting NOT exists.");
        }
        VSS.notifyLoadSucceeded();
    });
}

//function GetTeamSettings() {
//    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
//        dataService.getDocument(TeamSettingsCollectionName, "MyDocumentId").then(function (doc) {
//            console.log("Doc foo: " + doc.foo);
//            VSS.notifyLoadSucceeded();
//        });
//        VSS.notifyLoadSucceeded();
//    });
//}

//var foo = [];

function GetAllTeamSettings() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            console.log("GetAllTeamSettings :" + docs.length);

            VSS.notifyLoadSucceeded();
            return docs;
        });
        VSS.notifyLoadSucceeded();
    });
}

function reloadHost() {
    VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
        console.log("navigationService.reload()");
        navigationService.reload();
    });
    log();
}

VSS.notifyLoadSucceeded();
