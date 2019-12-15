
// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts
var parentWorkItem;

//////////////////////startup/////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////////
var TeamSettingsCollectionName = "WimCollection";

document.addEventListener('DOMContentLoaded', function (event) {

    var name = window.location.pathname.split('/').slice(-1);

    CreateDefaultSettingsWhenEmpty();
    DisableCheckBoxes();
    DisableAddButton();

    MaakMenu();

    registerTasksModelButtonEvents();
    registerTeamsModelButtonEvents();

    log("DocumentReady:" + name);
});

var controls = VSS.require("VSS/Controls", function (c) { controls = c; });
var statusindicator = VSS.require("VSS/Controls/StatusIndicator", function (i) { statusindicator = i; });
var vssService = VSS.require("VSS/Service", function (s) { vssService = s; });
var wiTrackingClient = VSS.require("TFS/WorkItemTracking/RestClient", function (r) { wiTrackingClient = r; });

function registerTasksModelButtonEvents() {
    //Show modal box
    $('#modal_tasks_openModal').click(

        function () { openTasksModal(); }
    );
    //Hide modal box
    $('#modal_tasks_closeModal').click(
        function () { closeTasksModal(); }
    );
}

function registerTeamsModelButtonEvents() {
    //Show modal box
    $('#modal_teams_openModal').click(

        function () { openTeamsModal(); }
    );
    //Hide modal box
    $('#modal_teams_closeModal').click(
        function () { closeTeamsModal(); }
    );
}

function openTasksModal() { $('.modal_tasks').show(); }
function closeTasksModal() { $('.modal_tasks').hide(); }
function openTeamsModal() { $('.modal_teams').show(); }
function closeTeamsModal() { $('.modal_teams').hide(); }

//function alertWhenIE() {
//    if (isIE()) {
//        alert('Sorry, this extension does not work in IE. Maybe future version will. Use Chrome. ');
//    }
//}

//function isIE() {
//    ua = navigator.userAgent;
//    /* MSIE used to detect old browsers and Trident used to newer ones*/
//    var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;

//    return is_ie;
//}

function log(txt) {
    var tekst = (txt !== null && typeof txt !== "undefined") ? txt : "";
    console.log(arguments.callee.caller.name + " : " + tekst);
}

function CreateDefaultSettingsWhenEmpty() {
    try {
        FindCollection();
    }
    catch (e) {
        CreateFirstTimeCollection();
    }
}

function FindCollection() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName)
            .then(
                function (docs) {
                    if (docs.length < 1) {
                        CreateFirstTimeCollection();
                    }
                    log("Number of docs found: " + docs.length);
                }, // on reject
                function (err) {
                    CreateFirstTimeCollection();
                    log("Nothing found. Default Created.");
                }
            );
    });
    log("Found");
}

function CreateFirstTimeCollection() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };

        dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            log("Default document created: " + doc.text);
        });
    });

    log();
}

function DisableCheckBoxes() {
    var checkBoxes = document.getElementsByClassName("checkbox");
    if (checkBoxes !== null || (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks))
    {
        for (var i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].disabled = true;
        }
    }
}

function EnableCheckBoxes() {
    var checkBoxes = document.getElementsByClassName("checkbox");
    if (checkBoxes !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
        for (var i = 0; i < checkBoxes.length; i++) {
            checkBoxes[i].disabled = false;
        }
    }
}

function DisableAddButton() {
    var addButton = document.getElementById("addTasksButton");
    if (addButton !== null && (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
        addButton.disabled = true;
    }
}

function EnableAddButton() {
    var addButton = document.getElementById("addTasksButton");
    if (addButton !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks))
    {
        addButton.disabled = false;
    }
}

// Browserdafe Modal try-outs
//let modalBtn = document.getElementById("modal-btn");
let modal = document.querySelector(".modal");
let closeBtn = document.querySelector(".close-btn");
//modalBtn.onclick = function () {
//    modal.style.display = "block";
//}
//closeBtn.onclick = function () {
//    modal.style.display = "none";
//}

//window.onclick = function (e) {
//    if (e.target === modal) {
//        modal.style.display = "none";
//    }
//}

