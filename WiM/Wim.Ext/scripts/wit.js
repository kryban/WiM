
// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts
var wiTitle = "ttt";
var workItemFocused;

function workItem(wiResult) 
{
    this.id = wiResult.fields["System.Id"];
    this.title = wiResult.fields["System.Title"];
    this.workItemType = wiResult.fields["System.WorkItemType"];
    this.workItemProjectName = wiResult.fields["System.TeamProject"];
    this.workItemIterationPath = wiResult.fields["System.IterationPath"];
    this.workItemAreaPath = wiResult.fields["System.AreaPath"];
    this.workItemTaskActivity = "System.WorkItemTaskActivity nog niet bepaald";
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

                        workItemFocused = new workItem(workitemResult);

                        ShowSelectedWorkitemOnPage(workItemFocused);
                        CheckAllowedToAddTaskToPbi(workItemFocused);
                        
                    });
        }
    );
}

function CheckAllowedToAddTaskToPbi(workItemFocused) {
    if (workItemFocused.workItemType !== "Product Backlog Item" && workItemFocused.workItemType !== "Bug") {
        alert("Aan een " + workItemFocused.workItemType + " mag geen Taak toegevoegd worden.");
        return false;
    }
    return true;
}

function ShowSelectedWorkitemOnPage(workItem) {
    var workitemID = document.getElementById("existing-wit-id").value;
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

//used in wcf client
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


// available WorkITtemFields as a result
//Microsoft.VSTS.Common.BacklogPriority: 1000031622
//Microsoft.VSTS.Common.Severity: "3 - Medium"
//Microsoft.VSTS.TCM.ReproSteps: "Reproductiestappen"
//Microsoft.VSTS.TCM.SystemInfo: "sysinfo"
//System.AreaPath: "WiM"
//System.BoardColumn: "New"
//System.BoardColumnDone: false
//System.ChangedBy: "kry <KRYLP\kry>"
//System.ChangedDate: "2017-12-30T19:55:20.99Z"
//System.CommentCount: 0
//System.CreatedBy: "kry <KRYLP\kry>"
//System.CreatedDate: "2017-12-23T22:39:59.693Z"
//System.IterationPath: "WiM"
//System.Reason: "New defect reported"
//System.State: "New"
//System.TeamProject: "WiM"
//System.Title: "Voorbeeld van een BUG met heeeeeeel vel tekst en allerlei andere dingetjes die te tekst uiteindelijk te lang maken zodat we het wrappen kunnen testen."
//System.WorkItemType: "Bug"
//WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column: "New"
//WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done: false
//dSZW.Socrates.TopDeskWijzigingNr: "W1245-5544"