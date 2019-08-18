
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts

function ConfigureTeams(command) {

    //OpenTeamSettingsDialogAdvanced(command);
    //OpenTeamSettingsDialog(command);
    OpenConfiguratieDialoog(command);
}

function OpenConfiguratieDialoog(title) {
    // // customg try out
    //VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {
    //    var extensionCtx = VSS.getExtensionContext();
    //    // Build absolute contribution ID for dialogContent
    //    var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".dialogContent";

    //    // Show dialog
    //    var dialogOptions = {
    //        title: title
    //        , width: 500
    //        //,height: 75
    //    };

    //    dialogService.openDialog(contributionId, dialogOptions);
    //});

    // // settings
    VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {
        var extensionCtx = VSS.getExtensionContext();
        // Build absolute contribution ID for dialogContent
        //var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".teamsettings-form";
        //var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".beta";
        //var contributionId = "Bandik.WimDevOpExtension.beta";
          var contributionId = "Bandik.WimDevOpExtension.teamsettings-form";

        // Show dialog
        var dialogOptions = {
            title: "My Dialog: " + contributionId + "||" + title,
            width: 800,
            height: 600
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
