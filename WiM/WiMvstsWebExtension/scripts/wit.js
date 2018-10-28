VSS.init({
    explicitNotifyLoaded: true,
    usePlatformScripts: true,
    usePlatformStyles: false
});  

var wi = "defaultText";
var witClient;

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

function MapWorkItemFields(witem, witemObject)
{
    witemObject.Title = witem.fields["System.Title"];
};

// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts

VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
    function (_restWitClient) {
        witClient = _restWitClient.getClient();
        
        //var projectNames = VSS.getWebContext().project.name;
        var workitemTypes = witClient.getWorkItemTypes(VSS.getWebContext().project.name).then(
            function (types)
            {
                var bar = JSON.stringify(types);
                return types[0];
                //var bar2 = 1;
            }
        );
        var foro = witClient;
    }
);

VSS.notifyLoadSucceeded();

async function GetWorkItem(client) {
      await client.getWorkItem(3, ["System.Title", "System.WorkItemType"]).then(
        function (workitm)
        {
            MapWorkItemToObject(workitm);
        });
}

function MapWorkItemToObject(workit) {
    MapWorkItemFields(workit, WorkItemObj);
    //wi = workitm.fields["System.Title"];//JSON.stringify(workitm);
    wi = WorkItemObj.Title;
    var foo = 1;
}

async function OpenButtonClicked() {
    var workitemID = document.getElementById("existing-wit-id").value;

    await GetWorkItem(witClient);

    UpdateTextField(workitemID);
}


function UpdateTextField(workitemID) {
    document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + wi;
}
