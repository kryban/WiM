
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


document.addEventListener('DOMContentLoaded', function (event) {
    console.log("document.Ready()");

    ////arbitrary maximum
    //var max_teamfields_limit = 7;
    //var t = 0;

    //var addTeam = document.getElementById('voegTeamToe');
    //if (addTeam !== null) {
    //    addTeam.onclick =
    //        function (e) {
    //            e.preventDefault();
    //            if (t < max_teamfields_limit) {
    //                alert("hoi");
    //                t++;
    //                var inputId = "teamNaam" + t;

    //                $('.input_fields_container_part').append(
    //                    '<div>' +
    //                    '<input onchange="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId + '" value="... teamnaam ... "/>' +
    //                    '<a href="#" onclick="removeFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijderrr</a>' +
    //                    '</div>');
    //            }
    //        };
    //}

    //var removeLinks = document.getElementsByClassName('removeField');
    //if (removeLinks !== null) {
    //    removeLinks.forEach(function (element) {
    //        element.onclick =
    //            function (e) {
    //                e.preventDefault();
    //                $(this).parent('div').remove();
    //                teamInpChangeHandler();
    //                x--;
    //            };
    //    });
    //}

    //$('.input_fields_container_part').on("click", ".remove_field", function (e) {
    //    e.preventDefault();
    //    $(this).parent('div').remove();
    //    teamInpChangeHandler();
    //    x--;
    //});

    //var max_taskfields_limit = 27;
    //x = 0;

    //var addTasks = document.getElementById('voegTaskToe');
    //if (addTasks !== null) {
    //    addTasks.onclick =
    //        function (e) {
    //            e.preventDefault();
    //            if (x < max_taskfields_limit) {
    //                x++;
    //                var inputId = "taskNaam" + x;

    //                $('.tasks_input_fields_container_part').append(
    //                    '<div class="taskInputRow">' +
    //                    '<input onchange="taskInpChangeHandler()" type="text" class="taskNaamInput" name="taskInpNaam" id="' + inputId + '" value="... taskNaam ... "/>' +
    //                    '<input onchange="taskInpChangeHandler()" type="text" class="taskActivityTypeInput" name="taskActivityType" id="' + inputId + '" value="... taskActivityType ... "/>' +
    //                    '<a href="#" onclick="removeFieldClickHandler(this)" class="remove_task_field" style="margin-left:10px;">Verwijder taak</a>' +
    //                    '</div>');
    //            }
    //        };
    //}

    //var removeTasks = document.getElementById('removeTaskField');
    //if (removeTasks !== null) {
    //    removeTasks.forEach(function (element) {
    //        element.onclick =
    //            function (e) {
    //                e.preventDefault();
    //                $(this).parent('div').remove();
    //                taskInpChangeHandler();
    //                x--;
    //            };
    //        }
    //    );
    //}

    ////////////////
    //var max_fields_limit = 8; //set limit for maximum input fields
    //var i = 1; //initialize counter for text box
    //$('.add_more_button').click(function (e) { //click event on add more fields button having class add_more_button
    //    e.preventDefault();
    //    if (i < max_fields_limit) { //check conditions
    //        i++; //counter increment
    //        //$('.input_fields_container_part').append('<div><input type="text" name="tags"/><a href="#" class="remove_field" style="margin-left:10px;">Remove</a></div>'); //add input field
    //        $('.input_fields_container_part').append(
    //            '<div>' +
    //            '<input type="text" name="taskTitle"/>' +
    //            '<input type="text" name="taskId"/>' +
    //            '<input type="text" name="taskActivityType"/>' +
    //            '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
    //            '</div>'); //add input field
    //    }
    //});
    //$('.input_fields_container_part').on("click", ".remove_field", function (e) { //user click on remove text links
    //    e.preventDefault(); $(this).parent('div').remove(); i--;
    //});
    ////////////////

    var checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    var addButton = document.getElementById("addTasksButton");


    if (checkBoxes !== null && addButton !== null &&
        (parentWorkItem === undefined || parentWorkItem === null)) {
        DisableItems(checkBoxes, addButton);
    }
});

function removeTeamFieldClickHandler(obj) {

    if (obj !== null) {
        while (obj.parentNode !== null && obj.parentNode.firstChild) {
            obj.parentNode.removeChild(obj.parentNode.firstChild);
        }
    }
    teamInpChangeHandler();
    //x--;

}

function removeTaskFieldClickHandler(obj) {

    if (obj !== null) {
        while (obj.parentNode !== null && obj.parentNode.firstChild) {
            obj.parentNode.removeChild(obj.parentNode.firstChild);
        }
    }
    taskInpChangeHandler();
    //x--;

}

