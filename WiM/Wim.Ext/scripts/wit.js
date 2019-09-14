
// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts
var wiTitle = "ttt";
var parentWorkItem;

//const { applyOperation } = require('fast-json-patch');
//const applyOperation = require('fast-json-patch').applyOperation;
//If this code is not in a define call,
//DO NOT use require('foo'), but use the async
//callback version:
//require(['fast-json-patch'], function (foo) {
//    baz(foo);
//});

function baz(ob) {
    console.log("Baz: " + ob);
}

function workItem(wiResult) 
{
    if (wiResult === null || wiResult === undefined) {
        this.id = "na";
        this.rev = "na";
        this.url = "na";
        this.title = "na";
        this.workItemType = "na";
        this.workItemProjectName = "na";
        this.workItemIterationPath = "na";
        this.workItemAreaPath = "na";
        this.workItemTaskActivity = "na";
    }
    else {

        this.id = wiResult.id;
        this.rev = wiResult.rev;
        this.url = wiResult.url;
        this.title = wiResult.fields[Enm_WorkitemFields.Title];
        this.workItemType = wiResult.fields[Enm_WorkitemFields.WorkItemType];
        this.workItemProjectName = wiResult.fields[Enm_WorkitemFields.TeamProject];
        this.workItemIterationPath = wiResult.fields[Enm_WorkitemFields.IterationPath];
        this.workItemAreaPath = wiResult.fields[Enm_WorkitemFields.AreaPath];
        this.workItemTaskActivity = Enm_WorkitemFields.TaskActivity;
    }
};

function MapWorkItemFields(witemObject, witem )
{
    witemObject.Title = witem.fields["System.Title"];
}

var witClient;
function OpenButtonClicked(obj) {
    VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
        function (_restWitClient) {
            witClient = _restWitClient.getClient();

            witClient.getWorkItem(3)//, ["System.Title", "System.WorkItemType"])
                .then(
                    function (workitemResult) {
                        parentWorkItem = new workItem(workitemResult);
                        ShowSelectedWorkitemOnPage(parentWorkItem);                        
                    });
        }
    );
}

function CheckAllowedToAddTaskToPbi(parentWorkItem) {
    if (parentWorkItem.workItemType !== "Product Backlog Item" && parentWorkItem.workItemType !== "Bug") {
        alert("Aan een " + parentWorkItem.workItemType + " mag geen Taak toegevoegd worden.");
        return false;
    }
    return true;
}

function ShowSelectedWorkitemOnPage(workItem) {
    var workitemID = workItem.id; //document.getElementById("existing-wit-id").value;
    document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + workItem.title;
    VSS.notifyLoadSucceeded();
}

function GetWorkItemTypes(callback) {
    VSS.require(["TFS/WorkItemTracking/RestClient"], function (_restWitClient) {
        witClient = _restWitClient.getClient();

        witClient.getWorkItemTypes(VSS.getWebContext().project.name)
            .then(function () {
                callback(types);
            });
    });
}
// example post request
//IPromise<Contracts.WorkItem> createWorkItem(document, project, type, validateOnly, bypassRules


// create patch document USED in wpf client
//JsonPatchDocument patchDocument = new JsonPatchDocument();
//string linkedWorkitemUrl = SettingsGetter.ApiWorkitemUrl + linkedWorkitemId;

//patchDocument.Add(new JsonPatchOperation()
//            {
//        Operation = Operation.Add,
//        Path = WorkitemPaths.Title,
//        Value = workitemToCreate.Title
//    });

//patchDocument.Add(new JsonPatchOperation()
//            {
//        Operation = Operation.Add,
//        Path = WorkitemPaths.IterationPath,
//        Value = workitemToCreate.WorkItemIterationPath
//    });

//patchDocument.Add(new JsonPatchOperation()
//            {
//        Operation = Operation.Add,
//        Path = WorkitemPaths.AreaPath,
//        Value = workitemToCreate.WorkItemAreaPath
//    });

//if (!String.IsNullOrEmpty(workitemToCreate.WorkItemTaskActivity)) {
//    patchDocument.Add(new JsonPatchOperation()
//                {
//            Operation = Operation.Add,
//            Path = WorkitemPaths.TaskActivity,
//            Value = workitemToCreate.WorkItemTaskActivity
//        });
//}

//patchDocument.Add(new JsonPatchOperation()
//                {
//        Operation = Operation.Add,
//        Path = WorkitemPaths.AllRelations,
//        Value = new
//            {
//                rel = "System.LinkTypes.Hierarchy-Reverse",
//                url = linkedWorkitemUrl,
//                attributes = new
//                    {
//                        comment = "decompositie van allerlei werk"
//                    }
//            }
//    }
//);

//return workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result;



//used in wpf client
//wi = workItem;
//Title = wi.Fields[WorkItemFields.Title].ToString();
//WorkItemType = wi.Fields[WorkItemFields.WorkItemType].ToString();
//WorkItemProjectName = AddProjectName();
//WorkItemIterationPath = AddIterationPath();
//WorkItemAreaPath = AddAreaPath();
//workItemTaskActivity = AddTaskActivity();
//id = wi.Id.ToString();

//newTask.Title = item.Title;
//newTask.WorkItemIterationPath = workItemWrapper.WorkItemIterationPath;
//newTask.WorkItemAreaPath = workItemWrapper.WorkItemAreaPath;
//newTask.WorkItemType = "Task";
//newTask.WorkItemTaskActivity = item.ActivityType;
