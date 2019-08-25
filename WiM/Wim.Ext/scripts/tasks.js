
//todo: refactor naar nette objecten

var allTasks = [
    { owner: "xtreme", title: "Kick-off", id: "kickoff", activityType: "Requirements" },
    { owner: "xtreme", title: "UC/UCR", id: "ucr", activityType: "Requirements" },
    { owner: "xtreme", title: "UC/UCR Review", id: "ucrreview", activityType: "Requirements" },
    { owner: "xtreme", title: "Code", id: "code", activityType: "Development" },
    { owner: "xtreme", title: "Code Review", id: "codereview", activityType: "Development" },
    { owner: "xtreme", title: "Test", id: "test", activityType: "Testing" },
    { owner: "xtreme", title: "Test Review", id: "testreview", activityType: "Testing" },
    { owner: "xtreme", title: "Regressietests aanmaken/aanpassen", id: "regressietestsaanmakenaanpassen", activityType: "Testing" },
    { owner: "xtreme", title: "Wijzigingsverslag + Review", id: "wijzigingsverslagreview", activityType: "Documentation" },
    { owner: "xtreme", title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { owner: "xtreme", title: "Reviewdocument", id: "revoewdcument", activityType: "Documentation" },
    { owner: "xtreme", title: "Stuurdata aanvragen", id: "stuurdataaanvragen", activityType: "Development" },
    { owner: "xtreme", title: "Sonarmeldingen", id: "sonarmeldingen", activityType: "Development" },
    { owner: "committers", title: "Bouw", id: "bouw", activityType: "Development" },
    { owner: "committers", title: "Test", id: "test", activityType: "Testing" },
    { owner: "committers", title: "Code Review", id: "codereview", activityType: "Development" },
    { owner: "committers", title: "Wijzigingsverslag", id: "wijzigingsverslag", activityType: "Documentation" },
    { owner: "committers", title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
    { owner: "committers", title: "DOD controle", id: "dodcontrole", activityType: "Requirements" },
    { owner: "test", title: "TestBouw", id: "bouw", activityType: "Development" },
    { owner: "test", title: "TestTest", id: "test", activityType: "Testing" },
    { owner: "test", title: "TEestCode Review", id: "codereview", activityType: "Development" }
];

var selectedTeam;

function LoadTasks(teamnaam)
{
    var substringVanaf = "team_".length;
    var parsedTeamnaam = teamnaam.substring(substringVanaf);

    SetPageTitle(parsedTeamnaam);

    var taskFieldSet = document.getElementById("selectedTasks");

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

// default start
LoadTasks("team_xtreme");

VSS.notifyLoadSucceeded();