//////////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////startup/////////////////////////////////////////////////////////////////////////

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
        this.allowedToAddTasks = false;
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
        this.allowedToAddTasks = CheckAllowedToAddTaskToPbi(this);
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
                            DisableCheckBoxes();
                            DisableAddButton();
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

    if (!allowToAdd) {
        document.getElementById("existing-wit-text").className = "existing-wit-text-not";
        document.getElementById("existing-wit-text").innerHTML = "Aan een " + workItem.workItemType + " mag geen Task toegevoegd worden." +
            "</br> " +
            "(" + workItem.id + ")" + workItem.title;

         DisableCheckBoxes();
         DisableAddButton();
    }
    else {
        document.getElementById("existing-wit-text").className = "existing-wit-text";
        document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;

        EnableCheckBoxes();
        EnableAddButton();
    }

    VSS.notifyLoadSucceeded();
}

//function EnableItems(checkBoxes, addButton) {
//    for (var i = 0; i < checkBoxes.length; i++) {
//        checkBoxes[i].disabled = true;
//    }
//    //checkBoxes.forEach(function(element) {
//    //    element.disabled = false;
//    //});
//    addButton.disabled = false;
//}

//function DisableItems(checkBoxes, addButton) {

//    for (var i = 0; i < checkBoxes.length; i++) {
//        checkBoxes[i].disabled = true;
//    }

//    //checkBoxes.forEach(function (element) {
//    //    element.disabled = true;
//    //});
//    addButton.disabled = true;
//}

function GetWorkItemTypes(callback) {
    VSS.require(["TFS/WorkItemTracking/RestClient"], function (_restWitClient) {
        witClient = _restWitClient.getClient();

        witClient.getWorkItemTypes(VSS.getWebContext().project.name)
            .then(function () {
                callback(types);
            });
    });
}


///////////////manage-teams //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////
//VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

//    dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

//        var x = 0;

//        // only teams setting. Not other settings
//        var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
//        log("1-Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings");
//        teamDocs.forEach(
//            function (element) {
//                //var inputId = "teamNaam" + x;
//                //x++;
//                //$('.input_fields_container_part').append(
//                //    '<div>' +
//                //    '<input onchange="teamInpChangeHandler()" onblur="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId +'" value="' + element.text + '"/>' +
//                //    '<a href="#" onclick="removeTeamFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
//                //    '</div>');
//                addTeamHandler(element.text);
//            }
//        );
//        VSS.notifyLoadSucceeded();

//    });
//    VSS.notifyLoadSucceeded();
//});


function teamInpChangeHandler() {

    var teamsOnForm = document.getElementsByName("teamInpNaam");

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });

            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises = [new Promise(function () { /*empty*/ })];
            var added = false;

            teamDocs.forEach(
                function (element) {

                    teamDeletionPromises.push(dataService.deleteDocument(TeamSettingsCollectionName, element.id));
                }
            );

            Promise.all(teamDeletionPromises).then(function (service) {

                if (!added) {
                    log("Doc verwijderd");
                    AddTeamDocs(teamsOnForm, dataService);
                    VSS.notifyLoadSucceeded();
                }
            });

            // refactor this
            if (!added) {
                log("Doc verwijderd");
                AddTeamDocs(teamsOnForm, dataService);
                VSS.notifyLoadSucceeded();
            }
        });
    });

    log("Finished");
    //teamDialog.close();
    closeTeamsModal();
}

function AddTeamDocs(teamsCollection, dataService) {
    for (var i = 0; i < teamsCollection.length; i++) {

        var teamnaam = teamsCollection[i].value;
        //teamsForm.push(teamnaam);

        //log(teamDocs.length);
        log(teamnaam);

        var newDoc = {
            type: "team",
            text: teamnaam
        };

        dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            // Even if no ID was passed to createDocument, one will be generated
            log(doc.text);
        });

        log("Team Setting Added: " + teamnaam);

        reloadHost();
    }
}

