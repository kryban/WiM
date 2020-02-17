import { ViewHelper } from "./ViewHelper.js";
import { VssWorkers } from "./VssWorkers.js";
import { Logger } from "./Logger.js";
import { WimWorkItem } from "./wimworkitem.js";
import { WorkItemHelper } from "./workitemhelper.js";
import { CheckBoxInfo } from "./CheckBoxInfo.js";
import { JsonPatchDoc } from "./JsonPatchDoc.js";
import { WitTsClass } from "./witTs.js";
import { ModalHelper } from "./ModalHelper.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";

export class EventHandlers {
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    ExistingWitFieldFocussed() {
        var field = document.getElementById("existing-wit-id") as HTMLInputElement;
        if (field.value === "workitem ID") {
            field.value = "";
        }
    }

    async OpenButtonClicked(obj) {

        new Logger().Log("this.vssWorkers.vssDataService ok", "" + this.vssWorkers);
        this.vssWorkers.parentWorkItem = null;
        this.vssWorkers.witClient = this.vssWorkers.vssWiTrackingClient.getClient();

        var witId = parseInt((document.getElementById("existing-wit-id") as HTMLInputElement).value);

        try {
            await this.vssWorkers.witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
                .then((workitemResult) => {
                    new Logger().Log("workitemResult", "new");
                    this.vssWorkers.parentWorkItem = new WimWorkItem(workitemResult, null);
                    new ViewHelper(this.vssWorkers).ShowSelectedWorkitemOnPage(this.vssWorkers.parentWorkItem);
                });

            if (this.vssWorkers.parentWorkItem === undefined || this.vssWorkers.parentWorkItem === null) {
                new WorkItemHelper(this.vssWorkers.parentWorkItem).WorkItemNietGevonden();
            }

        } catch (e) {
            let exc: Error = e;
            new WorkItemHelper(this.vssWorkers.parentWorkItem).WorkItemNietGevonden(exc);
        }
    }

    MainPageEnterPressed(event) {
        new Logger().Log("EventHandelrs.MainEnterPressed", "Event received" + event);
        if (event.key === "Enter") {
            event.preventDefault();
            this.OpenButtonClicked(null);
        }
    }

    private GetSelectedCheckboxes(allCheckboxes) {
        var retval = [];
        allCheckboxes.forEach(
            function (element) {
                if (element.checked) {
                    retval.push(
                        new CheckBoxInfo(element.labels[0].innerText, element.value)
                    );
                }
            }
        );

        new Logger().Log("GetSelectedCheckboxes", "Selected checkboxes: " + retval.length);
        return retval;
    }

    private CreateTasksToAdd(selectedCheckboxes) {
        var retval = [];

        selectedCheckboxes.forEach(
            (element) => {
                var task = new WimWorkItem(null, this.vssWorkers.parentWorkItem);
                task.title = element.title;
                task.workItemType = "Task";
                task.workItemProjectName = this.vssWorkers.parentWorkItem.workItemProjectName;
                task.workItemIterationPath = this.vssWorkers.parentWorkItem.workItemIterationPath;
                task.workItemAreaPath = this.vssWorkers.parentWorkItem.workItemAreaPath;
                task.workItemTaskActivity = element.activityType;
                retval.push(task);
            });

        new Logger().Log("CreateTasksToAdd", "Created tasks: " + retval.length);
        return retval;
    }

