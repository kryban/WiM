import { Logger } from "./Logger.js";
export class ModalHelper {
    OpenTasksModal() { $('.modal_tasks').show(); }
    CloseTasksModal() { $('.modal_tasks').hide(); }
    OpenTeamsModal() { $('.modal_teams').show(); }
    CloseTeamsModal() { $('.modal_teams').hide(); }
    AddNewTeamInputRow(name, defaultTeamName) {
        var teamTitle = (name !== null && typeof name !== "undefined") ? name : defaultTeamName;
        var teamRowNode = document.createElement("div");
        var teamNaamInputNode = document.createElement("input");
        //teamNaamInputNode.setAttribute("onfocus", "new EventHandlers().RemoveDefaultText(this)");
        teamNaamInputNode.setAttribute("type", "text");
        teamNaamInputNode.setAttribute("value", teamTitle);
        teamNaamInputNode.setAttribute("name", "teamInpNaam");
        teamNaamInputNode.setAttribute("class", "teamNaamInput");
        var removeTeamFieldNode = document.createElement("a");
        //removeTeamFieldNode.setAttribute("onclick", "removeTeamFieldClickHandler(this)");
        removeTeamFieldNode.setAttribute("href", "#");
        removeTeamFieldNode.setAttribute("style", "margin-left:10px;");
        removeTeamFieldNode.setAttribute("class", "remove_field");
        removeTeamFieldNode.innerText = "Verwijder teamm";
        var teamInputContainer = document.getElementsByClassName("input_fields_container_part")[0];
        teamInputContainer.appendChild(teamRowNode);
        teamRowNode.appendChild(teamNaamInputNode);
        teamRowNode.appendChild(removeTeamFieldNode);
        teamRowNode.appendChild(document.createElement("br"));
    }
    RemoveTeamInputRow(obj) {
        obj.parentNode.remove();
        new Logger().Log("RemoveTeamInputRow", "Fields removed.");
    }
    AddNewTaskInputRow(title, type, defaultTaskTitle) {
        var taskTitle = (title !== null && typeof title !== "undefined") ? title : defaultTaskTitle;
        var taskInputRowNode = document.createElement("div");
        taskInputRowNode.setAttribute("class", "taskInputRow");
        var taskNaamInputNode = document.createElement("input");
        //taskNaamInputNode.setAttribute("onfocus", "RemoveDefaultText(this)");
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
    RemoveTaskInputRow(obj) {
        obj.parentNode.remove();
        new Logger().Log("RemoveTeamInputRow", "Fields removed.");
    }
}