var defaultTeamName = "Team naam";
function addTeamHandler(name) {
    //arbitrary maximum
    //var max_teamfields_limit = 7;
    //var t = 0;

    //if (t < max_teamfields_limit) {
    //    alert("hoihoi");
    //    t++;
    //    var inputId = "teamNaam" + t;

    //    $('.input_fields_container_part').append(
    //        '<div>' +
    //        '<input onchange="teamInpChangeHandler()" onblur="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId + '" value="... teamnaam ... "/>' +
    //        '<a href="#" onclick="removeFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
    //        '</div>');
    //}

    var teamTitle = (name !== null && typeof name !== "undefined") ? name : defaultTeamName;

    var teamRowNode = document.createElement("div");
    //teamRowNode.setAttribute("class", "taskInputRow");

    var teamNaamInputNode = document.createElement("input");
    //teamNaamInputNode.setAttribute("onchange", "teamInpChangeHandler()");
    //teamNaamInputNode.setAttribute("onblur", "teamInpChangeHandler()");
    teamNaamInputNode.setAttribute("onfocus", "removeDefaultTextHandler(this)");
    teamNaamInputNode.setAttribute("type", "text");
    teamNaamInputNode.setAttribute("value", teamTitle);
    teamNaamInputNode.setAttribute("name", "teamInpNaam");
    teamNaamInputNode.setAttribute("class", "teamNaamInput");


    var removeTeamFieldNode = document.createElement("a");
    removeTeamFieldNode.setAttribute("onclick", "removeTeamFieldClickHandler(this)");
    removeTeamFieldNode.setAttribute("href", "#");
    //removeTaskFieldNode.setAttribute("type", "text");
    //removeTaskFieldNode.setAttribute("value", "... taskActivityType ...");
    removeTeamFieldNode.setAttribute("style", "margin-left:10px;");
    removeTeamFieldNode.setAttribute("class", "remove_field");
    removeTeamFieldNode.innerText = "Verwijder teamm";

    //var labelNode = document.createElement("label");
    //labelNode.setAttribute("for", element.id);
    //labelNode.innerHTML = element.title;
    var teamInputContainer = document.getElementsByClassName("input_fields_container_part")[0];

    teamInputContainer.appendChild(teamRowNode);
    teamRowNode.appendChild(teamNaamInputNode);
    teamRowNode.appendChild(removeTeamFieldNode);
    teamRowNode.appendChild(document.createElement("br"));

}



//function RegistreerButtonEvents() {

//    var cancelBtn = document.getElementById('dialogCancel');
//    var confirmBtn = document.getElementById('dialogConfirm');;

//    cancelBtn.addEventListener("click", function () { favDialog.close(); });
//    confirmBtn.addEventListener("click", teamInpChangeHandler());

//    log();
//}

///////////////manage-teams //////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//////////////settings////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
//see all settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents

//CreateTeams();

//var TeamSettingsCollectionName = "WimCollection";
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

    //var _teamConfirmBtn = document.getElementById('teamDialogConfirm');

    if (typeof teamDialog.showModal === "function") {
        teamDialog.showModal();
    } else {
        alert("The dialog API is not supported by this browser");
    }

    teamDialog.addEventListener('close', function onClose() {
        log("closing teamsettings");
    });
}

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
    result = docs.find(function (obj) { return obj.text === teamName; });

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

            result = docs.find(function (obj) { return obj.text === teamName; });
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

//////////////////////////////////////////////////////////////////////////////////////////
//////////////settings////////////////////////////////////////////////////////////////////

//////////////tasks //////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////

var selectedTeam;

var Enm_WorkitemPaths = {
    AreaPath: "/fields/System.AreaPath",
    TeamProject: "/fields/System.TeamProject",
    IterationPath: "/fields/System.IterationPath",
    WorkItemType: "/fields/System.WorkItemType",
    State: "/fields/System.State",
    Reason: "/fields/System.Reason",
    CreatedDate: "/fields/System.CreatedDate",
    CreatedBy: "/fields/System.CreatedBy",
    ChangedDate: "/fields/System.ChangedDate",
    ChangedBy: "/fields/System.ChangedBy",
    Title: "/fields/System.Title",
    BoardColumn: "/fields/System.BoardColumn",
    BoardColumnDone: "/fields/System.BoardColumnDone",
    BacklogPriority: "/fields/Microsoft.VSTS.Common.BacklogPriority",
    Severity: "/fields/Microsoft.VSTS.Common.Severity",
    KanBanColumn: "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column",
    KanBanColumnDone: "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done",
    TopDeskWijzigingNr: "/fields/dSZW.Socrates.TopDeskWijzigingNr",
    SystemInfo: "/fields/Microsoft.VSTS.TCM.SystemInfo",
    ReproSteps: "/fields/Microsoft.VSTS.TCM.ReproSteps",
    TaskActivity: "/fields/Microsoft.VSTS.Common.Activity",
    url: "/fields/url",
    AllRelations: "/relations/-",
    SpecficRelations: "/relations/"
};

