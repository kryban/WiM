var XtremeTasks =
    [
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

var CommittersTasks =
    [
        { title: "Bouw", id: "bouw", activityType: "Development" },
        { title: "Test", id: "test", activityType: "Testing" },
        { title: "Code Review", id: "codereview", activityType: "Development" },
        { title: "Wijzigingsverslag", id: "wijzigingsverslag", activityType: "Documentation" },
        { title: "Releasenotes", id: "releasenotes", activityType: "Documentation" },
        { title: "DOD controle", id: "dodcontrole", activityType: "Requirements" }
    ];

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
        inputNode.setAttribute("name", "checkedtasks");

        var labelNode = document.createElement("label");
        labelNode.setAttribute("for", element.id);
        labelNode.innerHTML = element.title;

        taskFieldSet.appendChild(inputNode);
        taskFieldSet.appendChild(labelNode);
        taskFieldSet.appendChild(document.createElement("br"));
    });
}

function ChangeSelected()
{
    var checkAllElement = document.getElementById("tasks-check-all-checkbox");
    var checked = checkAllElement.getAttribute("checked");

    if (checked)
    {
        //alert(checked);
    }
    else
    {
        //alert("unhecked");
    }
}

// default start
LoadTasks(XtremeTasks);

VSS.notifyLoadSucceeded();