function addTaskToConfigurationHandler(obj) {

    var max_taskfields_limit = 27;
    x = 0;
    alert("foo");
    if (x < max_taskfields_limit) {
        x++;
        var inputId = "taskNaam" + x;

        $('.tasks_input_fields_container_part').append(
            '<div class="taskInputRow">' +
            '<input onchange="taskInpChangeHandler()" type="text" class="taskNaamInput" name="taskInpNaam" id="' + inputId + '" value="... taskNaam ... "/>' +
            '<input onchange="taskInpChangeHandler()" type="text" class="taskActivityTypeInput" name="taskActivityType" id="' + inputId + '" value="... taskActivityType ... "/>' +
            '<a href="#" onclick="removeTaskFieldClickHandler(this)" class="remove_task_field" style="margin-left:10px;">Verwijder taak</a>' +
            '</div>');
    }
}

function ConfigureTasks(teamnaam) {
    var substringVanaf = "tasks_".length;
    var parsedTeamnaam = teamnaam.substring(substringVanaf);
    console.log("LoadTaskManagementDialog() : " + parsedTeamnaam);

    OpenTaskConfiguratieDialoog(parsedTeamnaam);
}

function OpenTaskConfiguratieDialoog(teamNaam) {

    VSS.getService(VSS.ServiceIds.Dialog).then(function (dialogService) {

        // Build absolute contribution ID for dialogContent
        var extensionCtx = VSS.getExtensionContext();
        var contributionId = extensionCtx.publisherId + "." + extensionCtx.extensionId + ".manage-tasks";

        // Show dialog
        var dialogOptions = {
            title: "Manage tasks"
            , height: 400
            , modal: true
            , cancelText: "Annuleer"
            , getDialogResult: function () {
                //console.log("getDialogResult(): " + teamsForm);
            }
            , okCallback: function (result) {
                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    console.log("navigationService.reload()");
                    navigationService.reload();
                });
            }
        };

        dialogService.openDialog(contributionId, dialogOptions).then(
            function (dialog) {

                dialog
                    .getContributionInstance("Bandik.WimDevOpExtension.manage-tasks")
                    .then(function (manageTeamsinstance) {
                        teamsForm = manageTeamsinstance;
                    });

                dialog.updateOkButton(true);

                VSS.notifyLoadSucceeded();
            }
        );
        VSS.notifyLoadSucceeded();
    });
}

function taskInpChangeHandler() {

    console.log('taskInpChangeHandler() : Started.');

    var t = document.getElementsByClassName('taskInputRow');

    UpdateTasksDocs(t);

    console.log("taskInpChangeHandler() ended :");
}

function UpdateTasksDocs(tasks)
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });
            //var taskDocs = allTasks.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            console.log("teamInpChangeHandler(): Emptying task settings." + taskDocs.length + " settings will be removed.");

//            var filtered = taskDocs;
            var added = false;

            taskDocs.forEach(
                function (element) {
                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {

                        if (!added) {
                            AddTasksDocs(tasks, selectedTeam);
                            added = true;
                        }
                    });
                }
            );

            // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden.
            if (!added) {
                AddTasksDocs(tasks, selectedTeam);
                added = true;
            }

            console.log("taskInpChangeHandler() : adding new doc - " + newDoc.taskId);

        });
        VSS.notifyLoadSucceeded();
    });

}

function AddTasksDocs(tasks, teamName)
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        for (var i = 0; i < tasks.length; i++)
        {
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
                // Even if no ID was passed to createDocument, one will be generated
                console.log("teamInpChangeHandler() CreateDocument : " + doc.text);
            });

            console.log("taskInpChangeHandler() : adding new doc - " + newDoc.taskId);
        }
        VSS.notifyLoadSucceeded();
    });
}

function TeamSelectedHandler(obj) {
    selectedTeam = obj.value.toLowerCase(); //$(this).val();
    if (selectedTeam === undefined) {
        selectedTeam = GetTeamInAction();
    }
    console.log('TeamSelectedHandler() clicked: ' + selectedTeam);
    LoadTeamTasks(selectedTeam);
    console.log('LoadTeamTasks();');
}

function CreateTeamSelectElementInitially() {

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            var x = 0;

            // only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
            console.log("Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings.");

            teamDocs.forEach(
                function (element) {

                    var inputId = "teamNaam" + x;
                    x++;

                    $('#teamSelect').append(
                        '<option class="teamSelectOption" id="' + inputId + '" value="' + element.text + '" onchange="TeamSelectedHandler(this)">' + element.text + '</option>'
                    );
                }
            );

            VSS.notifyLoadSucceeded();
        });

        VSS.notifyLoadSucceeded();
    });

}

function LoadTeamTasks(selection)
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            console.log("LoadTeamTasks() : " + docs.length);
            var x = 0;

            if (selection === undefined) {
                selection = GetTeamInAction();
            }
            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });
            //var teamTasks = allTasks.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            console.log("Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");

            console.log('LoadTeamTasks() : Empty current tasks list.');

            var taskInputRowDivs = $('div.taskInputRow');
            taskInputRowDivs.remove();
            
            console.log('LoadTeamTasks() : Build new list with ' + teamTasks.length + ' items.');

            teamTasks.forEach(
                function (element) {
                    var inputId = "teamNaam" + x;
                    x++;

                    $('.tasks_input_fields_container_part').append(
                        '<div class="taskInputRow">' +
                        '<input onchange="taskInpChangeHandler()" type="text" class="taskNaamInput" name="taskInpNaam" id="' + inputId + '" value="' + element.title + '" />' +
                        '<input onchange="taskInpChangeHandler()" type="text" class="taskActivityTypeInput" name="taskActivityType" id="' + inputId + '" value="' + element.activityType + '" />' +
                        '<a href="#" onclick="removeTaskFieldClickHandler(this)" class="remove_task_field" style="margin-left:10px;">Verwijder taak</a>' +
                        '</div>');
                }
            );
            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });
}