var Enm_WorkitemFields = {
    AreaPath: "System.AreaPath",
    TeamProject: "System.TeamProject",
    IterationPath: "System.IterationPath",
    WorkItemType: "System.WorkItemType",
    State: "System.State",
    Reason: "System.Reason",
    CreatedDate: "System.CreatedDate",
    CreatedBy: "System.CreatedBy",
    ChangedDate: "System.ChangedDate",
    ChangedBy: "System.ChangedBy",
    Title: "System.Title",
    BoardColumn: "System.BoardColumn",
    BoardColumnDone: "System.BoardColumnDone",
    BacklogPriority: "Microsoft.VSTS.Common.BacklogPriority",
    Severity: "Microsoft.VSTS.Common.Severity",
    KanBanColumn: "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column",
    KanBanColumnDone: "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done",
    TopDeskWijzigingNr: "dSZW.Socrates.TopDeskWijzigingNr",
    SystemInfo: "Microsoft.VSTS.TCM.SystemInfo",
    ReproSteps: "Microsoft.VSTS.TCM.ReproSteps",
    TaskActivity: "Microsoft.VSTS.Common.Activity",
    url: "url",
    AllRelations: "/relations/-",
    SpecficRelations: "/relations/"
};

var Enm_JsonPatchOperations =
{
    Add: "add"
};

function removeTeamFieldClickHandler(obj) {
    obj.parentNode.remove();
    log("Fields removed.");
}

function removeTaskFieldClickHandler(obj) {
    obj.parentNode.remove();
    log("Fields removed.");
}

var defaultTaskTitle = "Taak titel";
function addTaskToConfigurationHandler(title, type) {

    var taskTitle = (title !== null && typeof title !== "undefined") ? title : defaultTaskTitle;

    var taskInputRowNode = document.createElement("div");
    taskInputRowNode.setAttribute("class", "taskInputRow");

    var taskNaamInputNode = document.createElement("input");
    taskNaamInputNode.setAttribute("onfocus", "removeDefaultTextHandler(this)");
    taskNaamInputNode.setAttribute("type", "text");
    taskNaamInputNode.setAttribute("value", taskTitle);
    taskNaamInputNode.setAttribute("name", "taskInpNaam");
    taskNaamInputNode.setAttribute("class", "taskNaamInput");

    var taskActivityTypeSelectNode = document.createElement("select");
    taskActivityTypeSelectNode.setAttribute("class", "taskActivityTypeSelect");

    var taskActivityTypeOptionNode1 = document.createElement("option");
    taskActivityTypeOptionNode1.setAttribute("class", "taskActivityTypeOption");
    var taskActivityTypeOptionNode2 = document.createElement("option");
    taskActivityTypeOptionNode2.setAttribute("class", "taskActivityTypeOption");
    var taskActivityTypeOptionNode3 = document.createElement("option");
    taskActivityTypeOptionNode3.setAttribute("class", "taskActivityTypeOption");
    var taskActivityTypeOptionNode4 = document.createElement("option");
    taskActivityTypeOptionNode4.setAttribute("class", "taskActivityTypeOption");
    var taskActivityTypeOptionNode5 = document.createElement("option");
    taskActivityTypeOptionNode5.setAttribute("class", "taskActivityTypeOption");
    var taskActivityTypeOptionNode6 = document.createElement("option");
    taskActivityTypeOptionNode6.setAttribute("class", "taskActivityTypeOption");

    taskActivityTypeOptionNode1.innerText = "Deployment";
    if (type === taskActivityTypeOptionNode1.innerText) {
        taskActivityTypeOptionNode1.setAttribute("selected", "selected");
    }
    taskActivityTypeOptionNode2.innerText = "Design";
    if (type === taskActivityTypeOptionNode2.innerText) {
        taskActivityTypeOptionNode2.setAttribute("selected", "selected");
    }
    taskActivityTypeOptionNode3.innerText = "Development";
    if (type === taskActivityTypeOptionNode3.innerText) {
        taskActivityTypeOptionNode3.setAttribute("selected", "selected");
    }
    taskActivityTypeOptionNode4.innerText = "Documentation";
    if (type === taskActivityTypeOptionNode4.innerText) {
        taskActivityTypeOptionNode4.setAttribute("selected", "selected");
    }
    taskActivityTypeOptionNode5.innerText = "Requirement";
    if (type === taskActivityTypeOptionNode5.innerText) {
        taskActivityTypeOptionNode5.setAttribute("selected", "selected");
    }
    taskActivityTypeOptionNode6.innerText = "Testing";
    if (type === taskActivityTypeOptionNode6.innerText) {
        taskActivityTypeOptionNode6.setAttribute("selected", "selected");
    }

    var removeTaskFieldNode = document.createElement("a");
    removeTaskFieldNode.setAttribute("onclick", "removeTaskFieldClickHandler(this)");
    removeTaskFieldNode.setAttribute("href", "#");
    removeTaskFieldNode.setAttribute("style", "margin-left:10px;");
    removeTaskFieldNode.setAttribute("class", "remove_task_field");
    removeTaskFieldNode.innerText = "Verwijder taak";

    var taskInputContainer = document.getElementsByClassName("tasks_input_fields_container_part")[0];

    taskInputContainer.appendChild(taskInputRowNode);

    taskInputRowNode.appendChild(taskNaamInputNode);
    taskInputRowNode.appendChild(taskActivityTypeSelectNode);

    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode1);
    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode2);
    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode3);
    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode4);
    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode5);
    taskActivityTypeSelectNode.appendChild(taskActivityTypeOptionNode6);

    taskInputRowNode.appendChild(removeTaskFieldNode);
    taskInputRowNode.appendChild(document.createElement("br"));
}

