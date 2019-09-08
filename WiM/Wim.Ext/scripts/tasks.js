
var selectedTeam;


$(document).ready(function () {

    console.log("document.Ready()");

    var max_fields_limit = 27;
    var x = 0;

    $('.voeg_task_toe').click(function (e) {
        e.preventDefault();
        if (x < max_fields_limit) {
            x++;
            var inputId = "taskNaam" + x;

            $('.tasks_input_fields_container_part').append(
                '<div class="taskInputRow">' +
                '<input onchange="taskInpChangeHandler()" type="text" class="taskNaamInput" name="taskInpNaam" id="' + inputId + '" value="... taskNaam ... "/>' +
                '<input onchange="taskInpChangeHandler()" type="text" class="taskActivityTypeInput" name="taskActivityType" id="' + inputId + '" value="... taskActivityType ... "/>' +
                '<a href="#" class="remove_task_field" style="margin-left:10px;">Verwijder taak</a>' +
                '</div>');
        }
    });

    $('.tasks_input_fields_container_part').on("click", ".remove_task_field", function (e) {
        e.preventDefault();
        $(this).parent('div').remove();
        //taskInpChangeHandler();
        x--;
    });

});

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

    console.log("teamInpChangeHandler() ended :");
}

function UpdateTasksDocs(tasks)
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            //var teamName = document.getElementById("teamSelect");
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

            // todo: refactor dit is nodig, zodat al er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden.
            if (!added) {
                AddTasksDocs(tasks, selectedTeam);
                added = true;
            }

            console.log("teamInpChangeHandler() : adding new doc - " + newDoc.taskId);

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

            console.log("teamInpChangeHandler() : adding new doc - " + newDoc.taskId);
        }
        VSS.notifyLoadSucceeded();
    });
}

function TeamSelectedHandler(obj) {
    selectedTeam = obj.value.toLowerCase();; //$(this).val();
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
                        '<a href="#" class="remove_task_field" style="margin-left:10px;">Verwijder taak</a>' +
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
    var substringVanaf = "team_".length;
    var parsedTeamnaam = teamnaam.substring(substringVanaf);

    GloballySetTeamInAction(parsedTeamnaam);

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
                    inputNode.setAttribute("value", element.id);
                    inputNode.setAttribute("checked", "true");
                    inputNode.setAttribute("name", "taskcheckbox");

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

    var taskCheckboxes = document.getElementsByName("taskcheckbox");
    var selectedCheckboxes = GetSelectedCheckboxes(taskCheckboxes);
    //var tasks = FindTeamTaskCollection();

    alert("Tasks added: " + selectedCheckboxes.length);
}

function GetSelectedCheckboxes(allCheckboxes) {
    var retval = [];
    allCheckboxes.forEach(
        function (element) {
            if (element.checked) {
                retval.push(element.labels[0].innerText);
                //AddTaskToWorkitem(task);
            }
        }
    );

    return retval;
}

function FindTask(tasks, selection) {

    var retval;

    tasks.forEach(
        function (element) {
            if (element.id === selection.id)
            {
                retval = element;
            }
        });

    return retval;
}

function AddTaskToWorkitem(task)
{
    alert("Adding task: " + task.title);
}

function GloballySetTeamInAction(teamnaam) {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.setValue("team-in-action", teamnaam).then(function () {
            console.log("GloballySetTeamInAction(): Set team - " + teamnaam);
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
