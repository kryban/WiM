var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
//import * as VssControls from "VSS/Controls";
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
class WimWorkItem {
    constructor(workItemQueryResult) {
        let workItemFields = new Enm_WorkitemFields();
        if (workItemQueryResult == null || workItemQueryResult === undefined) {
            this.id = 0;
            this.rev = 0;
            this.url = "na";
            this.title = "na";
            this.workItemType = "na";
            this.workItemProjectName = "na";
            this.workItemIterationPath = "na";
            this.workItemAreaPath = "na";
            this.workItemTaskActivity = "na";
            this.allowedToAddTasks = false;
        }
        else {
            this.id = workItemQueryResult.id;
            this.rev = workItemQueryResult.rev;
            this.url = workItemQueryResult.url;
            this.title = workItemQueryResult.fields[workItemFields.Title];
            this.workItemType = workItemQueryResult.fields[workItemFields.WorkItemType];
            this.workItemProjectName = workItemQueryResult.fields[workItemFields.TeamProject];
            this.workItemIterationPath = workItemQueryResult.fields[workItemFields.IterationPath];
            this.workItemAreaPath = workItemQueryResult.fields[workItemFields.AreaPath];
            this.workItemTaskActivity = workItemFields.TaskActivity;
            this.allowedToAddTasks = new WorkItemHelper().CheckAllowedToAddTaskToPbi(this);
        }
    }
}
class Enm_WorkitemPaths {
    constructor() {
        this.AreaPath = "/fields/System.AreaPath";
        this.TeamProject = "/fields/System.TeamProject";
        this.IterationPath = "/fields/System.IterationPath";
        this.WorkItemType = "/fields/System.WorkItemType";
        this.State = "/fields/System.State";
        this.Reason = "/fields/System.Reason";
        this.CreatedDate = "/fields/System.CreatedDate";
        this.CreatedBy = "/fields/System.CreatedBy";
        this.ChangedDate = "/fields/System.ChangedDate";
        this.ChangedBy = "/fields/System.ChangedBy";
        this.Title = "/fields/System.Title";
        this.BoardColumn = "/fields/System.BoardColumn";
        this.BoardColumnDone = "/fields/System.BoardColumnDone";
        this.BacklogPriority = "/fields/Microsoft.VSTS.Common.BacklogPriority";
        this.Severity = "/fields/Microsoft.VSTS.Common.Severity";
        this.KanBanColumn = "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column";
        this.KanBanColumnDone = "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done";
        this.TopDeskWijzigingNr = "/fields/dSZW.Socrates.TopDeskWijzigingNr";
        this.SystemInfo = "/fields/Microsoft.VSTS.TCM.SystemInfo";
        this.ReproSteps = "/fields/Microsoft.VSTS.TCM.ReproSteps";
        this.TaskActivity = "/fields/Microsoft.VSTS.Common.Activity";
        this.url = "/fields/url";
    }
}
class Enm_WorkitemFields {
    constructor() {
        this.AreaPath = "System.AreaPath";
        this.TeamProject = "System.TeamProject";
        this.IterationPath = "System.IterationPath";
        this.WorkItemType = "System.WorkItemType";
        this.State = "System.State";
        this.Reason = "System.Reason";
        this.CreatedDate = "System.CreatedDate";
        this.CreatedBy = "System.CreatedBy";
        this.ChangedDate = "System.ChangedDate";
        this.ChangedBy = "System.ChangedBy";
        this.Title = "System.Title";
        this.BoardColumn = "System.BoardColumn";
        this.BoardColumnDone = "System.BoardColumnDone";
        this.BacklogPriority = "Microsoft.VSTS.Common.BacklogPriority";
        this.Severity = "Microsoft.VSTS.Common.Severity";
        this.KanBanColumn = "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column";
        this.KanBanColumnDone = "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done";
        this.TopDeskWijzigingNr = "dSZW.Socrates.TopDeskWijzigingNr";
        this.SystemInfo = "Microsoft.VSTS.TCM.SystemInfo";
        this.ReproSteps = "Microsoft.VSTS.TCM.ReproSteps";
        this.TaskActivity = "Microsoft.VSTS.Common.Activity";
        this.url = "url";
        this.AllRelations = "/relations/-";
        this.SpecficRelations = "/relations/";
    }
}
class CheckBoxInfo {
    constructor(checkBoxTitle, checkBoxactivityType) {
        this.title = checkBoxTitle;
        this.activityType = checkBoxactivityType;
    }
}
class Enm_JsonPatchOperations {
    constructor() {
        this.Add = "add";
    }
}
class Logger {
    Log(callerName, logTekst) {
        var tekst = (logTekst !== null && typeof logTekst !== "undefined") ? logTekst : "";
        console.log(callerName + ": " + tekst);
    }
}
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
    LoadTasksOnMainWindow(teamnaam) {
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
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            this.log("LoadTasksOnMainWindow", docs.length);
            // only team task setting. Not other settings or other tam tasks
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === this.selectedTeam.toLowerCase(); });
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
    }
    ConfigureTeams(command) {
        $('.modal_teams').show();
    }
    ConfigureTasks(teamnaam) {
        var substringVanaf = "tasks_".length;
        var parsedTeamnaam = teamnaam.substring(substringVanaf);
        new Logger().Log("ConfigureTasks", parsedTeamnaam);
        new ModalHelper().openTasksModal();
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
    addTeamHandler(name) {
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
                    teamSelecectOption.setAttribute("onchange", "TeamSelectedHandler(this)");
                    teamSelecectOption.innerText = element.text;
                    teamSelectNode.appendChild(teamSelecectOption);
                    var teamTitle = (element.text !== null && typeof element.text !== "undefined") ? element.text : defaultTeamName;
                    var teamRowNode = document.createElement("div");
                    var teamNaamInputNode = document.createElement("input");
                    teamNaamInputNode.setAttribute("onfocus", "removeDefaultTextHandler(this)");
                    teamNaamInputNode.setAttribute("type", "text");
                    teamNaamInputNode.setAttribute("value", teamTitle);
                    teamNaamInputNode.setAttribute("name", "teamInpNaam");
                    teamNaamInputNode.setAttribute("class", "teamNaamInput");
                    var removeTeamFieldNode = document.createElement("a");
                    removeTeamFieldNode.setAttribute("onclick", "removeTeamFieldClickHandler(this)");
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
            new CheckboxHelper().DisableCheckBoxes();
            new ButtonHelper().DisableAddButton();
        }
        else {
            document.getElementById("existing-wit-text").className = "existing-wit-text";
            document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;
            new CheckboxHelper().EnableCheckBoxes();
            new ButtonHelper().EnableAddButton();
        }
        VSS.notifyLoadSucceeded();
    }
}
class ServiceHelper {
    GetDataService() {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            let retVal;
            logger.Log("GetDataService", "1->" + retVal);
            retVal = yield VSS.getService(VSS.ServiceIds.ExtensionData);
            logger.Log(".GetDataService", "2->" + retVal);
            return retVal;
        });
    }
}
class ModalHelper {
    openTasksModal() { $('.modal_tasks').show(); }
    closeTasksModal() { $('.modal_tasks').hide(); }
    openTeamsModal() { $('.modal_teams').show(); }
    closeTeamsModal() { $('.modal_teams').hide(); }
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
            var checkBoxes = document.getElementsByClassName("checkbox");
            var addButton = document.getElementById("addTasksButton");
            try {
                yield witClient.getWorkItem(witId) // when only specific fields required , ["System.Title", "System.WorkItemType"])
                    .then(function (workitemResult) {
                    new Logger().Log("workitemResult", "new");
                    parentWorkItem = new WimWorkItem(workitemResult);
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
}
class PreLoader {
    RegisterEvents() {
        var eventHandlers = new EventHandlers();
        new Logger().Log("PreLoader.RegisterEvents", "Registering events");
        $("#existing-wit-id").focus(eventHandlers.ExistingWitFieldFocussed);
        $("#existing-wit-id").keypress(function (e) { eventHandlers.MainPageEnterPressed(e); });
        $("#existing-wit-button").click(function (e) { eventHandlers.OpenButtonClicked(e); });
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
    registerTasksModelButtonEvents(modalHelper) {
        //Show modal box
        $('#modal_tasks_openModal').click(() => { modalHelper.openTasksModal(); });
        //Hide modal box
        $('#modal_tasks_closeModal').click(() => { modalHelper.closeTasksModal(); });
    }
    registerTeamsModelButtonEvents(modalHelper) {
        //Show modal box
        $('#modal_teams_openModal').click(() => { modalHelper.openTeamsModal(); });
        //Hide modal box
        $('#modal_teams_closeModal').click(() => { modalHelper.closeTeamsModal(); });
    }
    LoadPreState() {
        let modalHelper = new ModalHelper();
        if (document.readyState == "complete") {
            var name = window.location.pathname.split('/').slice(-1);
            new CheckboxHelper().DisableCheckBoxes();
            new ButtonHelper().DisableAddButton();
            this.registerTasksModelButtonEvents(modalHelper);
            this.registerTeamsModelButtonEvents(modalHelper);
            this.LoadRequired();
            new Logger().Log("window.onload", "DocumentReady:" + name);
        }
    }
    LoadPreConditions(window) {
        return __awaiter(this, void 0, void 0, function* () {
            var name = window.location.pathname.split('/').slice(-1);
            let modalHelper = new ModalHelper();
            new CheckboxHelper().DisableCheckBoxes();
            new ButtonHelper().DisableAddButton();
            this.registerTasksModelButtonEvents(modalHelper);
            this.registerTeamsModelButtonEvents(modalHelper);
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
                            let vssDataService = yield new ServiceHelper().GetDataService();
                            yield new MenuBuilderClass(vssDataService).BuildMenu(vssControls, vssMenus);
                            new ViewHelper(vssDataService).CreateTeamSelectElementInitially();
                            VSS.notifyLoadSucceeded();
                        });
                    });
                });
            });
        });
    }
}
class CheckboxHelper {
    DisableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null || (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i];
                checkbox.disabled = true;
            }
        }
    }
    EnableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i];
                checkbox.disabled = false;
            }
        }
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
//class ExternalsLoader {
//    LoadRequired() {
//        VSS.ready(async function () {
//            await VSS.require(["VSS/Controls",
//                "VSS/Controls/StatusIndicator",
//                "VSS/Service",
//                "TFS/WorkItemTracking/RestClient",
//                "VSS/Controls/Menus"],
//                async function (c, i, s, r, m) {
//                    vssControls = c; this.log("LoadRequired", "Required vssControls: " + this.vssControls);
//                    vssStatusindicator = i; this.log("LoadRequired", "Required vssStatusIndicator: " + this.vssStatusindicator);
//                    vssService = s; this.log("LoadRequired", "Required vssService: " + this.vssService);
//                    vssWiTrackingClient = r; this.log("LoadRequired", "Required vssWiTrackingClient: " + this.vssWiTrackingClient);
//                    vssMenus = m; this.log("LoadRequired", "Required vssMenus: " + this.vssMenus);
//                    await this.GetDataService();
//                    this.MaakMenu(this.vssControls, this.vssMenus, this.vssDataService);
//                    this.CreateTeamSelectElementInitially(this.vssDataService);
//                });
//        });
//    }
//}
class MenuBuilderClass {
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
                    new ViewHelper(this.dataservice).LoadTasksOnMainWindow(command);
                }
                else if (command === "manage-teams") {
                    new ViewHelper(this.dataservice).ConfigureTeams(command);
                }
                else if (command === "configure-team-tasks") {
                    new ViewHelper(this.dataservice).ConfigureTasks(command);
                }
                else if (command === "set-to-default") {
                    new ViewHelper(this.dataservice).SetToDefault();
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
        if (parentWorkItem.workItemType !== "Product Backlog Item" && parentWorkItem.workItemType !== "Bug") {
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
        new CheckboxHelper().DisableCheckBoxes();
        new ButtonHelper().DisableAddButton();
    }
}
class WitTsClass {
    constructor() { }
    //async MaakMenu(controls, menus, dataService) {
    //    new Logger().Log("Maakmenu", "Start creating menu bar (vssControls; vssMenus, vssDataService): " + controls + "+" + menus + "+" + dataService);
    //    await this.CreateMenuBar(controls, menus, dataService);
    //}
    //CreateMenuBar(controls, menus, dataService) {
    //    //VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
    //    (dataService as IExtensionDataService).getDocuments(TeamSettingsCollectionName).then(
    //        function (docs) {
    //            new MenuBuilderClass().BuildMenu(docs, controls, menus);
    //        }
    //    );
    //    //});
    //    VSS.notifyLoadSucceeded();
    //}
    //BuildMenu(docs, Controls, Menus) {
    //    var container = $(".menu-bar");
    //    var bar = [];
    //    this.log("BuildMenu", "CreateMenuBar() - getDocuments :" + docs.length);
    //    bar = docs.filter(function (d) { return d.type === 'team'; });
    //    var teamMenuItems = [];
    //    var teamTasksMenuItems = [];
    //    bar.forEach(
    //        function (element) {
    //            teamMenuItems.push(
    //                { id: "team_" + element.text.toLowerCase(), text: element.text }
    //            );
    //            teamTasksMenuItems.push(
    //                { id: "tasks_" + element.text.toLowerCase(), text: element.text }
    //            );
    //        }
    //    );
    //    var teamItemsStringified = JSON.stringify(teamMenuItems);
    //    var teamTasksItemsStringified = JSON.stringify(teamTasksMenuItems);
    //    this.log("BuildMenu", "teamMenuItemsCreated :" + teamItemsStringified);
    //    this.log("BuildMenu", "teamTaskMenuITemsreated:" + teamTasksItemsStringified);
    //    var menuItems =
    //        '[' +
    //        '{' +
    //        '"id":"menu-setting", "text":"Settings", "icon":"icon-settings", "childItems":' +
    //        '[' +
    //        '{' +
    //        '"id": "switch", "text": "Switch team", "childItems":' +
    //        teamItemsStringified +
    //        '},' +
    //        '{' +
    //        '"id": "manage-teams", "text": "Manage teams"' +
    //        '},' +
    //        '{' +
    //        '"id": "configure-team-tasks", "text": "Manage team tasks" ' +
    //        '},' +
    //        '{' +
    //        '"id": "set-to-default", "text": "Set to default" ' +
    //        '}' +
    //        ']' +
    //        '},' +
    //        '{ "separator": "true" },' +
    //        '{ "id": "menu-help", "text": "Help", "icon": "icon-help", "tag": "test" }' +
    //        ']';
    //    var menuItemsParsed = JSON.parse(menuItems);
    //    // stukje abrakadabra
    //    var menubarOptions = {
    //        items: menuItemsParsed,
    //        executeAction: function (args) {
    //            var command = args.get_commandName();
    //            this.menuBarAction(command);
    //        }
    //    };
    //    var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);
    //    VSS.notifyLoadSucceeded();
    //}
    // the center of all actions binded to menu items based on their names
    //this.VSS.notifyLoadSucceeded();
    //    LoadPreState()
    //    {
    //        if (document.readyState == "complete") {
    //            var name = window.location.pathname.split('/').slice(-1);
    //            this.DisableCheckBoxes();
    //            this.DisableAddButton();
    //            this.registerTasksModelButtonEvents();
    //            this.registerTeamsModelButtonEvents();
    //            this.LoadRequired();
    //            new Logger().Log("window.onload", "DocumentReady:" + name);
    //        }
    //    }
    //    async LoadPreConditions(window) {
    //        var name = window.location.pathname.split('/').slice(-1);
    //        this.DisableCheckBoxes();
    //        this.DisableAddButton();
    //        this.registerTasksModelButtonEvents();
    //        this.registerTeamsModelButtonEvents();
    //        await this.LoadRequired();
    //        new Logger().Log("window.onload", "DocumentReady:" + name);
    //    }
    //    async LoadRequired() {
    //        let logger: Logger = new Logger();
    //        logger.Log("LoadRequired()", "Begin of LoadRequired()");
    //        VSS.ready(async function () {
    //            await VSS.require(["VSS/Controls","VSS/Controls/StatusIndicator","VSS/Service","TFS/WorkItemTracking/RestClient","VSS/Controls/Menus"],
    //                async function (c, i, s, r, m) {
    //                    vssControls = c;
    //                    vssStatusindicator = i;
    //                    vssService = s;
    //                    vssWiTrackingClient = r;
    //                    vssMenus = m;
    //                    logger.Log("LoadRequired", "Required vssControls: " + vssControls);
    //                    logger.Log("LoadRequired", "Required vssStatusIndicator: " + vssStatusindicator);
    //                    logger.Log("LoadRequired", "Required vssService: " + vssService);
    //                    logger.Log("LoadRequired", "Required vssWiTrackingClient: " + vssWiTrackingClient);
    //                    logger.Log("LoadRequired", "Required vssMenus: " + vssMenus);
    //                    () => this.GetDataService();
    //                    () => this.MaakMenu(vssControls, vssMenus, vssDataService);
    //                    () => this.CreateTeamSelectElementInitially(vssDataService);
    //                    VSS.notifyLoadSucceeded();
    //                });
    //        });
    //    }
    //    async GetDataService()
    //    {
    //        let logger = new Logger();
    //        logger.Log("GetDataService", "1->" + vssDataService);
    //        vssDataService = await VSS.getService(VSS.ServiceIds.ExtensionData);
    //        logger.Log(".GetDataService", "2->" + vssDataService);
    //    }
    //    registerTasksModelButtonEvents() {
    //        //Show modal box
    //        $('#modal_tasks_openModal').click(
    //            () => { this.openTasksModal(); }
    //        );
    //        //Hide modal box
    //        $('#modal_tasks_closeModal').click(
    //            () => { this.closeTasksModal(); }
    //        );
    //    }
    //registerTeamsModelButtonEvents() {
    //    //Show modal box
    //    $('#modal_teams_openModal').click(
    //        () => { this.openTeamsModal(); }
    //    );
    //    //Hide modal box
    //    $('#modal_teams_closeModal').click(
    //        () => { this.closeTeamsModal(); }
    //    );
    //}
    //log(callerName:string, logTekst: string) {
    //    var tekst = (logTekst !== null && typeof logTekst !== "undefined") ? logTekst : "";
    //    console.log(callerName + ": " + tekst);
    //}
    //DisableCheckBoxes() {
    //    var checkBoxes = document.getElementsByClassName("checkbox");
    //    if (checkBoxes !== null || (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
    //        for (var i = 0; i < checkBoxes.length; i++) {
    //            var checkbox = checkBoxes[i] as HTMLInputElement;
    //            checkbox.disabled = true;
    //        }
    //    }
    //}
    //EnableCheckBoxes() {
    //    var checkBoxes = document.getElementsByClassName("checkbox");
    //    if (checkBoxes !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
    //        for (var i = 0; i < checkBoxes.length; i++) {
    //            var checkbox = checkBoxes[i] as HTMLInputElement;
    //            checkbox.disabled = false;
    //        }
    //    }
    //}
    //DisableAddButton() {
    //    var addButton = document.getElementById("addTasksButton") as HTMLInputElement;
    //    if (addButton !== null && (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
    //        addButton.disabled = true;
    //    }
    //}
    //EnableAddButton() {
    //    var addButton = document.getElementById("addTasksButton") as HTMLInputElement;
    //    if (addButton !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
    //        addButton.disabled = false;
    //    }
    //}
    // Browserdafe Modal try-outs
    //let modal = document.querySelector(".modal");
    //let closeBtn = document.querySelector(".close-btn");
    //function workItem(wiResult) {
    //    if (wiResult === null || wiResult === undefined) {
    //        this.id = "na";
    //        this.rev = "na";
    //        this.url = "na";
    //        this.title = "na";
    //        this.workItemType = "na";
    //        this.workItemProjectName = "na";
    //        this.workItemIterationPath = "na";
    //        this.workItemAreaPath = "na";
    //        this.workItemTaskActivity = "na";
    //        this.allowedToAddTasks = false;
    //    }
    //    else {
    //        this.id = wiResult.id;
    //        this.rev = wiResult.rev;
    //        this.url = wiResult.url;
    //        this.title = wiResult.fields[Enm_WorkitemFields.Title];
    //        this.workItemType = wiResult.fields[Enm_WorkitemFields.WorkItemType];
    //        this.workItemProjectName = wiResult.fields[Enm_WorkitemFields.TeamProject];
    //        this.workItemIterationPath = wiResult.fields[Enm_WorkitemFields.IterationPath];
    //        this.workItemAreaPath = wiResult.fields[Enm_WorkitemFields.AreaPath];
    //        this.workItemTaskActivity = Enm_WorkitemFields.TaskActivity;
    //        this.allowedToAddTasks = CheckAllowedToAddTaskToPbi(this);
    //    }
    //};
    MapWorkItemFields(witemObject, witem) {
        witemObject.Title = witem.fields["System.Title"];
    }
    //ExistingWitFieldFocussed() {
    //    var field = document.getElementById("existing-wit-id") as HTMLInputElement;
    //    if (field.value === "workitem ID") {
    //        field.value = "";
    //    }
    //}
    //async OpenButtonClicked(obj) {
    //    parentWorkItem = null;
    //    witClient = vssWiTrackingClient.getClient();
    //    var witId = parseInt((document.getElementById("existing-wit-id") as HTMLInputElement).value);
    //    var checkBoxes = document.getElementsByClassName("checkbox");
    //    var addButton = document.getElementById("addTasksButton");
    //    try {
    //        await witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
    //            .then(function (workitemResult) {
    //                parentWorkItem = new WimWorkItem(workitemResult);
    //                this.ShowSelectedWorkitemOnPage(parentWorkItem);
    //            });
    //        if (parentWorkItem === undefined || parentWorkItem === null) {
    //            new WorkItemHelper().WorkItemNietGevonden();
    //        }
    //    } catch (e) {
    //        let exc: Error = e;
    //        new WorkItemHelper().WorkItemNietGevonden(e);
    //    }
    //}
    //MainPageEnterPressed(event) {
    //    if (event.key === "Enter") {
    //        event.preventDefault();
    //        this.OpenButtonClicked(null);
    //    }
    //}
    GetWorkItemTypes(callback) {
        VSS.require(["TFS/WorkItemTracking/RestClient"], function (_restWitClient) {
            witClient = _restWitClient.getClient();
            witClient.getWorkItemTypes(VSS.getWebContext().project.name)
                .then(function () {
                callback();
            });
        });
    }
    teamInpChangeHandler() {
        var teamsOnForm = document.getElementsByName("teamInpNaam");
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises;
            teamDeletionPromises.push(new Promise(function () { }));
            var added = false;
            teamDocs.forEach(function (element) {
                teamDeletionPromises.push(this.vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
            });
            Promise.all(teamDeletionPromises).then(function (service) {
                if (!added) {
                    this.log("teamInpChangeHandler", "Doc verwijderd");
                    this.AddTeamDocs(teamsOnForm, this.vssDataService);
                    VSS.notifyLoadSucceeded();
                }
            });
            // refactor this
            if (!added) {
                this.log("teamInpChangeHandler", "Doc verwijderd");
                this.AddTeamDocs(teamsOnForm, this.vssDataService);
                VSS.notifyLoadSucceeded();
            }
        });
        new Logger().Log("teamInpChangeHandler", "Finished");
        new ModalHelper().closeTeamsModal();
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
            this.reloadHost();
        }
    }
    //////////////settings////////////////////////////////////////////////////////////////////
    //https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
    //see all settings
    //http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents
    //function OpenTeamsConfiguratieDialoog(title) {
    //    if (typeof teamDialog.showModal === "function") {
    //        teamDialog.showModal();
    //    } else {
    //        alert("The dialog API is not supported by this browser");
    //    }
    //    teamDialog.addEventListener('close', function onClose() {
    //        this.log("closing teamsettings");
    //    });
    //}
    //function GetTeams() {
    //    this.log("GetTeams() executed");
    //    GetAllTeamSettings();
    //}
    //function getExistingSettings(dataservice) {
    //    dataservice.getDocuments(TeamSettingsCollectionName).then(
    //        function (docs) {
    //            this.log("GetAllTeamSettingsNew :" + docs.length);
    //            docs.forEach(
    //                function (element) {
    //                    configuredTeams.push(element);
    //                }
    //            );
    //            VSS.notifyLoadSucceeded();
    //        }
    //    );
    //}
    //function checkIfExistBeforeAdding(docs, teamName) {
    //    result = docs.find(function (obj) { return obj.text === teamName; });
    //    this.log("checkNew: " + result);
    //}
    //function addSetting(dataService, teamName) {
    //    var newDoc = {
    //        text: teamName
    //    };
    //    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
    //        this.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
    //    });
    //    this.log("SettingNEw NOT exists.");
    //}
    SetTeamSettings(teamName) {
        var temp = [];
        var result;
        let logger = new Logger();
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            this.log("SetTeamSettings", "GetAllTeamSettings :" + docs.length);
            result = docs.find(function (obj) { return obj.text === teamName; });
            docs.forEach(function (element) {
                temp.push(element);
            });
            VSS.notifyLoadSucceeded();
        });
        if (typeof result === 'undefined') {
            logger.Log("SetTeamSettings", "Setting exists.");
        }
        else {
            var newDoc = {
                type: "team",
                text: teamName
            };
            vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                this.log("SetTeamSettings", "SetTeamSetting (CreateTeams) : " + doc.text);
            });
            logger.Log("SetTeamSettings", "Setting NOT exists.");
        }
        VSS.notifyLoadSucceeded();
    }
    GetAllTeamSettings() {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            this.log("GetAllTeamSettings", "GetAllTeamSettings :" + docs.length);
            VSS.notifyLoadSucceeded();
            return docs;
        });
        VSS.notifyLoadSucceeded();
    }
    reloadHost() {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            console.log("navigationService.reload()");
            navigationService.reload();
        });
        new Logger().Log("reloadHost", null);
    }
    //this.VSS.notifyLoadSucceeded();
    removeTeamFieldClickHandler(obj) {
        obj.parentNode.remove();
        new Logger().Log("removeTeamFieldClickHandler", "Fields removed.");
    }
    removeTaskFieldClickHandler(obj) {
        obj.parentNode.remove();
        new Logger().Log("removeTaskFieldClickHandler", "Fields removed.");
    }
    addTaskToConfigurationHandler(title, type) {
        var taskTitle = (title !== null && typeof title !== "undefined") ? title : defaultTaskTitle;
        var taskInputRowNode = document.createElement("div");
        taskInputRowNode.setAttribute("class", "taskInputRow");
        var taskNaamInputNode = document.createElement("input");
        taskNaamInputNode.setAttribute("onfocus", "removeDefaultTextHandler(this)");
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
    removeDefaultTextHandler(focusedObject) {
        if (focusedObject.value === defaultTaskTitle || focusedObject.value === defaultTeamName) {
            focusedObject.value = "";
        }
        new Logger().Log("removeDefaultTextHandler", null);
    }
    //function OpenTaskConfiguratieDialoog(teamNaam) {
    //    if (typeof tasksDialog.showModal === "function") {
    //        tasksDialog.showModal();
    //    } else {
    //        alert("The dialog API is not supported by this browser");
    //    }
    //    tasksDialog.addEventListener('close', function onClose() {
    //        this.log("closing teamsettings");
    //    });
    //}
    taskInpChangeHandler() {
        var t = document.getElementsByClassName('taskInputRow');
        this.UpdateTasksDocs(t);
        new Logger().Log("taskInpChangeHandler", null);
    }
    UpdateTasksDocs(tasks) {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === this.selectedTeam; });
            this.log("UpdateTasksDocs", "Emptying task settings." + taskDocs.length + " settings will be removed.");
            var added = false;
            var deletionPromises;
            deletionPromises.push(new Promise(function () { }));
            taskDocs.forEach(function (element) {
                deletionPromises.push(this.vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
            });
            Promise.all(deletionPromises).then(function (service) {
                if (!added) {
                    this.AddTasksDocs(tasks, this.selectedTeam);
                    added = true;
                }
                this.log("UpdateTasksDocs", "Tasks updated");
            });
            // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden.
            if (!added) {
                this.AddTasksDocs(tasks, this.selectedTeam);
                added = true;
            }
            this.log("UpdateTasksDocs", "adding new doc "); // + newDoc.taskId);
        });
        VSS.notifyLoadSucceeded();
    }
    AddTasksDocs(tasks, teamName) {
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
            vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                function AddTasksDocs(tasks, teamName) {
                    this.log("AddTasksDocs", "created document : " + doc.text);
                }
            });
            new ModalHelper().closeTasksModal();
            this.reloadHost();
        }
    }
    TeamSelectedHandler(obj) {
        selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (selectedTeam === undefined) {
            this.GetTeamInAction().then(function (v) { this.selectedTeam = v; });
        }
        this.LoadTeamTasks(selectedTeam);
        this.EnableBtn("voegTaskToe");
        this.EnableBtn("taskDialogConfirmBtn");
        new Logger().Log("TeamSelectedHandler", null);
    }
    EnableBtn(id) {
        document.getElementById(id).removeAttribute("disabled");
    }
    LoadTeamTasks(selection) {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            this.log("LoadTeamTasks", docs.length);
            var x = 0;
            if (selection === undefined) {
                selection = this.GetTeamInAction();
            }
            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });
            this.log("LoadTeamTasks", "Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");
            var taskInputRowDivs = $('div.taskInputRow');
            taskInputRowDivs.remove();
            this.log("LoadTeamTasks", 'Build new list with ' + teamTasks.length + ' items.');
            teamTasks.forEach(function (element) {
                this.addTaskToConfigurationHandler(element.title, element.activityType);
            });
            VSS.notifyLoadSucceeded();
        });
    }
    CheckUncheck(obj) {
        var tasks = document.getElementsByName("taskcheckbox");
        if (obj.checked) {
            tasks.forEach(function (element) {
                if (!element.checked) {
                    element.toggleAttribute("checked");
                }
            });
        }
        else {
            tasks.forEach(function (element) {
                if (element.checked) {
                    element.toggleAttribute("checked");
                }
            });
        }
        new Logger().Log("CheckUncheck", null);
    }
    AddTasksButtonClicked(obj) {
        new WorkItemHelper().CheckAllowedToAddTaskToPbi(parentWorkItem);
        var taskCheckboxes = document.getElementsByName("taskcheckbox");
        var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
        var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);
        var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
        this.PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);
        new ViewHelper(vssDataService).LoadTasksOnMainWindow(selectedTeam);
        new Logger().Log("AddTasksButtonClicked", null);
    }
    PairTasksToWorkitem(docs, parent) {
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
        var waitcontrol = vssControls.create(vssStatusindicator.WaitControl, container, options);
        var client = vssService.getCollectionClient(vssWiTrackingClient.WorkItemTrackingHttpClient);
        //var client = vssService.getCollectionClient(VssWitClient.WorkItemTrackingHttpClient);
        waitcontrol.startWait();
        waitcontrol.setMessage("waiter waits.");
        var workItemPromises = [];
        docs.forEach(function (jsonPatchDoc) {
            numberOfTasksHandled++;
            workItemPromises.push(client.createWorkItem(jsonPatchDoc, parent.workItemProjectName, "Task"));
        });
        Promise.all(workItemPromises).then(function () {
            var taakTaken = numberOfTasksHandled === 1 ? "taak" : "taken";
            alert(numberOfTasksHandled + " " + taakTaken + " toegevoegd aan PBI " + parent.id + " (" + parent.title + ").");
            waitcontrol.endWait();
            VSS.notifyLoadSucceeded();
        });
        new Logger().Log("PairTasksToWorkitem", null);
    }
    CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];
        tasks.forEach(function (element) {
            retval.push(new this.jsonPatchDoc(element).returnPatchDoc);
        });
        new Logger().Log("CreateJsonPatchDocsForTasks", null);
        return retval;
    }
    jsonPatchDoc(task) {
        let operations = new Enm_JsonPatchOperations();
        let paths = new Enm_WorkitemPaths();
        return [
            {
                "op": operations.Add,
                "path": paths.Title,
                "value": task.title
            },
            {
                "op": operations.Add,
                "path": paths.IterationPath,
                "value": task.workItemIterationPath
            },
            {
                "op": operations.Add,
                "path": paths.AreaPath,
                "value": task.workItemAreaPath
            },
            {
                "op": operations.Add,
                "path": paths.TaskActivity,
                "value": task.workItemTaskActivity
            },
            {
                "op": operations.Add,
                "path": paths.AllRelations,
                "value": {
                    "rel": "System.LinkTypes.Hierarchy-Reverse",
                    "url": parentWorkItem.url,
                    "attributes": {
                        "comment": "todo: comment voor decompositie"
                    }
                }
            }
        ];
        // available WorkITtemFields as a result
        // Microsoft.VSTS.Common.BacklogPriority: 1000031622
        // Microsoft.VSTS.Common.Severity: "3 - Medium"
        // Microsoft.VSTS.TCM.ReproSteps: "Reproductiestappen"
        // Microsoft.VSTS.TCM.SystemInfo: "sysinfo"
        // System.AreaPath: "WiM"
        // System.BoardColumn: "New"
        // System.BoardColumnDone: false
        // System.ChangedBy: "kry <KRYLP\kry>"
        // System.ChangedDate: "2017-12-30T19:55:20.99Z"
        // System.CommentCount: 0
        // System.CreatedBy: "kry <KRYLP\kry>"
        // System.CreatedDate: "2017-12-23T22:39:59.693Z"
        // System.IterationPath: "WiM"
        // System.Reason: "New defect reported"
        // System.State: "New"
        // System.TeamProject: "WiM"
        // System.Title: "Voorbeeld van een BUG met heeeeeeel vel tekst en allerlei andere dingetjes die te tekst uiteindelijk te lang maken zodat we het wrappen kunnen testen."
        // System.WorkItemType: "Bug"
        // WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column: "New"
        // WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done: false
        // dSZW.Socrates.TopDeskWijzigingNr: "W1245-5544"
        //return workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result;
        new Logger().Log("jsonPatchDoc", null);
    }
    CreateTasksToAdd(selectedCheckboxes) {
        var retval = [];
        selectedCheckboxes.forEach(function (element) {
            var task = new WimWorkItem(null);
            task.title = element.Title;
            task.workItemType = "Task";
            task.workItemProjectName = parentWorkItem.workItemProjectName;
            task.workItemIterationPath = parentWorkItem.workItemIterationPath;
            task.workItemAreaPath = parentWorkItem.workItemAreaPath;
            task.workItemTaskActivity = element.ActivityType;
            retval.push(task);
        });
        new Logger().Log("CreateTasksToAdd", "Created tasks: " + retval.length);
        return retval;
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
    GetTeamInAction() {
        return __awaiter(this, void 0, void 0, function* () {
            let retval;
            let teamInAction = yield vssDataService.getValue("team-in-action");
            new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);
            retval = teamInAction;
            return retval;
        });
    }
}
console.log("vlak voor het einde");
window.onload = function () {
    let preloader = new PreLoader();
    preloader.LoadPreConditions(window);
    preloader.RegisterEvents();
};