function removeDefaultTextHandler(focusedObject) {
    if (focusedObject.value === defaultTaskTitle || focusedObject.innerText === defaultTeamName) {
        focusedObject.value = "";
    }
    log();
}

function ConfigureTasks(teamnaam) {
    var substringVanaf = "tasks_".length;
    var parsedTeamnaam = teamnaam.substring(substringVanaf);

    log(parsedTeamnaam);

    openTasksModal();
}

function OpenTaskConfiguratieDialoog(teamNaam) {

    //var _taskConfirmBtn = document.getElementById('taskDialogConfirm');

    if (typeof tasksDialog.showModal === "function") {
        tasksDialog.showModal();
    } else {
        alert("The dialog API is not supported by this browser");
    }

    tasksDialog.addEventListener('close', function onClose() {
        log("closing teamsettings");
    });
}

function taskInpChangeHandler() {

    var t = document.getElementsByClassName('taskInputRow');

    UpdateTasksDocs(t);

    log();
}

function UpdateTasksDocs(tasks) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            log("Emptying task settings." + taskDocs.length + " settings will be removed.");

            //            var filtered = taskDocs;
            var added = false;

            var deletionPromises = [new Promise(function () { /*empty*/ })];

            taskDocs.forEach(
                function (element) {
                    deletionPromises.push(dataService.deleteDocument(TeamSettingsCollectionName, element.id));
                }
            );

            Promise.all(deletionPromises).then(function (service) {

                if (!added) {
                    AddTasksDocs(tasks, selectedTeam);
                    added = true;
                }
                //log("add here ? ")
            });

            // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden.
            if (!added) {
                AddTasksDocs(tasks, selectedTeam);
                added = true;
            }

            log("adding new doc- " + newDoc.taskId);

        });
        VSS.notifyLoadSucceeded();
    });

    //tasksDialog.close();
}

function AddTasksDocs(tasks, teamName) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        for (var i = 0; i < tasks.length; i++) {
            var taskRij = tasks[i];

            var taskTitle = taskRij.childNodes[0].value;
            var taskActivityType = taskRij.childNodes[1].value;
            var taskOwner = teamName;
            var taskId = taskOwner.toLowerCase() + taskTitle.toLowerCase().replace(/\s+/g, '');

            var newDoc = {
                type: "task",
                owner: taskOwner,
                title: taskTitle,
                taskid: taskId,
                activityType: taskActivityType
            };

            dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                log("created document : " + doc.text);
            });

            closeTasksModal();
            reloadHost();
        }
        VSS.notifyLoadSucceeded();
    });
}

function TeamSelectedHandler(obj) {
    selectedTeam = obj.value.toLowerCase(); //$(this).val();
    if (selectedTeam === undefined) {
        selectedTeam = GetTeamInAction();
    }

    LoadTeamTasks(selectedTeam);

    EnableBtn("voegTaskToe");
    EnableBtn("taskDialogConfirmBtn");

    log();
}

function EnableBtn(id) {
    document.getElementById(id).removeAttribute("disabled");
}

function CreateTeamSelectElementInitially() {

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            var x = 0;

            // only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
            log("Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings.");

            var teamSelectNode = document.getElementsByClassName("teamSelect")[0];

            teamDocs.forEach(
                function (element) {

                    var inputId = "teamNaam" + x;
                    x++;

                    var teamSelecectOption = document.createElement("option");
                    teamSelecectOption.setAttribute("class", "teamSelectOption");
                    teamSelecectOption.setAttribute("id", inputId);
                    teamSelecectOption.setAttribute("value", element.text);
                    teamSelecectOption.setAttribute("onchange", "TeamSelectedHandler(this)");
                    teamSelecectOption.innerText = element.text;

                    teamSelectNode.appendChild(teamSelecectOption);

                    addTeamHandler(element.text);
                }
            );

            VSS.notifyLoadSucceeded();
        });

        VSS.notifyLoadSucceeded();
    });
}

