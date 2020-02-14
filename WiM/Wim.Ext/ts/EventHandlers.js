var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { ViewHelper } from "./ViewHelper.js";
import { Logger } from "./Logger.js";
import { WimWorkItem } from "./wimworkitem.js";
import { WorkItemHelper } from "./workitemhelper.js";
import { CheckBoxInfo } from "./CheckBoxInfo.js";
import { JsonPatchDoc } from "./JsonPatchDoc.js";
import { WitTsClass } from "./witTs.js";
import { ModalHelper } from "./ModalHelper.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";
export class EventHandlers {
    constructor(vssWorkers) {
        this.vssWorkers = vssWorkers;
    }
    ExistingWitFieldFocussed() {
        var field = document.getElementById("existing-wit-id");
        if (field.value === "workitem ID") {
            field.value = "";
        }
    }
    OpenButtonClicked(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            new Logger().Log("this.vssWorkers.vssDataService ok", "" + this.vssWorkers);
            this.vssWorkers.parentWorkItem = null;
            this.vssWorkers.witClient = this.vssWorkers.vssWiTrackingClient.getClient();
            var witId = parseInt(document.getElementById("existing-wit-id").value);
            try {
                yield this.vssWorkers.witClient.getWorkItem(witId) // when only specific fields required , ["System.Title", "System.WorkItemType"])
                    .then((workitemResult) => {
                    new Logger().Log("workitemResult", "new");
                    this.vssWorkers.parentWorkItem = new WimWorkItem(workitemResult, null);
                    new ViewHelper(this.vssWorkers.vssDataService, this.vssWorkers.TeamSettingsCollectionName, this.vssWorkers.parentWorkItem, this.vssWorkers.defaultTeamName, this.vssWorkers.defaultTaskTitle).ShowSelectedWorkitemOnPage(this.vssWorkers.parentWorkItem);
                });
                if (this.vssWorkers.parentWorkItem === undefined || this.vssWorkers.parentWorkItem === null) {
                    new WorkItemHelper(this.vssWorkers.parentWorkItem).WorkItemNietGevonden();
                }
            }
            catch (e) {
                let exc = e;
                new WorkItemHelper(this.vssWorkers.parentWorkItem).WorkItemNietGevonden(exc);
            }
        });
    }
    MainPageEnterPressed(event) {
        new Logger().Log("EventHandelrs.MainEnterPressed", "Event received" + event);
        if (event.key === "Enter") {
            event.preventDefault();
            this.OpenButtonClicked(null);
        }
    }
    GetSelectedCheckboxes(allCheckboxes) {
        var retval = [];
        allCheckboxes.forEach(function (element) {
            if (element.checked) {
                retval.push(new CheckBoxInfo(element.labels[0].innerText, element.value));
            }
        });
        new Logger().Log("GetSelectedCheckboxes", "Selected checkboxes: " + retval.length);
        return retval;
    }
    CreateTasksToAdd(selectedCheckboxes) {
        var retval = [];
        selectedCheckboxes.forEach((element) => {
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
    CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];
        tasks.forEach((element) => {
            retval.push(new JsonPatchDoc(element, this.vssWorkers.parentWorkItem).Create() // this.jsonPatchDoc(element).returnPatchDoc
            );
        });
        new Logger().Log("CreateJsonPatchDocsForTasks", null);
        return retval;
    }
    PairTasksToWorkitem(docs, parent) {
        return __awaiter(this, void 0, void 0, function* () {
            new Logger().Log("EventHandlers.PairTasksToWorkitem", "Start pairing");
            let numberOfTasksHandled = 0;
            var container = $("#tasksContainer");
            var options = {
            //target: $("#tasksContainer"),
            //cancellable: true,
            //cancelTextFormat: "{0} to cancel",
            //cancelCallback: function () {
            //    console.this.log("cancelled");
            //}
            };
            var waitcontrol = yield this.vssWorkers.vssControls.create(this.vssWorkers.vssStatusindicator.WaitControl, container, options);
            var client = yield this.vssWorkers.vssService.getCollectionClient(this.vssWorkers.vssWiTrackingClient.WorkItemTrackingHttpClient);
            //var client = vssService.getCollectionClient(VssWitClient.WorkItemTrackingHttpClient);
            waitcontrol.startWait();
            waitcontrol.setMessage("waiter waits.");
            var workItemPromises = [];
            docs.forEach(function (jsonPatchDoc) {
                numberOfTasksHandled++;
                workItemPromises.push(client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task"));
                new Logger().Log("PairTasksToWorkitem", "Pairing task.");
            });
            yield Promise.all(workItemPromises).then(function () {
                var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
                alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");
                waitcontrol.endWait();
                VSS.notifyLoadSucceeded();
            });
            new Logger().Log("PairTasksToWorkitem", "Tasks pared.");
        });
    }
    AddTasksButtonClicked(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            var allowedToAdd = new WorkItemHelper(this.vssWorkers.parentWorkItem).CheckAllowedToAddTaskToPbi();
            var taskCheckboxes = document.getElementsByName("taskcheckbox");
            var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
            var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);
            var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
            this.PairTasksToWorkitem(jsonPatchDocs, this.vssWorkers.parentWorkItem);
            var team;
            yield this.GetTeamInAction().then(function (t) { team = t; });
            yield new ViewHelper(this.vssWorkers.vssDataService, this.vssWorkers.TeamSettingsCollectionName, this.vssWorkers.parentWorkItem, this.vssWorkers.defaultTeamName, this.vssWorkers.defaultTaskTitle).LoadTasksOnMainWindow(team);
            new Logger().Log("AddTasksButtonClicked", null);
        });
    }
    GetTeamInAction() {
        return __awaiter(this, void 0, void 0, function* () {
            let retval;
            let teamInAction = yield this.vssWorkers.vssDataService.getValue("team-in-action");
            new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);
            retval = teamInAction;
            return retval;
        });
    }
    TeamModalOKButtonClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            let witTs = new WitTsClass(this.vssWorkers);
            var teamsOnForm = document.getElementsByName("teamInpNaam");
            logger.Log("this.vssWorkers.vssDataService team ok", "" + this.vssWorkers);
            yield this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName).then((docs) => __awaiter(this, void 0, void 0, function* () {
                // delete only teams setting. Not other settings
                var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
                // always 1 element for at least 1 iteration in Promises.all
                var teamDeletionPromises = [];
                //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
                var added = false;
                teamDocs.forEach((element) => {
                    teamDeletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(this.vssWorkers.TeamSettingsCollectionName, element.id));
                });
                Promise.all(teamDeletionPromises).then((service) => __awaiter(this, void 0, void 0, function* () {
                    if (!added) {
                        logger.Log("teamInpChangeHandler", "Doc verwijderd");
                        yield witTs.AddTeamDocs(teamsOnForm);
                        added = true;
                    }
                }));
                // refactor this
                if (!added) {
                    logger.Log("teamInpChangeHandler", "Doc verwijderd");
                    yield witTs.AddTeamDocs(teamsOnForm);
                    added = true;
                }
            }));
            logger.Log("teamInpChangeHandler", "Finished");
            new ModalHelper().CloseTeamsModal();
            witTs.ReloadHost();
            VSS.notifyLoadSucceeded();
        });
    }
    TeamModalCancelButtonClicked() {
        new ModalHelper().CloseTeamsModal();
        new WitTsClass(this.vssWorkers).ReloadHost();
    }
    TeamModalAddTeamButtonClicked(name) {
        new ModalHelper().AddNewTeamInputRow(name, this.vssWorkers.defaultTeamName);
    }
    TeamModalRemoveTeamButtonClicked(clickedObj) {
        new ModalHelper().RemoveTeamInputRow(clickedObj);
    }
    RemoveDefaultText(focusedObject) {
        let obj = focusedObject;
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
        var t = document.getElementsByClassName('taskInputRow');
        var witTs = new WitTsClass(this.vssWorkers);
        witTs.UpdateTasksDocs(t);
        witTs.ReloadHost();
        new Logger().Log("TaskModalOKButtonClicked", null);
    }
    TeamSelectedHandler(obj) {
        this.vssWorkers.selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (this.vssWorkers.selectedTeam === undefined) {
            this.GetTeamInAction().then((v) => { this.vssWorkers.selectedTeam = v; });
        }
        let viewHelper = new ViewHelper(this.vssWorkers.vssDataService, this.vssWorkers.TeamSettingsCollectionName, this.vssWorkers.parentWorkItem, this.vssWorkers.defaultTeamName, this.vssWorkers.defaultTaskTitle);
        viewHelper.LoadTeamTasks(this.vssWorkers.selectedTeam);
        viewHelper.EnableBtn("voegTaskToe");
        viewHelper.EnableBtn("taskDialogConfirmBtn");
        new Logger().Log("TeamSelectedHandler", null);
    }
    CheckUncheckAllClicked(obj) {
        new CheckBoxHelper(this.vssWorkers.parentWorkItem).CheckUncheck(obj);
    }
}
