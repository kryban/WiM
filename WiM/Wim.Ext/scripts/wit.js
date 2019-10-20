
// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts
var wiTitle = "ttt";
var parentWorkItem;
var defaultText_searchWI = "workitem ID";
//var chosenTeam="";

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

function ExistingWitFieldFocussed() {
    var field = document.getElementById("existing-wit-id");
    if (field.value === "workitem ID") {
        field.value = "";
    }
}

var witClient;
function OpenButtonClicked(obj) {
    
    VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
        function (_restWitClient) {

            parentWorkItem = null;
            witClient = _restWitClient.getClient();

            var witId = document.getElementById("existing-wit-id").value;
            var checkBoxes = document.getElementsByClassName("checkbox");
            var addButton = document.getElementById("addTasksButton");

            witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
                .then(function (workitemResult) {
                    parentWorkItem = new workItem(workitemResult);
                    ShowSelectedWorkitemOnPage(parentWorkItem);
                })
                .catch(
                    function () {
                        if (parentWorkItem === undefined || parentWorkItem === null) {
                            document.getElementById("existing-wit-text").innerHTML = "Workitem niet gevonden";
                            DisableItems(checkBoxes, addButton);
                        }
                    }
                );
            }
        );
}

function MainPageEnterPressed(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        OpenButtonClicked();
    }
}

function CheckAllowedToAddTaskToPbi(parentWorkItem) {
    if (parentWorkItem.workItemType !== "Product Backlog Item" && parentWorkItem.workItemType !== "Bug") {
        return false;
    }
    return true;
}

function ShowSelectedWorkitemOnPage(workItem) {

    var allowToAdd = CheckAllowedToAddTaskToPbi(workItem);
    //var checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    var checkBoxes = document.getElementsByClassName("checkbox");
    var addButton = document.getElementById("addTasksButton");

    if (!allowToAdd) {
        document.getElementById("existing-wit-text").className = "existing-wit-text-not";
        document.getElementById("existing-wit-text").innerHTML = "Aan een " + workItem.workItemType + " mag geen Task toegevoegd worden." +
            "</br> " +
            "(" + workItem.id + ")" + workItem.title;

        DisableItems(checkBoxes, addButton);
    }
    else {
        document.getElementById("existing-wit-text").className = "existing-wit-text";
        document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;

        EnableItems(checkBoxes, addButton);
    }

    VSS.notifyLoadSucceeded();
}

function EnableItems(checkBoxes, addButton) {
    for (var i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].disabled = true;
    }
    //checkBoxes.forEach(function(element) {
    //    element.disabled = false;
    //});
    addButton.disabled = false;
}

function DisableItems(checkBoxes, addButton) {

    for (var i = 0; i < checkBoxes.length; i++) {
        checkBoxes[i].disabled = true;
    }

    //checkBoxes.forEach(function (element) {
    //    element.disabled = true;
    //});
    addButton.disabled = true;
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