function LoadTeamTasks(selection) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            log(docs.length);
            var x = 0;

            if (selection === undefined) {
                selection = GetTeamInAction();
            }
            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });

            log("Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");

            var taskInputRowDivs = $('div.taskInputRow');
            taskInputRowDivs.remove();

            log('Build new list with ' + teamTasks.length + ' items.');

            teamTasks.forEach(
                function (element) {
                    addTaskToConfigurationHandler(element.title, element.activityType);
                }
            );
            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });
}

function LoadTasksOnMainWindow(teamnaam) {
    var parsedTeamnaam;
    if (teamnaam.startsWith("team_")) {
        var substringVanaf = "team_".length;
        parsedTeamnaam = teamnaam.substring(substringVanaf);
    }
    else { parsedTeamnaam = teamnaam; }

    SetTeamInAction(parsedTeamnaam);

    log("Registered team-naam-in-actie ");
    VSS.register("team-naam-in-actie", parsedTeamnaam);

    SetPageTitle(parsedTeamnaam);

    var taskFieldSet = document.getElementById("task-checkbox");

    // eerst alles verwijderen
    while (taskFieldSet.firstChild) {
        taskFieldSet.removeChild(taskFieldSet.firstChild);
    }

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            log(docs.length);
            var x = 0;

            // only team task setting. Not other settings or other tam tasks
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam.toLowerCase(); });

            // build up again
            teamTasks.forEach(
                function (element) {
                    var inputNode = document.createElement("input");
                    inputNode.setAttribute("type", "checkbox");
                    inputNode.setAttribute("id", element.id);
                    inputNode.setAttribute("value", element.activityType);
                    inputNode.setAttribute("checked", "true");
                    inputNode.setAttribute("name", "taskcheckbox");
                    inputNode.setAttribute("class", "checkbox");

                    var labelNode = document.createElement("label");
                    labelNode.setAttribute("for", element.id);
                    labelNode.setAttribute("class", "labelforcheckbox");
                    labelNode.innerHTML = element.title;

                    taskFieldSet.appendChild(inputNode);
                    taskFieldSet.appendChild(labelNode);
                    taskFieldSet.appendChild(document.createElement("br"));
                });

            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });
}

function SetPageTitle(teamnaam) {
    selectedTeam = teamnaam;
    var pageTitleText = "Workitem Manager for Team " + selectedTeam.charAt(0).toUpperCase() + selectedTeam.slice(1);
    document.getElementById("pageTitle").innerHTML = pageTitleText;
    log();
}

function CheckUnckeck(obj) {
    var tasks = document.getElementsByName("taskcheckbox");

    if (obj.checked) {
        tasks.forEach(function (element) {
            if (!element.checked) {
                element.toggleAttribute("checked");
            }
        });
    }
    else {
        tasks.forEach(function (element) {
            if (element.checked) {
                element.toggleAttribute("checked");
            }
        });
    }
    log();
}

function AddTasksButtonClicked(obj) {

    CheckAllowedToAddTaskToPbi(parentWorkItem);
    var taskCheckboxes = document.getElementsByName("taskcheckbox");
    var selectedCheckboxes = GetSelectedCheckboxes(taskCheckboxes);

    var tasksToPairWithWorkitem = CreateTasksToAdd(selectedCheckboxes);

    var jsonPatchDocs = CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);

    PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);

    LoadTasksOnMainWindow(selectedTeam);
    log();
}

var numberOfTasksHandled;

