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
import { JsonPatchDoc } from "./JsonPatchDoc.js";
import { WimWorkItem } from "./WimWorkItem.js";
import { CheckBoxInfo } from "./CheckBoxInfo.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";
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
class ViewHelper {
    constructor(dataService) {
        this.dataservice = dataService;
    }
    SetTeamInAction(teamnaam, dService) {
        dService.setValue("team-in-action", teamnaam).then(function () {
            return __awaiter(this, void 0, void 0, function* () {
                new Logger().Log("SetTeamInAction,", "Set team - " + teamnaam);
                let teamInAction = yield dService.getValue("team-in-action");
                new Logger().Log("SetTeamInAction", "team-in-action is now: " + teamInAction);
            });
        });
    }
    ;
    SetPageTitle(teamname) {
        const constantTitle = "Workitem Manager ";
        let teamNameToPresent = teamname.charAt(0).toUpperCase() + teamname.slice(1);
        let pageTitleText = constantTitle + "for team " + teamNameToPresent;
        document.getElementById("pageTitle").innerHTML = pageTitleText;
        new Logger().Log("SetPageTitle", "Selected team: " + teamname + " - Presented team: " + teamNameToPresent);
    }
    ConfigureTeams(command) {
        new ModalHelper().OpenTeamsModal();
    }
    ConfigureTasks(teamnaam) {
        var substringVanaf = "tasks_".length;
        var parsedTeamnaam = teamnaam.substring(substringVanaf);
        new Logger().Log("ConfigureTasks", parsedTeamnaam);
        new ModalHelper().OpenTasksModal();
    }
    DeleteTeamSettings(docs, dservice) {
        docs.forEach(function (doc) {
            new Logger().Log("DeleteTeamSettings", doc.id + " " + doc.text);
            if (dservice !== null) {
                dservice.deleteDocument(TeamSettingsCollectionName, doc.id).then(function () {
                    this.log("DeleteTeamSettings", "Doc verwijderd");
                    VSS.notifyLoadSucceeded();
                });
            }
            dservice.deleteDocument(TeamSettingsCollectionName, doc.id).then(function () {
                this.log("DeleteTeamSettings", "Doc verwijderddd");
            });
        });
    }
    GetTeamSettingsToDelete(dataService) {
        new Logger().Log("SetToDefault", "DeleteAllettings()");
        var retval;
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.this.log("There are " + docs.length + " in the collection.");
            docs.forEach(function (element) {
                retval.push(element);
            });
        });
        return retval;
    }
    SetTeamSettingsNew(dService, teamName) {
        return __awaiter(this, void 0, void 0, function* () {
            new Logger().Log("SetTeamSettingsNew", teamName);
            var newDoc = {
                type: "team",
                text: teamName
            };
            yield dService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                this.log("SetTeamSettingsNew", doc.text);
            });
            VSS.notifyLoadSucceeded();
        });
    }
    CreateTeams(dataService) {
        new Logger().Log("CreateTeams", "executing");
        this.SetTeamSettingsNew(dataService, "Xtreme");
        this.SetTeamSettingsNew(dataService, "Committers");
        this.SetTeamSettingsNew(dataService, "Test");
        this.SetTeamSettingsNew(dataService, "NieuweTest");
        new Logger().Log("CreateTeams", "executed.");
    }
    SetToDefault() {
        if (window.confirm("Alle instellingen terugzetten naar standaard instellingen?")) {
            var teamsettingsToDelete = this.GetTeamSettingsToDelete(this.dataservice);
            this.DeleteTeamSettings(teamsettingsToDelete, this.dataservice);
            this.CreateTeams(this.dataservice);
        }
    }
    CreateTeamSelectElementInitially() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            logger.Log("CreateTeamSelectElementInitially", "Received dataservice: " + this.dataservice);
            this.dataservice.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                var x = 0;
                // only teams setting. Not other settings
                var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
                logger.Log("CreateTeamSelectElementInitially", "Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings.");
                var teamSelectNode = document.getElementsByClassName("teamSelect")[0];
                teamDocs.forEach(function (element) {
                    var inputId = "teamNaam" + x;
                    x++;
                    var teamSelecectOption = document.createElement("option");
                    teamSelecectOption.setAttribute("class", "teamSelectOption");
                    teamSelecectOption.setAttribute("id", inputId);
                    teamSelecectOption.setAttribute("value", element.text);
                    //teamSelecectOption.setAttribute("onchange", "new EventHandlers().TeamSelectedHandler(this)");
                    teamSelecectOption.innerText = element.text;
                    teamSelectNode.appendChild(teamSelecectOption);
                    var teamTitle = (element.text !== null && typeof element.text !== "undefined") ? element.text : defaultTeamName;
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
                });
                VSS.notifyLoadSucceeded();
            });
            logger.Log("CreateTeamSelectElementInitially", "Done loading teams.");
        });
    }
    ShowSelectedWorkitemOnPage(workItem) {
        var allowToAdd = new WorkItemHelper().CheckAllowedToAddTaskToPbi(workItem);
        if (!allowToAdd) {
            document.getElementById("existing-wit-text").className = "existing-wit-text-not";
            document.getElementById("existing-wit-text").innerHTML =
                "Aan een " + workItem.workItemType + " mag geen Task toegevoegd worden." +
                    "</br> " +
                    "(" + workItem.id + ")" + workItem.title;
            new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
            new ButtonHelper().DisableAddButton();
        }
        else {
            document.getElementById("existing-wit-text").className = "existing-wit-text";
            document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;
            new CheckBoxHelper(parentWorkItem).EnableCheckBoxes();
            new ButtonHelper().EnableAddButton();
        }
        VSS.notifyLoadSucceeded();
    }
    EnableBtn(id) {
        document.getElementById(id).removeAttribute("disabled");
    }
    LoadTasksOnMainWindow(teamnaam) {
        return __awaiter(this, void 0, void 0, function* () {
            let parsedTeamnaam;
            if (teamnaam.startsWith("team_")) {
                var substringVanaf = "team_".length;
                parsedTeamnaam = teamnaam.substring(substringVanaf);
            }
            else {
                parsedTeamnaam = teamnaam;
            }
            this.SetTeamInAction(parsedTeamnaam, this.dataservice);
            new Logger().Log("LoadTasksOnMainWindow", "Registered team-naam-in-actie ");
            VSS.register("team-naam-in-actie", parsedTeamnaam);
            this.SetPageTitle(parsedTeamnaam);
            var taskFieldSet = document.getElementById("task-checkbox");
            // first remove all 
            while (taskFieldSet.firstChild) {
                taskFieldSet.removeChild(taskFieldSet.firstChild);
            }
            var foo;
            yield vssDataService.getDocuments(TeamSettingsCollectionName).then(function (dcs) { foo = dcs; });
            yield vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                new Logger().Log("LoadTasksOnMainWindow", docs.length);
                // only team task setting. Not other settings or other tam tasks
                var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === parsedTeamnaam.toLowerCase(); });
                // build up again
                teamTasks.forEach(function (element) {
                    var inputNode = document.createElement("input");
                    inputNode.setAttribute("type", "checkbox");
                    inputNode.setAttribute("id", element.id);
                    inputNode.setAttribute("value", element.activityType);
                    inputNode.setAttribute("checked", "true");
                    inputNode.setAttribute("name", "taskcheckbox");
                    inputNode.setAttribute("class", "checkbox");
                    var labelNode = document.createElement("label");
                    labelNode.setAttribute("for", element.id);
                    labelNode.setAttribute("class", "labelforcheckbox");
                    labelNode.innerHTML = element.title;
                    taskFieldSet.appendChild(inputNode);
                    taskFieldSet.appendChild(labelNode);
                    taskFieldSet.appendChild(document.createElement("br"));
                });
            });
            VSS.notifyLoadSucceeded();
        });
    }
    LoadTeamTasks(selection) {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            let logger = new Logger();
            logger.Log("LoadTeamTasks", docs.length);
            var x = 0;
            if (selection === undefined) {
                selection = new EventHandlers().GetTeamInAction();
            }
            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });
            logger.Log("LoadTeamTasks", "Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");
            var taskInputRowDivs = $('div.taskInputRow');
            taskInputRowDivs.remove();
            logger.Log("LoadTeamTasks", 'Build new list with ' + teamTasks.length + ' items.');
            var modalHelper = new ModalHelper();
            teamTasks.forEach(function (element) {
                modalHelper.AddNewTaskInputRow(element.title, element.activityType, defaultTaskTitle);
            });
            VSS.notifyLoadSucceeded();
        });
    }
}
class EventHandlers {
    ExistingWitFieldFocussed() {
        var field = document.getElementById("existing-wit-id");
        if (field.value === "workitem ID") {
            field.value = "";
        }
    }
    OpenButtonClicked(obj) {
        return __awaiter(this, void 0, void 0, function* () {
            parentWorkItem = null;
            witClient = vssWiTrackingClient.getClient();
            var witId = parseInt(document.getElementById("existing-wit-id").value);
            try {
                yield witClient.getWorkItem(witId) // when only specific fields required , ["System.Title", "System.WorkItemType"])
                    .then(function (workitemResult) {
                    new Logger().Log("workitemResult", "new");
                    parentWorkItem = new WimWorkItem(workitemResult, null);
                    new ViewHelper(vssDataService).ShowSelectedWorkitemOnPage(parentWorkItem);
                });
                if (parentWorkItem === undefined || parentWorkItem === null) {
                    new WorkItemHelper().WorkItemNietGevonden();
                }
            }
            catch (e) {
                let exc = e;
                new WorkItemHelper().WorkItemNietGevonden(e);
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
        selectedCheckboxes.forEach(function (element) {
            var task = new WimWorkItem(null, parentWorkItem);
            task.title = element.title;
            task.workItemType = "Task";
            task.workItemProjectName = parentWorkItem.workItemProjectName;
            task.workItemIterationPath = parentWorkItem.workItemIterationPath;
            task.workItemAreaPath = parentWorkItem.workItemAreaPath;
            task.workItemTaskActivity = element.activityType;
            retval.push(task);
        });
        new Logger().Log("CreateTasksToAdd", "Created tasks: " + retval.length);
        return retval;
    }
    CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];
        tasks.forEach(function (element) {
            retval.push(new JsonPatchDoc(element, parentWorkItem).Create() // this.jsonPatchDoc(element).returnPatchDoc
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
            var waitcontrol = yield vssControls.create(vssStatusindicator.WaitControl, container, options);
            var client = yield vssService.getCollectionClient(vssWiTrackingClient.WorkItemTrackingHttpClient);
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
            var allowedToAdd = new WorkItemHelper().CheckAllowedToAddTaskToPbi(parentWorkItem);
            var taskCheckboxes = document.getElementsByName("taskcheckbox");
            var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
            var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);
            var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
            this.PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);
            var team;
            yield this.GetTeamInAction().then(function (t) { team = t; });
            yield new ViewHelper(vssDataService).LoadTasksOnMainWindow(team);
            new Logger().Log("AddTasksButtonClicked", null);
        });
    }
    GetTeamInAction() {
        return __awaiter(this, void 0, void 0, function* () {
            let retval;
            let teamInAction = yield vssDataService.getValue("team-in-action");
            new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);
            retval = teamInAction;
            return retval;
        });
    }
    TeamModalOKButtonClicked() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            var teamsOnForm = document.getElementsByName("teamInpNaam");
            yield vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                return __awaiter(this, void 0, void 0, function* () {
                    // delete only teams setting. Not other settings
                    var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
                    // always 1 element for at least 1 iteration in Promises.all
                    var teamDeletionPromises = [];
                    //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
                    var added = false;
                    teamDocs.forEach(function (element) {
                        teamDeletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
                    });
                    let witTs = new WitTsClass();
                    Promise.all(teamDeletionPromises).then(function (service) {
                        return __awaiter(this, void 0, void 0, function* () {
                            if (!added) {
                                logger.Log("teamInpChangeHandler", "Doc verwijderd");
                                yield witTs.AddTeamDocs(teamsOnForm, vssDataService);
                            }
                        });
                    });
                    // refactor this
                    if (!added) {
                        logger.Log("teamInpChangeHandler", "Doc verwijderd");
                        yield witTs.AddTeamDocs(teamsOnForm, this.vssDataService);
                    }
                });
            });
            logger.Log("teamInpChangeHandler", "Finished");
            new ModalHelper().CloseTeamsModal();
            VSS.notifyLoadSucceeded();
        });
    }
    TeamModalCancelButtonClicked() {
        new ModalHelper().CloseTeamsModal();
        new WitTsClass().ReloadHost();
    }
    TeamModalAddTeamButtonClicked(name) {
        new ModalHelper().AddNewTeamInputRow(name, defaultTeamName);
    }
    TeamModalRemoveTeamButtonClicked(clickedObj) {
        new ModalHelper().RemoveTeamInputRow(clickedObj);
    }
    RemoveDefaultText(focusedObject) {
        let obj = focusedObject;
        if (obj.value === defaultTaskTitle || obj.value === defaultTeamName) {
            obj.value = "";
        }
        new Logger().Log("RemoveDefaultText", null);
    }
    TaskModalCancelButtonClicked() {
        new ModalHelper().CloseTasksModal();
        new WitTsClass().ReloadHost();
    }
    TaskModalAddTaskButtonClicked() {
        new ModalHelper().AddNewTaskInputRow(null, null, defaultTaskTitle);
    }
    TaskModalRemoveTaskButtonClicked(clickedObj) {
        new ModalHelper().RemoveTaskInputRow(clickedObj);
    }
    TaskModalOKButtonClicked() {
        var t = document.getElementsByClassName('taskInputRow');
        new WitTsClass().UpdateTasksDocs(t);
        new Logger().Log("TaskModalOKButtonClicked", null);
    }
    TeamSelectedHandler(obj) {
        selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (selectedTeam === undefined) {
            this.GetTeamInAction().then(function (v) { this.selectedTeam = v; });
        }
        let viewHelper = new ViewHelper(vssDataService);
        viewHelper.LoadTeamTasks(selectedTeam);
        viewHelper.EnableBtn("voegTaskToe");
        viewHelper.EnableBtn("taskDialogConfirmBtn");
        new Logger().Log("TeamSelectedHandler", null);
    }
    CheckUncheckAllClicked(obj) {
        new CheckBoxHelper(parentWorkItem).CheckUncheck(obj);
    }
}
class PreLoader {
    RegisterEvents() {
        var eventHandlers = new EventHandlers();
        new Logger().Log("PreLoader.RegisterEvents", "Registering events");
        $("#existing-wit-id").focus(eventHandlers.ExistingWitFieldFocussed);
        $("#existing-wit-id").keypress(function (e) { eventHandlers.MainPageEnterPressed(e); });
        $("#existing-wit-button").click(function (e) { eventHandlers.OpenButtonClicked(e); });
        $("#addTasksButton").click(function (e) { eventHandlers.AddTasksButtonClicked(e); });
        $("#tasks-check-all-checkbox").click(function (e) { eventHandlers.CheckUncheckAllClicked(e.target); });
        //
        $("#teamDialogCancelBtn").click(eventHandlers.TeamModalCancelButtonClicked);
        $("#teamDialogConfirmBtn").click(eventHandlers.TeamModalOKButtonClicked);
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
            new ButtonHelper().DisableAddButton();
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
            new ButtonHelper().DisableAddButton();
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
            VSS.ready(function () {
                return __awaiter(this, void 0, void 0, function* () {
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
                            yield new MenuBuilder(vssDataService).BuildMenu(vssControls, vssMenus);
                            new ViewHelper(vssDataService).CreateTeamSelectElementInitially();
                            VSS.notifyLoadSucceeded();
                        });
                    });
                });
            });
        });
    }
}
class ButtonHelper {
    DisableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = true;
        }
    }
    EnableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = false;
        }
    }
}
class MenuBuilder {
    constructor(dataService) {
        this.dataservice = dataService;
    }
    GetMenuSettings() {
        return __awaiter(this, void 0, void 0, function* () {
            let menusettings = [];
            yield this.dataservice.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                return __awaiter(this, void 0, void 0, function* () {
                    yield docs.forEach(function (element) {
                        return __awaiter(this, void 0, void 0, function* () {
                            yield menusettings.push(element);
                        });
                    });
                });
            });
            return menusettings;
        });
    }
    BuildMenuItems(docs, Controls, Menus) {
        let logger = new Logger();
        var container = $(".menu-bar");
        var bar = [];
        logger.Log("BuildMenu", "CreateMenuBar() - getDocuments :" + docs.length);
        bar = docs.filter(function (d) { return d.type === 'team'; });
        var teamMenuItems = [];
        var teamTasksMenuItems = [];
        bar.forEach(function (element) {
            teamMenuItems.push({ id: "team_" + element.text.toLowerCase(), text: element.text });
            teamTasksMenuItems.push({ id: "tasks_" + element.text.toLowerCase(), text: element.text });
        });
        var teamItemsStringified = JSON.stringify(teamMenuItems);
        var teamTasksItemsStringified = JSON.stringify(teamTasksMenuItems);
        logger.Log("BuildMenu", "teamMenuItemsCreated :" + teamItemsStringified);
        logger.Log("BuildMenu", "teamTaskMenuITemsreated:" + teamTasksItemsStringified);
        var menuItems = '[' +
            '{' +
            '"id":"menu-setting", "text":"Settings", "icon":"icon-settings", "childItems":' +
            '[' +
            '{' +
            '"id": "switch", "text": "Switch team", "childItems":' +
            teamItemsStringified +
            '},' +
            '{' +
            '"id": "manage-teams", "text": "Manage teams"' +
            '},' +
            '{' +
            '"id": "configure-team-tasks", "text": "Manage team tasks" ' +
            '},' +
            '{' +
            '"id": "set-to-default", "text": "Set to default" ' +
            '}' +
            ']' +
            '},' +
            '{ "separator": "true" },' +
            '{ "id": "menu-help", "text": "Help", "icon": "icon-help", "tag": "test" }' +
            ']';
        var menuItemsParsed = JSON.parse(menuItems);
        // stukje abrakadabra
        var menubarOptions = {
            items: menuItemsParsed,
            executeAction: function (args) {
                var command = args.get_commandName();
                //this.MenuBarAction(command);
                // all team element ids begin with "team_", so we know user wants to switch teams
                if (command.startsWith("team_")) {
                    new ViewHelper(vssDataService).LoadTasksOnMainWindow(command);
                }
                else if (command === "manage-teams") {
                    new ViewHelper(vssDataService).ConfigureTeams(command);
                }
                else if (command === "configure-team-tasks") {
                    new ViewHelper(vssDataService).ConfigureTasks(command);
                }
                else if (command === "set-to-default") {
                    new ViewHelper(vssDataService).SetToDefault();
                }
            }
        };
        var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);
        VSS.notifyLoadSucceeded();
    }
    BuildMenu(controls, menus) {
        return __awaiter(this, void 0, void 0, function* () {
            this.menuSettings = yield this.GetMenuSettings().then(function (s) { return s; });
            this.BuildMenuItems(this.menuSettings, controls, menus);
        });
    }
}
class WorkItemHelper {
    CheckAllowedToAddTaskToPbi(parentWorkItem) {
        if (parentWorkItem.workItemType === 'undefined' || parentWorkItem.workItemType === null ||
            (parentWorkItem.workItemType !== "Product Backlog Item" && parentWorkItem.workItemType !== "Bug")) {
            return false;
        }
        return true;
    }
    WorkItemNietGevonden(e) {
        let exceptionMessage = "";
        if (e != null && e.message.length > 0) {
            exceptionMessage = e.message;
        }
        document.getElementById("existing-wit-text").innerHTML = "Workitem niet gevonden. " + exceptionMessage;
        new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
        new ButtonHelper().DisableAddButton();
    }
}
class WitTsClass {
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
    let preloader = new PreLoader();
    preloader.LoadPreConditions(window);
    preloader.RegisterEvents();
};