function LoadTasksOnMainWindow(teamnaam)
{
    var parsedTeamnaam;
    if (teamnaam.startsWith("team_")) {
        var substringVanaf = "team_".length;
        parsedTeamnaam = teamnaam.substring(substringVanaf);
    }
    else { parsedTeamnaam = teamnaam;}

    SetTeamInAction(parsedTeamnaam);

    console.log("LoadTaskOnMainWindow(): Registered team-naam-in-actie ");
    VSS.register("team-naam-in-actie", parsedTeamnaam);

    SetPageTitle(parsedTeamnaam);

    var taskFieldSet = document.getElementById("task-checkbox");

    // eerst alles verwijderen
    while (taskFieldSet.firstChild) {
        taskFieldSet.removeChild(taskFieldSet.firstChild);
    }

    //var breakNode = document.createElement("br");
    //var legendNode = document.createElement("legend");
    //legendNode.innerHTML = "Voeg taken toe";

    //taskFieldSet.appendChild(legendNode);
    //taskFieldSet.appendChild(breakNode);

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            console.log("LoadTeamTasks() : " + docs.length);
            var x = 0;

            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam.toLowerCase(); });
            //var teamTasks = allTasks.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            console.log("LoadTasks()");

            // nu alles weer opbouwen
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
}

function CheckUnckeck(obj)
{
    var tasks = document.getElementsByName("taskcheckbox");

    if (obj.checked)
    {
        tasks.forEach(function (element) {
            if (!element.checked)
            {
                element.toggleAttribute("checked");
            }
        });
    }
    else
    {
        tasks.forEach(function (element) {
            if (element.checked) {
                element.toggleAttribute("checked");
            }
        });
    }
}

function AddTasksButtonClicked(obj) {

    CheckAllowedToAddTaskToPbi(parentWorkItem);
    var taskCheckboxes = document.getElementsByName("taskcheckbox");
    var selectedCheckboxes = GetSelectedCheckboxes(taskCheckboxes);
    //var tasks = FindTeamTaskCollection();

    var tasksToPairWithWorkitem = CreateTasksToAdd(selectedCheckboxes);

    var jsonPatchDocs = CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);

    PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);

    LoadTasksOnMainWindow(selectedTeam);
}

function reloadHost() {
    VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
        console.log("navigationService.reload()");
        navigationService.reload();
    });
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

    require(["VSS/Controls", "VSS/Controls/StatusIndicator"], function (Controls, StatusIndicator) {

    var waitcontrol = Controls.create(StatusIndicator.WaitControl, container, options);

    waitcontrol.startWait();
    waitcontrol.setMessage("waiter waits.");

    docs.forEach(
        function (jsonPatchDoc) {
            var client;
            
            require(["TFS/WorkItemTracking/Services", "TFS/WorkItemTracking/RestClient", "VSS/Service"],
                function (_WorkItemServices, _WorkItemTrackingClient, _Service, Controls, StatusIndicator) {
                        client = _Service.getCollectionClient(_WorkItemTrackingClient.WorkItemTrackingHttpClient);

                    client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task").then(function (wi) {

                            numberOfTasksHandled++;

                            if (numberOfTasksHandled === docs.length) {

                                var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
                                alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");

                                waitcontrol.endWait();

                                VSS.notifyLoadSucceeded();
                            }
                    });
                });

        });

    });
}



function CreateJsonPatchDocsForTasks(tasks) {
    var retval = [];

    tasks.forEach(function (element) {
        retval.push(
            new jsonPatchDoc(element).returnPatchDoc
        );
    });

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

    return retval;
}

function checkBoxInfo(title, activityType) {
    this.Title = title;
    this.ActivityType = activityType;
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

    return retval;
}

//function FindTask(tasks, selection) {

//    var retval;

//    tasks.forEach(
//        function (element) {
//            if (element.id === selection.id)
//            {
//                retval = element;
//            }
//        });

//    return retval;
//}

//function AddTaskToWorkitem(task)
//{
//    alert("Adding task: " + task.title);
//}

function SetTeamInAction(teamnaam) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.setValue("team-in-action", teamnaam).then(function () {
            console.log("SetTeamInAction(): Set team - " + teamnaam);
        });
    });      
}

function GetTeamInAction() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getValue("team-in-action").then(function (value) {
            console.log("GetTeamInAction(): Retrieved team in action value - " + value);
            return value;
        });
    });
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
