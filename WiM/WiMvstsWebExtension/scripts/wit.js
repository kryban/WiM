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
            }
        );
    }
);

VSS.notifyLoadSucceeded();

async function GetWorkItem(client, id) 
{
    await client.getWorkItem(parseInt(id), ["System.Title", "System.WorkItemType"]).then(
        function (workitm)
        {
            var foo = JSON.stringify(workitm);
            MapWorkItemToObject(workitm);
        },
        function (rejectReason)
        {
            var bar = rejectReason; //JSON.stringify(rejectReason);
            WorkItemObj.Title = "No work item found with id " + id + ". </br> Reason: " + rejectReason.message;          
        }
    );
}

function MapWorkItemToObject(workit) 
{
    MapWorkItemFields(workit, WorkItemObj);
}

function MapWorkItemFields(witem, witemObject)
{
    witemObject.Title = witem.fields["System.Title"];
};

async function OpenButtonClicked() 
{
    var workitemID = document.getElementById("existing-wit-id").value;

    await GetWorkItem(witClient, workitemID);
    UpdateTextField(workitemID);
}


function UpdateTextField(workitemID)
{
    wi = WorkItemObj.Title;
    document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + wi;
}
