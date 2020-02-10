/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.sdk.d.ts" />
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Logger } from "./Logger.js";
import { ModalHelper } from "./ModalHelper.js";
import { ServiceHelper } from "./ServiceHelper.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";
import { ButtonHelper } from "./ButtonHelper.js";
import { ViewHelper } from "./ViewHelper.js";
import { MenuBuilder } from "./MenuBuilder.js";
import { EventHandlers } from "./EventHandlers.js";
//import { VssService } from "VSS/Service.js";
const TeamSettingsCollectionName = "WimCollection";
const defaultTaskTitle = "Taak titel";
const defaultTeamName = "Team naam";
var parentWorkItem;
var witClient;
var selectedTeam;
var vssControls;
var vssStatusindicator;
var vssService;
var vssWiTrackingClient;
var vssMenus;
var vssDataService;
var eventHandlers;
//class EventHandlers
//{
//    ExistingWitFieldFocussed() {
//        var field = document.getElementById("existing-wit-id") as HTMLInputElement;
//        if (field.value === "workitem ID") {
//            field.value = "";
//        }
//    }
//    async OpenButtonClicked(obj) {
//        parentWorkItem = null;
//        witClient = vssWiTrackingClient.getClient();
//        var witId = parseInt((document.getElementById("existing-wit-id") as HTMLInputElement).value);
//        try {
//            await witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
//                .then(function (workitemResult) {
//                    new Logger().Log("workitemResult", "new");
//                    parentWorkItem = new WimWorkItem(workitemResult, null);
//                    new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).ShowSelectedWorkitemOnPage(parentWorkItem);
//                });
//            if (parentWorkItem === undefined || parentWorkItem === null) {
//                new WorkItemHelper(parentWorkItem).WorkItemNietGevonden();
//            }
//        } catch (e) {
//            let exc: Error = e;
//            new WorkItemHelper(parentWorkItem).WorkItemNietGevonden(e);
//        }
//    }
//    MainPageEnterPressed(event) {
//        new Logger().Log("EventHandelrs.MainEnterPressed", "Event received" + event);
//        if (event.key === "Enter") {
//            event.preventDefault();
//            this.OpenButtonClicked(null);
//        }
//    }
//    private GetSelectedCheckboxes(allCheckboxes) {
//        var retval = [];
//        allCheckboxes.forEach(
//            function (element) {
//                if (element.checked) {
//                    retval.push(
//                        new CheckBoxInfo(element.labels[0].innerText, element.value)
//                    );
//                }
//            }
//        );
//        new Logger().Log("GetSelectedCheckboxes", "Selected checkboxes: " + retval.length);
//        return retval;
//    }
//    private CreateTasksToAdd(selectedCheckboxes) {
//        var retval = [];
//        selectedCheckboxes.forEach(
//            function (element) {
//                var task = new WimWorkItem(null, parentWorkItem);
//                task.title = element.title;
//                task.workItemType = "Task";
//                task.workItemProjectName = parentWorkItem.workItemProjectName;
//                task.workItemIterationPath = parentWorkItem.workItemIterationPath;
//                task.workItemAreaPath = parentWorkItem.workItemAreaPath;
//                task.workItemTaskActivity = element.activityType;
//                retval.push(task);
//            });
//        new Logger().Log("CreateTasksToAdd", "Created tasks: " + retval.length);
//        return retval;
//    }
//    private CreateJsonPatchDocsForTasks(tasks) {
//        var retval = [];
//        tasks.forEach(function (element) {
//            retval.push(
//                new JsonPatchDoc(element, parentWorkItem).Create() // this.jsonPatchDoc(element).returnPatchDoc
//            );
//        });
//        new Logger().Log("CreateJsonPatchDocsForTasks", null);
//        return retval;
//    }
//    async PairTasksToWorkitem(docs, parent) {
//        new Logger().Log("EventHandlers.PairTasksToWorkitem", "Start pairing");
//        let numberOfTasksHandled: number = 0;
//        var container = $("#tasksContainer");
//        var options = {
//            //target: $("#tasksContainer"),
//            //cancellable: true,
//            //cancelTextFormat: "{0} to cancel",
//            //cancelCallback: function () {
//            //    console.this.log("cancelled");
//            //}
//        };
//        var waitcontrol = await vssControls.create(vssStatusindicator.WaitControl, container, options);
//        var client = await vssService.getCollectionClient(vssWiTrackingClient.WorkItemTrackingHttpClient);
//        //var client = vssService.getCollectionClient(VssWitClient.WorkItemTrackingHttpClient);
//        waitcontrol.startWait();
//        waitcontrol.setMessage("waiter waits.");
//        var workItemPromises = [];
//        docs.forEach(
//            function (jsonPatchDoc) {
//                numberOfTasksHandled++;
//                workItemPromises.push(client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task"));
//                new Logger().Log("PairTasksToWorkitem", "Pairing task.");
//            }
//        );
//        await Promise.all(workItemPromises).then(
//            function () {
//                var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
//                alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");
//                waitcontrol.endWait();
//                VSS.notifyLoadSucceeded();
//            }
//        );
//        new Logger().Log("PairTasksToWorkitem", "Tasks pared.");
//    }
//    async AddTasksButtonClicked(obj) {
//        var allowedToAdd = new WorkItemHelper(parentWorkItem).CheckAllowedToAddTaskToPbi();
//        var taskCheckboxes = document.getElementsByName("taskcheckbox");
//        var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
//        var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);
//        var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
//        this.PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);
//        var team;
//        await this.GetTeamInAction().then(function (t) { team = t; });
//        await new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).LoadTasksOnMainWindow(team);
//        new Logger().Log("AddTasksButtonClicked", null);
//    }
//    async GetTeamInAction(): Promise<string> {
//        let retval: string
//        let teamInAction = await vssDataService.getValue("team-in-action");
//        new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);
//        retval = teamInAction as string;
//        return retval;
//    }
//    async TeamModalOKButtonClicked() {
//        let logger = new Logger();
//        var teamsOnForm = document.getElementsByName("teamInpNaam");
//        await vssDataService.getDocuments(TeamSettingsCollectionName).then(async function (docs) {
//            // delete only teams setting. Not other settings
//            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
//            // always 1 element for at least 1 iteration in Promises.all
//            var teamDeletionPromises: IPromise<void>[] = [];
//            //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
//            var added = false;
//            teamDocs.forEach(
//                function (element) {
//                    teamDeletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
//                }
//            );
//            let witTs = new WitTsClass();
//            Promise.all(teamDeletionPromises).then(async function (service) {
//                if (!added) {
//                    logger.Log("teamInpChangeHandler", "Doc verwijderd");
//                    await witTs.AddTeamDocs(teamsOnForm, vssDataService);
//                }
//            });
//            // refactor this
//            if (!added) {
//                logger.Log("teamInpChangeHandler", "Doc verwijderd");
//                await witTs.AddTeamDocs(teamsOnForm, this.vssDataService);
//            }
//        });
//        logger.Log("teamInpChangeHandler", "Finished");
//        new ModalHelper().CloseTeamsModal();
//        VSS.notifyLoadSucceeded();
//    }
//    TeamModalCancelButtonClicked() {
//        new ModalHelper().CloseTeamsModal();
//        new WitTsClass().ReloadHost();
//    }
//    TeamModalAddTeamButtonClicked(name: string) {
//        new ModalHelper().AddNewTeamInputRow(name, defaultTeamName);
//    }
//    TeamModalRemoveTeamButtonClicked(clickedObj) {
//        new ModalHelper().RemoveTeamInputRow(clickedObj);
//    }
//    RemoveDefaultText(focusedObject) {
//        let obj = <HTMLInputElement>focusedObject
//        if (obj.value === defaultTaskTitle || obj.value === defaultTeamName) {
//            obj.value = "";
//        }
//        new Logger().Log("RemoveDefaultText", null);
//    }
//    TaskModalCancelButtonClicked() {
//        new ModalHelper().CloseTasksModal();
//        new WitTsClass().ReloadHost();
//    }
//    TaskModalAddTaskButtonClicked() {
//        new ModalHelper().AddNewTaskInputRow(null, null, defaultTaskTitle);
//    }
//    TaskModalRemoveTaskButtonClicked(clickedObj) {
//        new ModalHelper().RemoveTaskInputRow(clickedObj);
//    }
//    TaskModalOKButtonClicked() {
//        var t = document.getElementsByClassName('taskInputRow');
//        new WitTsClass().UpdateTasksDocs(t);
//        new Logger().Log("TaskModalOKButtonClicked", null);
//    }
//    TeamSelectedHandler(obj) {
//        selectedTeam = obj.value.toLowerCase(); //$(this).val();
//        if (selectedTeam === undefined) {
//            this.GetTeamInAction().then(function (v) { this.selectedTeam = v; });
//        }
//        let viewHelper = new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle);
//        viewHelper.LoadTeamTasks(selectedTeam);
//        viewHelper.EnableBtn("voegTaskToe");
//        viewHelper.EnableBtn("taskDialogConfirmBtn");
//        new Logger().Log("TeamSelectedHandler", null);
//    }
//    CheckUncheckAllClicked(obj) {
//        new CheckBoxHelper(parentWorkItem).CheckUncheck(obj);
//    }
//}
class PreLoader {
    constructor(parentWorkItem, vssWiTrackingClient, vssDataService, TeamSettingsCollectionName, defaultTeamName, defaultTaskTitle, vssControls, vssStatusindicator, vssService) {
        this.parentWorkItem = parentWorkItem;
        this.vssWiTrackingClient = vssWiTrackingClient;
        this.vssDataService = vssDataService;
        this.TeamSettingsCollectionName = TeamSettingsCollectionName;
        this.defaultTeamName = defaultTeamName;
        this.defaultTaskTitle = defaultTaskTitle;
        this.vssControls = vssControls;
        this.vssStatusindicator = vssStatusindicator;
        this.vssService = vssService;
    }
    RegisterEvents() {
        var eventHandlers = new EventHandlers(this.parentWorkItem, this.vssWiTrackingClient, this.vssDataService, this.TeamSettingsCollectionName, this.defaultTeamName, this.defaultTaskTitle, this.vssControls, this.vssStatusindicator, this.vssService);
        new Logger().Log("PreLoader.RegisterEvents", "Registering events");
        $("#existing-wit-id").focus(eventHandlers.ExistingWitFieldFocussed);
        $("#existing-wit-id").keypress(function (e) { eventHandlers.MainPageEnterPressed(e); });
        $("#existing-wit-button").click(function (e) { eventHandlers.OpenButtonClicked(e); });
        $("#addTasksButton").click(function (e) { eventHandlers.AddTasksButtonClicked(e); });
        $("#tasks-check-all-checkbox").click(function (e) { eventHandlers.CheckUncheckAllClicked(e.target); });
        //
        $("#teamDialogCancelBtn").click(eventHandlers.TeamModalCancelButtonClicked);
        $("#teamDialogConfirmBtn").click(function (e) { eventHandlers.TeamModalOKButtonClicked(e, vssDataService, TeamSettingsCollectionName); });
        $("#voegTeamToe").click(function (e) { eventHandlers.TeamModalAddTeamButtonClicked(e.value); });
        $("#taskDialogCancelBtn").click(eventHandlers.TaskModalCancelButtonClicked);
        $("#taskDialogConfirmBtn").click(eventHandlers.TaskModalOKButtonClicked);
        $("#voegTaskToe").click(eventHandlers.TaskModalAddTaskButtonClicked);
        // event delegation because elements are created dynamically 
        $(".input_fields_container_part").on("click", ".remove_field", function (e) { eventHandlers.TeamModalRemoveTeamButtonClicked(e.target); });
        $(".input_fields_container_part").on("focus", ".teamNaamInput", function (e) { eventHandlers.RemoveDefaultText(e.target); });
        $(".tasks_input_fields_container_part").on("click", ".remove_task_field", function (e) { eventHandlers.TaskModalRemoveTaskButtonClicked(e.target); });
        $(".tasks_input_fields_container_part").on("focus", ".taskNaamInput", function (e) { eventHandlers.RemoveDefaultText(e.target); });
        $(".teamSelect").change(function (e) { eventHandlers.TeamSelectedHandler(e.target); });
        new Logger().Log("PreLoader.RegisterEvents", "All events registered");
    }
    FindCollection() {
        let logger = new Logger();
        logger.Log("FindCollection", "3: " + vssDataService);
        vssDataService.getDocuments(TeamSettingsCollectionName)
            .then(function (docs) {
            if (docs.length < 1) {
                this.CreateFirstTimeCollection();
            }
            this.log("FindCollection", "Number of docs found: " + docs.length);
        }, // on reject
        function (err) {
            this.CreateFirstTimeCollection();
            this.log("FindCollection", "Nothing found. Default Created.");
        });
        logger.Log("FindCollection", "Found");
    }
    CreateFirstTimeCollection() {
        let logger = new Logger();
        logger.Log("CreateFirstTimeCollection", "4: " + vssDataService);
        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };
        vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            this.log("CreateFirstTimeCollection", "Default document created: " + doc.text);
        });
        logger.Log("CreateFirstTimeCollection", "Done");
    }
    CreateDefaultSettingsWhenEmpty() {
        try {
            this.FindCollection();
        }
        catch (e) {
            this.CreateFirstTimeCollection();
        }
    }
    LoadPreState() {
        let modalHelper = new ModalHelper();
        if (document.readyState == "complete") {
            var name = window.location.pathname.split('/').slice(-1);
            new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
            new ButtonHelper(parentWorkItem).DisableAddButton();
            //this.registerTasksModelButtonEvents(modalHelper);
            //this.registerTeamsModelButtonEvents(modalHelper);
            this.LoadRequired();
            new Logger().Log("window.onload", "DocumentReady:" + name);
        }
    }
    LoadPreConditions(window) {
        return __awaiter(this, void 0, void 0, function* () {
            var name = window.location.pathname.split('/').slice(-1);
            let modalHelper = new ModalHelper();
            new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
            new ButtonHelper(parentWorkItem).DisableAddButton();
            //this.registerTasksModelButtonEvents(modalHelper);
            //this.registerTeamsModelButtonEvents(modalHelper);
            yield this.LoadRequired();
            new Logger().Log("window.onload", "DocumentReady:" + name);
        });
    }
    LoadRequired() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            logger.Log("LoadRequired()", "Begin of LoadRequired()");
            //VSS.ready(async function (){
            yield VSS.require(["VSS/Controls", "VSS/Controls/StatusIndicator", "VSS/Service", "TFS/WorkItemTracking/RestClient", "VSS/Controls/Menus"], function (c, i, s, r, m) {
                return __awaiter(this, void 0, void 0, function* () {
                    vssControls = c;
                    vssStatusindicator = i;
                    vssService = s;
                    vssWiTrackingClient = r;
                    vssMenus = m;
                    logger.Log("LoadRequired", "Required vssControls: " + vssControls);
                    logger.Log("LoadRequired", "Required vssStatusIndicator: " + vssStatusindicator);
                    logger.Log("LoadRequired", "Required vssService: " + vssService);
                    logger.Log("LoadRequired", "Required vssWiTrackingClient: " + vssWiTrackingClient);
                    logger.Log("LoadRequired", "Required vssMenus: " + vssMenus);
                    vssDataService = yield new ServiceHelper().GetDataService();
                    yield new MenuBuilder(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).BuildMenu(vssControls, vssMenus);
                    new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).CreateTeamSelectElementInitially();
                    eventHandlers = new EventHandlers(parentWorkItem, vssWiTrackingClient, vssDataService, TeamSettingsCollectionName, defaultTeamName, defaultTaskTitle, vssControls, vssStatusindicator, vssService);
                    VSS.notifyLoadSucceeded();
                });
            });
            //});
        });
    }
}
export class WitTsClass {
    UpdateTasksDocs(tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                return __awaiter(this, void 0, void 0, function* () {
                    // delete only tasks setting. Not other settings
                    var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });
                    let logger = new Logger();
                    logger.Log("UpdateTasksDocs", "Emptying task settings." + taskDocs.length + " settings will be removed.");
                    var added = false;
                    var deletionPromises = [];
                    //deletionPromises.push(new Promise(function () { /*empty*/ }));
                    taskDocs.forEach(function (element) {
                        deletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
                        logger.Log("UpdateTasksDocs", "Created promise for deletion");
                    });
                    let curr = this;
                    yield Promise.all(deletionPromises).then(function (s) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (!added) {
                                new WitTsClass().AddTasksDocs(tasks, selectedTeam);
                                added = true;
                            }
                            logger.Log("UpdateTasksDocs", "Tasks updated");
                        });
                    });
                    // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
                    // dan toch nog toevoegingen uitgevoerd worden
                    if (!added) {
                        yield curr.AddTasksDocs(tasks, selectedTeam);
                        added = true;
                    }
                    logger.Log("UpdateTasksDocs", "adding new doc "); // + newDoc.taskId);
                });
            });
            VSS.notifyLoadSucceeded();
        });
    }
    AddTasksDocs(tasks, teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            for (var i = 0; i < tasks.length; i++) {
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
                yield vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                    new Logger().Log("AddTasksDocs", "created document : " + doc.text);
                });
                new ModalHelper().CloseTasksModal();
                this.ReloadHost();
            }
        });
    }
    AddTeamDocs(teamsCollection, dataService) {
        let logger = new Logger();
        for (var i = 0; i < teamsCollection.length; i++) {
            var teamnaam = teamsCollection[i].value;
            logger.Log("AddTeamDocs", teamnaam);
            var newDoc = {
                type: "team",
                text: teamnaam
            };
            dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                this.log("AddTeamDocs", doc.text);
            });
            logger.Log("AddTeamDocs", "Team Setting Added: " + teamnaam);
            this.ReloadHost();
        }
    }
    ReloadHost() {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            console.log("navigationService.reload()");
            navigationService.reload();
        });
        new Logger().Log("reloadHost", null);
    }
    GetWorkItemTypes(callback) {
        VSS.require(["TFS/WorkItemTracking/RestClient"], function (_restWitClient) {
            witClient = _restWitClient.getClient();
            witClient.getWorkItemTypes(VSS.getWebContext().project.name)
                .then(function () {
                callback();
            });
        });
    }
}
window.onload = function () {
    return __awaiter(this, void 0, void 0, function* () {
        let preloader = new PreLoader(parentWorkItem, vssWiTrackingClient, vssDataService, TeamSettingsCollectionName, defaultTeamName, defaultTaskTitle, vssControls, vssStatusindicator, vssService);
        yield preloader.LoadPreConditions(window);
        yield preloader.RegisterEvents();
    });
};