    private CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];

        tasks.forEach((element) => {
            retval.push(
                new JsonPatchDoc(element, this.vssWorkers.parentWorkItem).Create() // this.jsonPatchDoc(element).returnPatchDoc
            );
        });

        new Logger().Log("CreateJsonPatchDocsForTasks", null);
        return retval;
    }

    async PairTasksToWorkitem(docs, parent) {
        new Logger().Log("EventHandlers.PairTasksToWorkitem", "Start pairing");

        let numberOfTasksHandled: number = 0;

        var container = $("#tasksContainer");

        var options = {
            //target: $("#tasksContainer"),
            //cancellable: true,
            //cancelTextFormat: "{0} to cancel",
            //cancelCallback: function () {
            //    console.this.log("cancelled");
            //}
        };

        var waitcontrol = await this.vssWorkers.vssControls.create(this.vssWorkers.vssStatusindicator.WaitControl, container, options);
        var client = await this.vssWorkers.vssService.getCollectionClient(this.vssWorkers.vssWiTrackingClient.WorkItemTrackingHttpClient);
        //var client = vssService.getCollectionClient(VssWitClient.WorkItemTrackingHttpClient);

        waitcontrol.startWait();
        waitcontrol.setMessage("waiter waits.");

        var workItemPromises = [];

        docs.forEach(
            function (jsonPatchDoc) {
                numberOfTasksHandled++;
                workItemPromises.push(client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task"));
                new Logger().Log("PairTasksToWorkitem", "Pairing task.");
            }
        );

        await Promise.all(workItemPromises).then(
            function () {
                var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
                alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");

                waitcontrol.endWait();

                VSS.notifyLoadSucceeded();
            }
        );

        new Logger().Log("PairTasksToWorkitem", "Tasks pared.");
    }

    async AddTasksButtonClicked(obj) {
        var allowedToAdd = new WorkItemHelper(this.vssWorkers.parentWorkItem).CheckAllowedToAddTaskToPbi();
        var taskCheckboxes = document.getElementsByName("taskcheckbox");
        var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
        var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);

        var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);

        this.PairTasksToWorkitem(jsonPatchDocs, this.vssWorkers.parentWorkItem);

        var team;
        await this.GetTeamInAction().then(function (t) { team = t; });

        await new ViewHelper(this.vssWorkers).LoadTasksOnMainWindow(team);
        new Logger().Log("AddTasksButtonClicked", null);
    }

    async GetTeamInAction(): Promise<string> {
        let retval: string
        let teamInAction = await this.vssWorkers.vssDataService.getValue("team-in-action");
        new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);

        retval = teamInAction as string;
        return retval;
    }

    async TeamModalOKButtonClicked() {
        let witTs = new WitTsClass(this.vssWorkers);
        var teamsOnForm = document.getElementsByName("teamInpNaam");
        await witTs.UpdateTeamDocs(witTs, teamsOnForm);
        witTs.ReloadHost();

        new Logger().Log("TeamModalOKButtonClicked", null);
    }

    TeamModalCancelButtonClicked() {
        new ModalHelper().CloseTeamsModal();
        new WitTsClass(this.vssWorkers).ReloadHost();
    }

    TeamModalAddTeamButtonClicked(name: string) {
        new ModalHelper().AddNewTeamInputRow(name, this.vssWorkers.defaultTeamName);
    }

    TeamModalRemoveTeamButtonClicked(clickedObj) {
        new ModalHelper().RemoveTeamInputRow(clickedObj);
    }

    RemoveDefaultText(focusedObject) {
        let obj = <HTMLInputElement>focusedObject
        if (obj.value === this.vssWorkers.defaultTaskTitle || obj.value === this.vssWorkers.defaultTeamName) {
            obj.value = "";
        }
        new Logger().Log("RemoveDefaultText", null);
    }

    TaskModalCancelButtonClicked() {
        new ModalHelper().CloseTasksModal();
        new WitTsClass(this.vssWorkers).ReloadHost();
    }

    TaskModalAddTaskButtonClicked() {
        new ModalHelper().AddNewTaskInputRow(null, null, this.vssWorkers.defaultTaskTitle);
    }

    TaskModalRemoveTaskButtonClicked(clickedObj) {
        new ModalHelper().RemoveTaskInputRow(clickedObj);
    }

    TaskModalOKButtonClicked() {
        var witTs = new WitTsClass(this.vssWorkers);
        var tasksOnForm = document.getElementsByClassName('taskInputRow');
        witTs.UpdateTasksDocs(tasksOnForm);
        witTs.ReloadHost();

        new Logger().Log("TaskModalOKButtonClicked", null);
    }

    TeamSelectedHandler(obj) {
        this.vssWorkers.selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (this.vssWorkers.selectedTeam === undefined) {
            this.GetTeamInAction().then((v) => { this.vssWorkers.selectedTeam = v; });
        }

        let viewHelper = new ViewHelper(this.vssWorkers);

        viewHelper.LoadTeamTasks(this.vssWorkers.selectedTeam);
        viewHelper.EnableBtn("voegTaskToe");
        viewHelper.EnableBtn("taskDialogConfirmBtn");

        new Logger().Log("TeamSelectedHandler", null);
    }

    CheckUncheckAllClicked(obj) {
        new CheckBoxHelper(this.vssWorkers.parentWorkItem).CheckUncheck(obj);
    }
}