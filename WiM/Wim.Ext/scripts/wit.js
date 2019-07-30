﻿VSS.init({
    explicitNotifyLoaded: true, 
    usePlatformScripts: true,
    usePlatformStyles: false
});  

var wi = "ttt";

var WorkItemObj =
{
    Id: null,
    Title: null,
    WorkItemType: null,
    WorkItemProjectName: null,
    WorkItemIterationPath: null,
    WorkItemAreaPath: null,
    WorkItemTaskActivity: null,
};

function MapWorkItemFields(witemObject, witem )
{
    witemObject.Title = witem.fields["System.Title"];
}

// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts

var witClient;

VSS.init({
    // Our extension explicitly notifies the host when we're done loading
    explicitNotifyLoaded: true,

    // We are using some Azure DevOps Services APIs, so we need the module loader to load them in
    usePlatformScripts: true,
    usePlatformStyles: true
});

VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
    function (_restWitClient) {
        witClient = _restWitClient.getClient();

        witClient.getWorkItem(3, ["System.Title", "System.WorkItemType"])
            .then(
                function (workitmResult) {
                    MapWorkItemFields(WorkItemObj, workitmResult);
                wi = WorkItemObj.Title;
                //wi = workitm.fields["System.Title"];//JSON.stringify(workitm);
                var foo = 1;
            });

        //        var projectNames = VSS.getWebContext().project.name;
        var workitemTypes = witClient.getWorkItemTypes(VSS.getWebContext().project.name)
            .then(
                function (types) {
                var bar = JSON.stringify(types);
                return types[0];
                //var bar2 = 1;
            }
        );
        var foro = witClient;
    }
);


function OpenConfiguratieDialoog(title)
{
    VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {
        var extensionCtx = VSS.getExtensionContext();
        // Build absolute contribution ID for dialogContent
        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".dialogContent";

        // Show dialog
        var dialogOptions = {
            title: title,
            width: 400,
            height: 75
        };

        dialogService.openDialog(contributionId, dialogOptions);
    });
}

function OpenButtonClicked(obj)
{
    var workitemID = document.getElementById("existing-wit-id").value;
    document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + wi;
    OpenConfiguratieDialoog("Open button clicked.");
}