function PairTasksToWorkitem(docs, parent) {
    numberOfTasksHandled = 0;

    var container = $("#tasksContainer");

    var options = {
        //target: $("#tasksContainer"),
        //cancellable: true,
        //cancelTextFormat: "{0} to cancel",
        //cancelCallback: function () {
        //    console.log("cancelled");
        //}
    };

    var waitcontrol = controls.create(statusindicator.WaitControl, container, options);
    var client = vssService.getCollectionClient(wiTrackingClient.WorkItemTrackingHttpClient);

    waitcontrol.startWait();
    waitcontrol.setMessage("waiter waits.");

    var workItemPromises = [];

    docs.forEach(
        function (jsonPatchDoc) {
            numberOfTasksHandled++;
            workItemPromises.push(client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task"));
        }
    );

    Promise.all(workItemPromises).then(
        function () {
            var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
            alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");

            waitcontrol.endWait();

            VSS.notifyLoadSucceeded();
        }
    );

    log();
}

function CreateJsonPatchDocsForTasks(tasks) {
    var retval = [];

    tasks.forEach(function (element) {
        retval.push(
            new jsonPatchDoc(element).returnPatchDoc
        );
    });

    log();
    return retval;
}

function jsonPatchDoc(task) {

    this.returnPatchDoc = [
        {
            "op": Enm_JsonPatchOperations.Add,
            "path": Enm_WorkitemPaths.Title,
            "value": task.title
        },
        {
            "op": Enm_JsonPatchOperations.Add,
            "path": Enm_WorkitemPaths.IterationPath,
            "value": task.workItemIterationPath
        },
        {
            "op": Enm_JsonPatchOperations.Add,
            "path": Enm_WorkitemPaths.AreaPath,
            "value": task.workItemAreaPath
        },
        {
            "op": Enm_JsonPatchOperations.Add,
            "path": Enm_WorkitemPaths.TaskActivity,
            "value": task.workItemTaskActivity
        },
        {
            "op": Enm_JsonPatchOperations.Add,
            "path": Enm_WorkitemPaths.AllRelations,
            "value": {
                "rel": "System.LinkTypes.Hierarchy-Reverse",
                "url": parentWorkItem.url,
                "attributes": {
                    "comment": "todo: comment voor decompositie"
                }
            }
        }
    ];
    // available WorkITtemFields as a result
    // Microsoft.VSTS.Common.BacklogPriority: 1000031622
    // Microsoft.VSTS.Common.Severity: "3 - Medium"
    // Microsoft.VSTS.TCM.ReproSteps: "Reproductiestappen"
    // Microsoft.VSTS.TCM.SystemInfo: "sysinfo"
    // System.AreaPath: "WiM"
    // System.BoardColumn: "New"
    // System.BoardColumnDone: false
    // System.ChangedBy: "kry <KRYLP\kry>"
    // System.ChangedDate: "2017-12-30T19:55:20.99Z"
    // System.CommentCount: 0
    // System.CreatedBy: "kry <KRYLP\kry>"
    // System.CreatedDate: "2017-12-23T22:39:59.693Z"
    // System.IterationPath: "WiM"
    // System.Reason: "New defect reported"
    // System.State: "New"
    // System.TeamProject: "WiM"
    // System.Title: "Voorbeeld van een BUG met heeeeeeel vel tekst en allerlei andere dingetjes die te tekst uiteindelijk te lang maken zodat we het wrappen kunnen testen."
    // System.WorkItemType: "Bug"
    // WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column: "New"
    // WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done: false
    // dSZW.Socrates.TopDeskWijzigingNr: "W1245-5544"

    //return workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result;
    log();
}

function CreateTasksToAdd(selectedCheckboxes) {

    var retval = [];

    selectedCheckboxes.forEach(
        function (element) {
            var task = new workItem();
            task.title = element.Title;
            task.workItemType = "Task";
            task.workItemProjectName = parentWorkItem.workItemProjectName;
            task.workItemIterationPath = parentWorkItem.workItemIterationPath;
            task.workItemAreaPath = parentWorkItem.workItemAreaPath;
            task.workItemTaskActivity = element.ActivityType;

            retval.push(task);
        }
    );

    log();
    return retval;
}

function checkBoxInfo(title, activityType) {
    this.Title = title;
    this.ActivityType = activityType;
    log();
}

function GetSelectedCheckboxes(allCheckboxes) {
    var retval = [];
    allCheckboxes.forEach(
        function (element) {
            if (element.checked) {
                retval.push(
                    new checkBoxInfo(element.labels[0].innerText, element.value)
                );
            }
        }
    );

    log();
    return retval;
}

function SetTeamInAction(teamnaam) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.setValue("team-in-action", teamnaam).then(function () {
            console.log("SetTeamInAction(): Set team - " + teamnaam);
        });
    });

    log();
}

function GetTeamInAction() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getValue("team-in-action").then(function (value) {
            console.log("GetTeamInAction(): Retrieved team in action value - " + value);
            return value;
        });
    });

    log();
}
 
VSS.notifyLoadSucceeded();

