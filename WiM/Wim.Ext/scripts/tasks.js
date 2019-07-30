var XtremeTasks = new Map();
XtremeTasks.set("kickoff", { title: "Kick-off", id: "kickoff", activityType: "Requirements" });
XtremeTasks.set("ucr", { title: "UC/UCR", id: "ucr", activityType: "Requirements" });
XtremeTasks.set("ucrreview", { title: "UC/UCR Review", id: "ucrreview", activityType: "Requirements" });
XtremeTasks.set("code", { title: "Code", id: "code", activityType: "Development" });
XtremeTasks.set("codereview", { title: "Code Review", id: "codereview", activityType: "Development" });
XtremeTasks.set("test", { title: "Test", id: "test", activityType: "Testing" });
XtremeTasks.set("testreview", { title: "Test Review", id: "testreview", activityType: "Testing" });
XtremeTasks.set("regressietestsaanmakenaanpassen", { title: "Regressietests aanmaken/aanpassen", id: "regressietestsaanmakenaanpassen", activityType: "Testing" });
XtremeTasks.set("wijzigingsverslagreview", { title: "Wijzigingsverslag + Review", id: "wijzigingsverslagreview", activityType: "Documentation" });
XtremeTasks.set("releasenotes", { title: "Releasenotes", id: "releasenotes", activityType: "Documentation" });
XtremeTasks.set("revoewdcument", { title: "Reviewdocument", id: "revoewdcument", activityType: "Documentation" });
XtremeTasks.set("stuurdataaanvragen", { title: "Stuurdata aanvragen", id: "stuurdataaanvragen", activityType: "Development" });
XtremeTasks.set("sonarmeldingen", { title: "Sonarmeldingen", id: "sonarmeldingen", activityType: "Development" });

var CommittersTasks = new Map();
CommittersTasks.set("bouw", { title: "Bouw", id: "bouw", activityType: "Development" });
CommittersTasks.set("test", { title: "Test", id: "test", activityType: "Testing" });
CommittersTasks.set("codereview", { title: "Code Review", id: "codereview", activityType: "Development" });
CommittersTasks.set("wijzigingsverslag", { title: "Wijzigingsverslag", id: "wijzigingsverslag", activityType: "Documentation" });
CommittersTasks.set("releasenotes", { title: "Releasenotes", id: "releasenotes", activityType: "Documentation" });
CommittersTasks.set("dodcontrole", { title: "DOD controle", id: "dodcontrole", activityType: "Requirements" });

var testTasks = new Map();
testTasks.set("bouw", { title: "TestBouw", id: "bouw", activityType: "Development" });
testTasks.set("test",{ title: "TestTest", id: "test", activityType: "Testing" });
testTasks.set("codereview",{ title: "TEestCode Review", id: "codereview", activityType: "Development" });

function LoadTasksObject(testTasks) {
    var taskFieldSet = document.getElementById("selectedTasks");

    while (taskFieldSet.firstChild)
    {
        taskFieldSet.removeChild(taskFieldSet.firstChild);
    }

    testTasks.forEach(function (element) {
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
}

function LoadTasks(tasks)
{
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

    tasksForm.forEach(
        function (element) {
            if (element.checked) {
                i++;
                AddTaskToWorkitem();
            }
        }
    );

    OpenConfiguratieDialoog("Selected tasks button clicked. " + i);
}

function AddTaskToWorkitem()
{

}

// default start
LoadTasks(XtremeTasks);

VSS.notifyLoadSucceeded();