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
    TasksAllowed: false
};

// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts

VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
    function (_restWitClient) {
        witClient = _restWitClient.getClient();
        
        //var projectNames = VSS.getWebContext().project.name;
        //var workitemTypes = witClient.getWorkItemTypes(VSS.getWebContext().project.name).then(
        //    function (types)
        //    {
        //        var bar = JSON.stringify(types);
        //        return types[0];
        //    }
        //);
    }
);

VSS.notifyLoadSucceeded();

async function GetWorkItem(client, id) 
{
    await client.getWorkItem(parseInt(id), ["System.Title", "System.WorkItemType"]).then(
        function (workitm)
        {
            //var foo = JSON.stringify(workitm);
            MapWorkItemToObject(workitm);
        },
        function (rejectReason)
        {
            //var bar = rejectReason; //JSON.stringify(rejectReason);
            WorkItemObj.Title = "No work item found with id " + id + ". </br> Reason: " + rejectReason.message;    
            MapToEmptyWorkItemObject();
        }
    );
}

function MapWorkItemToObject(workit) 
{
    MapWorkItemFields(workit, WorkItemObj);
}

function MapToEmptyWorkItemObject()
{
    //WorkItemObj.Id = null;
    //WorkItemObj.Title = null;
    WorkItemObj.WorkItemType = null;
    WorkItemObj.WorkItemProjectName = null;
    WorkItemObj.WorkItemIterationPath= null;
    WorkItemObj.WorkItemAreaPath = null;
    WorkItemObj.WorkItemTaskActivity = null;
    WorkItemObj.TasksAllowed= false;
}

function MapWorkItemFields(witem, witemObject)
{
    witemObject.Title = witem.fields["System.Title"];
    witemObject.WorkItemType = witem.fields["System.WorkItemType"];
    witemObject.TasksAllowed = CompareWorkItemType(witem.fields["System.WorkItemType"]);
}

function CompareWorkItemType(type)
{
    var bug = "Bug";
    var productBacklogItem = "Product Backlog Item";

    return (type.localeCompare(bug) === 0 || type.localeCompare(productBacklogItem) === 0);
}

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

    if (!WorkItemObj.TasksAllowed)
    {
        document.getElementById("existing-wit-text").style.color = "Red";
    }
    else
    {
        document.getElementById("existing-wit-text").style.color = "Black";
    }
}