//FirstTimeSetupData();
function FirstTimeSetupData() {
    //// First time setup code

    //DeleteAllSettings();
    //CreateTeams();

    //var allTasks = [
    //    { type: "task", owner: "xtreme",     title: "Kick-off",                             taskId: "xtremekickoff",                            activityType: "Requirements" },
    //    { type: "task", owner: "xtreme",     title: "UC/UCR",                               taskId: "xtremeucr",                                activityType: "Requirements" },
    //    { type: "task", owner: "xtreme",     title: "UC/UCR Review",                        taskId: "xtremeucrreview",                          activityType: "Requirements" },
    //    { type: "task", owner: "xtreme",     title: "Code",                                 taskId: "xtremecode",                               activityType: "Development" },
    //    { type: "task", owner: "xtreme",     title: "Code Review",                          taskId: "xtremecodereview",                         activityType: "Development" },
    //    { type: "task", owner: "xtreme",     title: "Test",                                 taskId: "xtremetest",                               activityType: "Testing" },
    //    { type: "task", owner: "xtreme",     title: "Test Review",                          taskId: "xtremetestreview",                         activityType: "Testing" },
    //    { type: "task", owner: "xtreme",     title: "Regressietests aanmaken/aanpassen",    taskId: "xtremeregressietestsaanmakenaanpassen",    activityType: "Testing" },
    //    { type: "task", owner: "xtreme",     title: "Wijzigingsverslag + Review",           taskId: "xtremewijzigingsverslagreview",            activityType: "Documentation" },
    //    { type: "task", owner: "xtreme",     title: "Releasenotes",                         taskId: "xtremereleasenotes",                       activityType: "Documentation" },
    //    { type: "task", owner: "xtreme",     title: "Reviewdocument",                       taskId: "xtremerevoewdcument",                      activityType: "Documentation" },
    //    { type: "task", owner: "xtreme",     title: "Stuurdata aanvragen",                  taskId: "xtremestuurdataaanvragen",                 activityType: "Development" },
    //    { type: "task", owner: "xtreme",     title: "Sonarmeldingen",                       taskId: "xtremesonarmeldingen",                     activityType: "Development" },
    //    { type: "task", owner: "committers", title: "Bouw",                                 taskId: "committersbouw",                           activityType: "Development" },
    //    { type: "task", owner: "committers", title: "Test",                                 taskId: "committerstest",                           activityType: "Testing" },
    //    { type: "task", owner: "committers", title: "Code Review",                          taskId: "committerscodereview",                     activityType: "Development" },
    //    { type: "task", owner: "committers", title: "Wijzigingsverslag",                    taskId: "committerswijzigingsverslag",              activityType: "Documentation" },
    //    { type: "task", owner: "committers", title: "Releasenotes",                         taskId: "committersreleasenotes",                   activityType: "Documentation" },
    //    { type: "task", owner: "committers", title: "DOD controle",                         taskId: "committersdodcontrole",                    activityType: "Requirements" },
    //    { type: "task", owner: "test",       title: "TestBouw",                             taskId: "testbouw",                                 activityType: "Development" },
    //    { type: "task", owner: "test",       title: "TestTest",                             taskId: "testtest",                                 activityType: "Testing" },
    //    { type: "task", owner: "test",       title: "TeestCode Review",                     taskId: "testcodereview",                           activityType: "Development" }
    //];

    //LoadAllTasksIntoConfig();

    //function LoadAllTasksIntoConfig() {
    //    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

    //        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
    //            // delete only tasks setting. Not other settings
    //            var taskDocs = docs.filter(function (d) { return d.type === 'task' });

    //            taskDocs.forEach(
    //                function (element) {

    //                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
    //                        console.log("LoadAllTasksIntoConfig(): Task docs verwijderd");
    //                    });
    //                }
    //            );

    //            allTasks.forEach(
    //                function (element) {
    //                    var newDoc = {
    //                        type: element.type,
    //                        owner: element.owner,
    //                        title: element.title,
    //                        taskid: element.taskId,
    //                        activityType: element.activityType
    //                    };

    //                    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(
    //                        function (doc) {
    //                            console.log("LoadAllTasksIntoConfig() CreateDocument : " + doc.id);
    //                        });

    //                    VSS.notifyLoadSucceeded();
    //                });


    //        });
    //    });

    //    VSS.notifyLoadSucceeded();
    //}
}

//////////////////////////////////////////////////////////////////////////////////////////
//////////////tasks //////////////////////////////////////////////////////////////////////
