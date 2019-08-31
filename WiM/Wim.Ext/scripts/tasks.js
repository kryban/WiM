
//LoadAllTasksIntoConfig();

var allTasks = [
    { type: "task", owner: "xtreme", title: "Kick-off", id: "kickoff", activityType: "Requirements" },
    { type: "task", owner: "xtreme", title: "UC/UCR", id: "ucr", activityType: "Requirements" },
    { type: "task", owner: "xtreme", title: "UC/UCR Review", id: "ucrreview", activityType: "Requirements" },
    { type: "task", owner: "xtreme", title: "Code", id: "code", activityType: "Development" },
    { type: "task", owner: "xtreme", title: "Code Review", id: "codereview", activityType: "Development" },
    { type: "task", owner: "xtreme", title: "Test", id: "test", activityType: "Testing" },
    { type: "task", owner: "xtreme", title: "Test Review", id: "testreview", activityType: "Testing" },
    { type: "task", owner: "xtreme", title: "Regressietests aanmaken/aanpassen", id: "regressietestsaanmakenaanpassen", activityType: "Testing" },
    { type: "task", owner: "xtreme", title: "Wijzigingsverslag + Review", id: "wijzigingsverslagreview", activityType: "Documentation" },
    { type: "task", owner: "xtreme", title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { type: "task", owner: "xtreme", title: "Reviewdocument", id: "revoewdcument", activityType: "Documentation" },
    { type: "task", owner: "xtreme", title: "Stuurdata aanvragen", id: "stuurdataaanvragen", activityType: "Development" },
    { type: "task", owner: "xtreme", title: "Sonarmeldingen", id: "sonarmeldingen", activityType: "Development" },
    { type: "task", owner: "committers", title: "Bouw", id: "bouw", activityType: "Development" },
    { type: "task", owner: "committers", title: "Test", id: "test", activityType: "Testing" },
    { type: "task", owner: "committers", title: "Code Review", id: "codereview", activityType: "Development" },
    { type: "task", owner: "committers", title: "Wijzigingsverslag", id: "wijzigingsverslag", activityType: "Documentation" },
    { type: "task", owner: "committers", title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { type: "task", owner: "committers", title: "DOD controle", id: "dodcontrole", activityType: "Requirements" },
    { type: "task", owner: "test", title: "TestBouw", id: "bouw", activityType: "Development" },
    { type: "task", owner: "test", title: "TestTest", id: "test", activityType: "Testing" },
    { type: "task", owner: "test", title: "TEestCode Review", id: "codereview", activityType: "Development" }
];

function LoadAllTasksIntoConfig()
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task'});

            taskDocs.forEach(
                function (element) {

                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
                        console.log("LoadAllTasksIntoConfig(): Task docs verwijderd");
                    });
                }
            );

            allTasks.forEach(
                function (element) {
                    var newDoc = {
                        type: element.type,
                        owner: element.owner,
                        title: element.title,
                        id: element.taskId,
                        activityType: element.activityType
                    };

                    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(
                        function (doc)
                        {
                            console.log("LoadAllTasksIntoConfig() CreateDocument : " + doc.id);
                    });

                    VSS.notifyLoadSucceeded();
                });

         VSS.notifyLoadSucceeded();
        });
    });
}

//tasks_input_fields_container_part
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

function taskInpChangeHandler() {

    console.log('taskInpChangeHandler() : Started.');

    var c = document.getElementsByClassName('taskInputRow');

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });
            //var taskDocs = allTasks.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            taskDocs.forEach(
                function (element) {

                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
                        console.log("teamInpChangeHandler(): Task setting doc verwijderd");
                    });
                }
            );

            for (var i = 0; i < c.length; i++)
            {
                var taskRij = c[i];
 
                var taskTitle = taskRij.childNodes[0].value;
                var taskActivityType = taskRij.childNodes[1].value;
                var taskOwner = selectedTeam;
                var taskId = taskOwner.toLowerCase() + taskTitle.toLowerCase().replace(/\s+/g, '');

                console.log("taskInpChangeHandler() :" + taskDocs.length);

                var newDoc = {
                    type: "task",
                    owner: taskOwner,
                    title: taskTitle,
                    id: taskId,
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
        VSS.notifyLoadSucceeded();
    });

    console.log("teamInpChangeHandler() ended :");
}

function LoadTeamTasks()
{
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            console.log("GetAllTeamSettings :" + docs.length);
            var x = 0;

            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam.toLowerCase(); });
            //var teamTasks = allTasks.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });

            console.log("Initial load task settings : " + teamTasks.length + " out of " + allTasks.length + " settings.");

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
                        '<input onchange="taskInpChangeHandler()" type="text" class="taskNaamInput" name="taskInpNaam" id="' + inputId + '" value=" firstTimeRendered' + element.title + '" />' +
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

LoadTeamTasks();

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
            title: "Add new task "
            //width: 300
            , height: 500
            //, okText: "OK"
            , cancelText: "Annuleer"
            , getDialogResult: function () {
                // Get the result from registrationForm object
                //console.log("getDialogResult(): " + teamsForm);
            }
            , okCallback: function (result) {
                // Log the result to the console
                //console.log("okCallback(): ");//JSON.stringify(result));

                VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
                    // Reload whole page
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
                    }
                    );

                dialog.updateOkButton(true);

                VSS.notifyLoadSucceeded();
            }
        );
        VSS.notifyLoadSucceeded();
    });
}

var selectedTeam;

function LoadTasksOnMainWindow(teamnaam)
{
    var substringVanaf = "team_".length;
    var parsedTeamnaam = teamnaam.substring(substringVanaf);

    SetPageTitle(parsedTeamnaam);

    var taskFieldSet = document.getElementById("selectedTasks");

    // eerst alles verwijderen
    while (taskFieldSet.firstChild) {
        taskFieldSet.removeChild(taskFieldSet.firstChild);
    }

    //var breakNode = document.createElement("br");
    //var legendNode = document.createElement("legend");
    //legendNode.innerHTML = "Voeg taken toe";

    //taskFieldSet.appendChild(legendNode);
    //taskFieldSet.appendChild(breakNode);

    console.log("LoadTasks()");
    var teamTasks = allTasks.filter(function (x) { return x.owner === parsedTeamnaam; });

    // nu alles weer opbouwen
    teamTasks.forEach(
        function (element)
        {
            var inputNode = document.createElement("input");
            inputNode.setAttribute("type", "checkbox");
            inputNode.setAttribute("id", element.id);
            inputNode.setAttribute("value", element.id);
            inputNode.setAttribute("checked","true");
            inputNode.setAttribute("name", "taskcheckbox");
    
            var labelNode = document.createElement("label");
            labelNode.setAttribute("for", element.id);
            labelNode.innerHTML = element.title;
    
            taskFieldSet.appendChild(inputNode);
            taskFieldSet.appendChild(labelNode);
            taskFieldSet.appendChild(document.createElement("br"));
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

function SelectedTasksButtonClicked(obj) {

    var tasksForm = document.getElementsByName("taskcheckbox");
    var i = 0;

    var tasks = FindTeamTaskCollection();

    tasksForm.forEach(
        function (element) {
            if (element.checked) {
                i++;
                var task = FindTask(xtremeTasks, element);
                AddTaskToWorkitem(task);
            }
        }
    );

    OpenConfiguratieDialoog("Tasks added: " + i);
}

function FindTeamTaskCollection() {
    // todo
    // finsd tasks sets baes on teamname
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
    OpenConfiguratieDialoog("Adding task: " + task.title);
}

VSS.notifyLoadSucceeded();