
//todo: refactor naar nette objecten
var xtremeTasks = [
    { title: "Kick-off", id: "kickoff", activityType: "Requirements" },
    { title: "UC/UCR", id: "ucr", activityType: "Requirements" },
    { title: "UC/UCR Review", id: "ucrreview", activityType: "Requirements" },
    { title: "Code", id: "code", activityType: "Development" },
    { title: "Code Review", id: "codereview", activityType: "Development" },
    { title: "Test", id: "test", activityType: "Testing" },
    { title: "Test Review", id: "testreview", activityType: "Testing" },
    { title: "Regressietests aanmaken/aanpassen", id: "regressietestsaanmakenaanpassen", activityType: "Testing" },
    { title: "Wijzigingsverslag + Review", id: "wijzigingsverslagreview", activityType: "Documentation" },
    { title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { title: "Reviewdocument", id: "revoewdcument", activityType: "Documentation" },
    { title: "Stuurdata aanvragen", id: "stuurdataaanvragen", activityType: "Development" },
    { title: "Sonarmeldingen", id: "sonarmeldingen", activityType: "Development" }
];

var committersTasks = [
    { title: "Bouw", id: "bouw", activityType: "Development" },
    { title: "Test", id: "test", activityType: "Testing" },
    { title: "Code Review", id: "codereview", activityType: "Development" },
    { title: "Wijzigingsverslag", id: "wijzigingsverslag", activityType: "Documentation" },
    { title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { title: "DOD controle", id: "dodcontrole", activityType: "Requirements" }
];

var testTasks = [
    { title: "TestBouw", id: "bouw", activityType: "Development" },
    { title: "TestTest", id: "test", activityType: "Testing" },
    { title: "TEestCode Review", id: "codereview", activityType: "Development" }
]

var selectedTeam;

function LoadTasks(tasks, teamnaam)
{
    SetPageTitle(teamnaam);

    var taskFieldSet = document.getElementById("selectedTasks");

    while (taskFieldSet.firstChild) {
        taskFieldSet.removeChild(taskFieldSet.firstChild);
    }

    //var breakNode = document.createElement("br");
    //var legendNode = document.createElement("legend");
    //legendNode.innerHTML = "Voeg taken toe";

    //taskFieldSet.appendChild(legendNode);
    //taskFieldSet.appendChild(breakNode);

    tasks.forEach(function (element)
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

// default start
LoadTasks(xtremeTasks, "xtreme");

VSS.notifyLoadSucceeded();