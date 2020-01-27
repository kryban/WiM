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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
define(["require", "exports"], function (require, exports) {
    "use strict";
    Object.defineProperty(exports, "__esModule", { value: true });
    var TeamSettingsCollectionName = "WimCollection";
    var defaultTaskTitle = "Taak titel";
    var defaultTeamName = "Team naam";
    var parentWorkItem;
    var witClient;
    var selectedTeam;
    var vssControls;
    var vssStatusindicator;
    var vssService;
    var vssWiTrackingClient;
    var vssMenus;
    var vssDataService;
    function MaakMenu(controls, menus, dataService) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log(MaakMenu.name, "Start creating menu bar (vssControls; vssMenus, vssDataService): " + controls + "+" + menus + "+" + dataService);
                        return [4 /*yield*/, CreateMenuBar(controls, menus, dataService)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/];
                }
            });
        });
    }
    function CreateMenuBar(controls, menus, dataService) {
        //VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            BuildMenu(docs, controls, menus);
        });
        //});
        VSS.notifyLoadSucceeded();
    }
    function BuildMenu(docs, Controls, Menus) {
        var container = $(".menu-bar");
        var bar = [];
        log(BuildMenu.name, "CreateMenuBar() - getDocuments :" + docs.length);
        bar = docs.filter(function (d) { return d.type === 'team'; });
        var teamMenuItems = [];
        var teamTasksMenuItems = [];
        bar.forEach(function (element) {
            teamMenuItems.push({ id: "team_" + element.text.toLowerCase(), text: element.text });
            teamTasksMenuItems.push({ id: "tasks_" + element.text.toLowerCase(), text: element.text });
        });
        var teamItemsStringified = JSON.stringify(teamMenuItems);
        var teamTasksItemsStringified = JSON.stringify(teamTasksMenuItems);
        log(BuildMenu.name, "teamMenuItemsCreated :" + teamItemsStringified);
        log(BuildMenu.name, "teamTaskMenuITemsreated:" + teamTasksItemsStringified);
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
                menuBarAction(command);
            }
        };
        var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);
        VSS.notifyLoadSucceeded();
    }
    // the center of all actions binded to menu items based on their names
    function menuBarAction(command) {
        // all team element ids begin with "team_", so we know user wants to switch teams
        if (command.startsWith("team_")) {
            LoadTasksOnMainWindow(command);
        }
        else if (command === "manage-teams") {
            ConfigureTeams(command);
        }
        else if (command === "configure-team-tasks") {
            ConfigureTasks(command);
        }
        else if (command === "set-to-default") {
            SetToDefault();
        }
    }
    VSS.notifyLoadSucceeded();
    window.onload = function () {
        return __awaiter(this, void 0, void 0, function () {
            var name;
            return __generator(this, function (_a) {
                name = window.location.pathname.split('/').slice(-1);
                DisableCheckBoxes();
                DisableAddButton();
                registerTasksModelButtonEvents();
                registerTeamsModelButtonEvents();
                LoadRequired();
                log(window.onload.name, "DocumentReady:" + name);
                return [2 /*return*/];
            });
        });
    };
    function LoadRequired() {
        VSS.ready(function () {
            return __awaiter(this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, VSS.require(["VSS/Controls",
                                "VSS/Controls/StatusIndicator",
                                "VSS/Service",
                                "TFS/WorkItemTracking/RestClient",
                                "VSS/Controls/Menus"], function (c, i, s, r, m) {
                                return __awaiter(this, void 0, void 0, function () {
                                    return __generator(this, function (_a) {
                                        switch (_a.label) {
                                            case 0:
                                                vssControls = c;
                                                log(LoadRequired.name, "Required vssControls: " + vssControls);
                                                vssStatusindicator = i;
                                                log(LoadRequired.name, "Required vssStatusIndicator: " + vssStatusindicator);
                                                vssService = s;
                                                log(LoadRequired.name, "Required vssService: " + vssService);
                                                vssWiTrackingClient = r;
                                                log(LoadRequired.name, "Required vssWiTrackingClient: " + vssWiTrackingClient);
                                                vssMenus = m;
                                                log(LoadRequired.name, "Required vssMenus: " + vssMenus);
                                                return [4 /*yield*/, GetDataService()];
                                            case 1:
                                                _a.sent();
                                                MaakMenu(vssControls, vssMenus, vssDataService);
                                                CreateTeamSelectElementInitially(vssDataService);
                                                return [2 /*return*/];
                                        }
                                    });
                                });
                            })];
                        case 1:
                            _a.sent();
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    function GetDataService() {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        log(GetDataService.name, "1->" + vssDataService);
                        return [4 /*yield*/, VSS.getService(VSS.ServiceIds.ExtensionData)];
                    case 1:
                        vssDataService = _a.sent();
                        log(GetDataService.name, "2->" + vssDataService);
                        return [2 /*return*/];
                }
            });
        });
    }
    function registerTasksModelButtonEvents() {
        //Show modal box
        $('#modal_tasks_openModal').click(function () { openTasksModal(); });
        //Hide modal box
        $('#modal_tasks_closeModal').click(function () { closeTasksModal(); });
    }
    function registerTeamsModelButtonEvents() {
        //Show modal box
        $('#modal_teams_openModal').click(function () { openTeamsModal(); });
        //Hide modal box
        $('#modal_teams_closeModal').click(function () { closeTeamsModal(); });
    }
    function openTasksModal() { $('.modal_tasks').show(); }
    function closeTasksModal() { $('.modal_tasks').hide(); }
    function openTeamsModal() { $('.modal_teams').show(); }
    function closeTeamsModal() { $('.modal_teams').hide(); }
    function log(callerName, logTekst) {
        var tekst = (logTekst !== null && typeof logTekst !== "undefined") ? logTekst : "";
        console.log(callerName + ": " + tekst);
    }
    function CreateDefaultSettingsWhenEmpty() {
        try {
            FindCollection();
        }
        catch (e) {
            CreateFirstTimeCollection();
        }
    }
    function FindCollection() {
        log(FindCollection.name, "3: " + vssDataService);
        vssDataService.getDocuments(TeamSettingsCollectionName)
            .then(function (docs) {
            if (docs.length < 1) {
                CreateFirstTimeCollection();
            }
            log(FindCollection.name, "Number of docs found: " + docs.length);
        }, // on reject
        function (err) {
            CreateFirstTimeCollection();
            log(FindCollection.name, "Nothing found. Default Created.");
        });
        log(FindCollection.name, "Found");
    }
    function CreateFirstTimeCollection() {
        log(CreateFirstTimeCollection.name, "4: " + vssDataService);
        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };
        vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            log(CreateFirstTimeCollection.name, "Default document created: " + doc.text);
        });
        log(CreateFirstTimeCollection.name, "Done");
    }
    function DisableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null || (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i];
                checkbox.disabled = true;
            }
        }
    }
    function EnableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i];
                checkbox.disabled = false;
            }
        }
    }
    function DisableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (parentWorkItem === undefined || parentWorkItem === null || !parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = true;
        }
    }
    function EnableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (parentWorkItem !== undefined && parentWorkItem !== null && parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = false;
        }
    }
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
    var WimWorkItem = /** @class */ (function () {
        function WimWorkItem(workItemQueryResult) {
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
                this.title = workItemQueryResult.fields[Enm_WorkitemFields.Title];
                this.workItemType = workItemQueryResult.fields[Enm_WorkitemFields.WorkItemType];
                this.workItemProjectName = workItemQueryResult.fields[Enm_WorkitemFields.TeamProject];
                this.workItemIterationPath = workItemQueryResult.fields[Enm_WorkitemFields.IterationPath];
                this.workItemAreaPath = workItemQueryResult.fields[Enm_WorkitemFields.AreaPath];
                this.workItemTaskActivity = Enm_WorkitemFields.TaskActivity;
                this.allowedToAddTasks = CheckAllowedToAddTaskToPbi(this);
            }
        }
        return WimWorkItem;
    }());
    function MapWorkItemFields(witemObject, witem) {
        witemObject.Title = witem.fields["System.Title"];
    }
    function ExistingWitFieldFocussed() {
        var field = document.getElementById("existing-wit-id");
        if (field.value === "workitem ID") {
            field.value = "";
        }
    }
    function OpenButtonClicked(obj) {
        return __awaiter(this, void 0, void 0, function () {
            var witId, checkBoxes, addButton, e_1, exc;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        parentWorkItem = null;
                        witClient = vssWiTrackingClient.getClient();
                        witId = parseInt(document.getElementById("existing-wit-id").value);
                        checkBoxes = document.getElementsByClassName("checkbox");
                        addButton = document.getElementById("addTasksButton");
                        _a.label = 1;
                    case 1:
                        _a.trys.push([1, 3, , 4]);
                        return [4 /*yield*/, witClient.getWorkItem(witId) // when only specific fields required , ["System.Title", "System.WorkItemType"])
                                .then(function (workitemResult) {
                                parentWorkItem = new WimWorkItem(workitemResult);
                                ShowSelectedWorkitemOnPage(parentWorkItem);
                            })];
                    case 2:
                        _a.sent();
                        if (parentWorkItem === undefined || parentWorkItem === null) {
                            WorkItemNietGevonden();
                        }
                        return [3 /*break*/, 4];
                    case 3:
                        e_1 = _a.sent();
                        exc = e_1;
                        WorkItemNietGevonden(e_1);
                        return [3 /*break*/, 4];
                    case 4: return [2 /*return*/];
                }
            });
        });
    }
    function WorkItemNietGevonden(e) {
        var exceptionMessage = "";
        if (e != null && e.message.length > 0) {
            exceptionMessage = e.message;
        }
        document.getElementById("existing-wit-text").innerHTML = "Workitem niet gevonden. " + exceptionMessage;
        DisableCheckBoxes();
        DisableAddButton();
    }
    function MainPageEnterPressed(event) {
        if (event.key === "Enter") {
            event.preventDefault();
            OpenButtonClicked(null);
        }
    }
    function CheckAllowedToAddTaskToPbi(parentWorkItem) {
        if (parentWorkItem.workItemType !== "Product Backlog Item" && parentWorkItem.workItemType !== "Bug") {
            return false;
        }
        return true;
    }
    function ShowSelectedWorkitemOnPage(workItem) {
        var allowToAdd = CheckAllowedToAddTaskToPbi(workItem);
        if (!allowToAdd) {
            document.getElementById("existing-wit-text").className = "existing-wit-text-not";
            document.getElementById("existing-wit-text").innerHTML =
                "Aan een " + workItem.workItemType + " mag geen Task toegevoegd worden." +
                    "</br> " +
                    "(" + workItem.id + ")" + workItem.title;
            DisableCheckBoxes();
            DisableAddButton();
        }
        else {
            document.getElementById("existing-wit-text").className = "existing-wit-text";
            document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;
            EnableCheckBoxes();
            EnableAddButton();
        }
        VSS.notifyLoadSucceeded();
    }
    function GetWorkItemTypes(callback) {
        VSS.require(["TFS/WorkItemTracking/RestClient"], function (_restWitClient) {
            witClient = _restWitClient.getClient();
            witClient.getWorkItemTypes(VSS.getWebContext().project.name)
                .then(function () {
                callback();
            });
        });
    }
    function teamInpChangeHandler() {
        var teamsOnForm = document.getElementsByName("teamInpNaam");
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises;
            teamDeletionPromises.push(new Promise(function () { }));
            var added = false;
            teamDocs.forEach(function (element) {
                teamDeletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
            });
            Promise.all(teamDeletionPromises).then(function (service) {
                if (!added) {
                    log(teamInpChangeHandler.name, "Doc verwijderd");
                    AddTeamDocs(teamsOnForm, vssDataService);
                    VSS.notifyLoadSucceeded();
                }
            });
            // refactor this
            if (!added) {
                log(teamInpChangeHandler.name, "Doc verwijderd");
                AddTeamDocs(teamsOnForm, vssDataService);
                VSS.notifyLoadSucceeded();
            }
        });
        log(teamInpChangeHandler.name, "Finished");
        closeTeamsModal();
    }
    function AddTeamDocs(teamsCollection, dataService) {
        for (var i = 0; i < teamsCollection.length; i++) {
            var teamnaam = teamsCollection[i].value;
            log(AddTeamDocs.name, teamnaam);
            var newDoc = {
                type: "team",
                text: teamnaam
            };
            dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                log(AddTeamDocs.name, doc.text);
            });
            log(AddTeamDocs.name, "Team Setting Added: " + teamnaam);
            reloadHost();
        }
    }
    //////////////settings////////////////////////////////////////////////////////////////////
    //https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
    //see all settings
    //http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents
    function ConfigureTeams(command) {
        $('.modal_teams').show();
    }
    //function OpenTeamsConfiguratieDialoog(title) {
    //    if (typeof teamDialog.showModal === "function") {
    //        teamDialog.showModal();
    //    } else {
    //        alert("The dialog API is not supported by this browser");
    //    }
    //    teamDialog.addEventListener('close', function onClose() {
    //        log("closing teamsettings");
    //    });
    //}
    //function GetTeams() {
    //    log("GetTeams() executed");
    //    GetAllTeamSettings();
    //}
    //function getExistingSettings(dataservice) {
    //    dataservice.getDocuments(TeamSettingsCollectionName).then(
    //        function (docs) {
    //            log("GetAllTeamSettingsNew :" + docs.length);
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
    //    log("checkNew: " + result);
    //}
    //function addSetting(dataService, teamName) {
    //    var newDoc = {
    //        text: teamName
    //    };
    //    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
    //        log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
    //    });
    //    log("SettingNEw NOT exists.");
    //}
    function SetTeamSettings(teamName) {
        var temp = [];
        var result;
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            log(SetTeamSettings.name, "GetAllTeamSettings :" + docs.length);
            result = docs.find(function (obj) { return obj.text === teamName; });
            docs.forEach(function (element) {
                temp.push(element);
            });
            VSS.notifyLoadSucceeded();
        });
        if (typeof result === 'undefined') {
            log(SetTeamSettings.name, "Setting exists.");
        }
        else {
            var newDoc = {
                type: "team",
                text: teamName
            };
            vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                log(SetTeamSettings.name, "SetTeamSetting (CreateTeams) : " + doc.text);
            });
            log(SetTeamSettings.name, "Setting NOT exists.");
        }
        VSS.notifyLoadSucceeded();
    }
    function GetAllTeamSettings() {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            log(GetAllTeamSettings.name, "GetAllTeamSettings :" + docs.length);
            VSS.notifyLoadSucceeded();
            return docs;
        });
        VSS.notifyLoadSucceeded();
    }
    function reloadHost() {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            console.log("navigationService.reload()");
            navigationService.reload();
        });
        log(reloadHost.name, null);
    }
    VSS.notifyLoadSucceeded();
    var Enm_WorkitemPaths = {
        AreaPath: "/fields/System.AreaPath",
        TeamProject: "/fields/System.TeamProject",
        IterationPath: "/fields/System.IterationPath",
        WorkItemType: "/fields/System.WorkItemType",
        State: "/fields/System.State",
        Reason: "/fields/System.Reason",
        CreatedDate: "/fields/System.CreatedDate",
        CreatedBy: "/fields/System.CreatedBy",
        ChangedDate: "/fields/System.ChangedDate",
        ChangedBy: "/fields/System.ChangedBy",
        Title: "/fields/System.Title",
        BoardColumn: "/fields/System.BoardColumn",
        BoardColumnDone: "/fields/System.BoardColumnDone",
        BacklogPriority: "/fields/Microsoft.VSTS.Common.BacklogPriority",
        Severity: "/fields/Microsoft.VSTS.Common.Severity",
        KanBanColumn: "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column",
        KanBanColumnDone: "/fields/WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done",
        TopDeskWijzigingNr: "/fields/dSZW.Socrates.TopDeskWijzigingNr",
        SystemInfo: "/fields/Microsoft.VSTS.TCM.SystemInfo",
        ReproSteps: "/fields/Microsoft.VSTS.TCM.ReproSteps",
        TaskActivity: "/fields/Microsoft.VSTS.Common.Activity",
        url: "/fields/url",
        AllRelations: "/relations/-",
        SpecficRelations: "/relations/"
    };
    var Enm_WorkitemFields = {
        AreaPath: "System.AreaPath",
        TeamProject: "System.TeamProject",
        IterationPath: "System.IterationPath",
        WorkItemType: "System.WorkItemType",
        State: "System.State",
        Reason: "System.Reason",
        CreatedDate: "System.CreatedDate",
        CreatedBy: "System.CreatedBy",
        ChangedDate: "System.ChangedDate",
        ChangedBy: "System.ChangedBy",
        Title: "System.Title",
        BoardColumn: "System.BoardColumn",
        BoardColumnDone: "System.BoardColumnDone",
        BacklogPriority: "Microsoft.VSTS.Common.BacklogPriority",
        Severity: "Microsoft.VSTS.Common.Severity",
        KanBanColumn: "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column",
        KanBanColumnDone: "WEF_FA00BAB5AFBB4E299544ED2121CDE143_Kanban.Column.Done",
        TopDeskWijzigingNr: "dSZW.Socrates.TopDeskWijzigingNr",
        SystemInfo: "Microsoft.VSTS.TCM.SystemInfo",
        ReproSteps: "Microsoft.VSTS.TCM.ReproSteps",
        TaskActivity: "Microsoft.VSTS.Common.Activity",
        url: "url",
        AllRelations: "/relations/-",
        SpecficRelations: "/relations/"
    };
    var Enm_JsonPatchOperations = {
        Add: "add"
    };
    function removeTeamFieldClickHandler(obj) {
        obj.parentNode.remove();
        log(removeTeamFieldClickHandler.name, "Fields removed.");
    }
    function removeTaskFieldClickHandler(obj) {
        obj.parentNode.remove();
        log(removeTaskFieldClickHandler.name, "Fields removed.");
    }
    function addTeamHandler(name) {
        var teamTitle = (name !== null && typeof name !== "undefined") ? name : defaultTeamName;
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
    }
    function addTaskToConfigurationHandler(title, type) {
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
    function removeDefaultTextHandler(focusedObject) {
        if (focusedObject.value === defaultTaskTitle || focusedObject.value === defaultTeamName) {
            focusedObject.value = "";
        }
        log(removeDefaultTextHandler.name, null);
    }
    function ConfigureTasks(teamnaam) {
        var substringVanaf = "tasks_".length;
        var parsedTeamnaam = teamnaam.substring(substringVanaf);
        log(ConfigureTasks.name, parsedTeamnaam);
        openTasksModal();
    }
    //function OpenTaskConfiguratieDialoog(teamNaam) {
    //    if (typeof tasksDialog.showModal === "function") {
    //        tasksDialog.showModal();
    //    } else {
    //        alert("The dialog API is not supported by this browser");
    //    }
    //    tasksDialog.addEventListener('close', function onClose() {
    //        log("closing teamsettings");
    //    });
    //}
    function taskInpChangeHandler() {
        var t = document.getElementsByClassName('taskInputRow');
        UpdateTasksDocs(t);
        log(taskInpChangeHandler.name, null);
    }
    function UpdateTasksDocs(tasks) {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam; });
            log(UpdateTasksDocs.name, "Emptying task settings." + taskDocs.length + " settings will be removed.");
            var added = false;
            var deletionPromises;
            deletionPromises.push(new Promise(function () { }));
            taskDocs.forEach(function (element) {
                deletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
            });
            Promise.all(deletionPromises).then(function (service) {
                if (!added) {
                    AddTasksDocs(tasks, selectedTeam);
                    added = true;
                }
                log(UpdateTasksDocs.name, "Tasks updated");
            });
            // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden.
            if (!added) {
                AddTasksDocs(tasks, selectedTeam);
                added = true;
            }
            log(UpdateTasksDocs.name, "adding new doc "); // + newDoc.taskId);
        });
        VSS.notifyLoadSucceeded();
    }
    function AddTasksDocs(tasks, teamName) {
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
                    log(AddTasksDocs.name, "created document : " + doc.text);
                }
            });
            closeTasksModal();
            reloadHost();
        }
    }
    function TeamSelectedHandler(obj) {
        selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (selectedTeam === undefined) {
            GetTeamInAction().then(function (v) { selectedTeam = v; });
        }
        LoadTeamTasks(selectedTeam);
        EnableBtn("voegTaskToe");
        EnableBtn("taskDialogConfirmBtn");
        log(TeamSelectedHandler.name, null);
    }
    function EnableBtn(id) {
        document.getElementById(id).removeAttribute("disabled");
    }
    function CreateTeamSelectElementInitially(vssDataService) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                log(CreateTeamSelectElementInitially.name, "Received dataservice: " + vssDataService);
                vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                    var x = 0;
                    // only teams setting. Not other settings
                    var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
                    log(CreateTeamSelectElementInitially.name, "Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings.");
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
                        addTeamHandler(element.text);
                    });
                    VSS.notifyLoadSucceeded();
                });
                log(CreateTeamSelectElementInitially.name, "Done loading teams.");
                return [2 /*return*/];
            });
        });
    }
    function LoadTeamTasks(selection) {
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            log(LoadTeamTasks.name, docs.length);
            var x = 0;
            if (selection === undefined) {
                selection = GetTeamInAction();
            }
            // only team task setting. Not other settings
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });
            log(LoadTeamTasks.name, "Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");
            var taskInputRowDivs = $('div.taskInputRow');
            taskInputRowDivs.remove();
            log(LoadTeamTasks.name, 'Build new list with ' + teamTasks.length + ' items.');
            teamTasks.forEach(function (element) {
                addTaskToConfigurationHandler(element.title, element.activityType);
            });
            VSS.notifyLoadSucceeded();
        });
    }
    function LoadTasksOnMainWindow(teamnaam) {
        var parsedTeamnaam;
        if (teamnaam.startsWith("team_")) {
            var substringVanaf = "team_".length;
            parsedTeamnaam = teamnaam.substring(substringVanaf);
        }
        else {
            parsedTeamnaam = teamnaam;
        }
        SetTeamInAction(parsedTeamnaam);
        log(LoadTasksOnMainWindow.name, "Registered team-naam-in-actie ");
        VSS.register("team-naam-in-actie", parsedTeamnaam);
        SetPageTitle(parsedTeamnaam);
        var taskFieldSet = document.getElementById("task-checkbox");
        // first remove all 
        while (taskFieldSet.firstChild) {
            taskFieldSet.removeChild(taskFieldSet.firstChild);
        }
        vssDataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            log(LoadTasksOnMainWindow.name, docs.length);
            // only team task setting. Not other settings or other tam tasks
            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selectedTeam.toLowerCase(); });
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
    function SetPageTitle(teamname) {
        var constantTitle = "Workitem Manager ";
        var teamNameToPresent = teamname.charAt(0).toUpperCase() + teamname.slice(1);
        var pageTitleText = constantTitle + "for team " + teamNameToPresent;
        document.getElementById("pageTitle").innerHTML = pageTitleText;
        log(SetPageTitle.name, "Selected team: " + teamname + " - Presented team: " + teamNameToPresent);
    }
    function CheckUncheck(obj) {
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
        log(CheckUncheck.name, null);
    }
    function AddTasksButtonClicked(obj) {
        CheckAllowedToAddTaskToPbi(parentWorkItem);
        var taskCheckboxes = document.getElementsByName("taskcheckbox");
        var selectedCheckboxes = GetSelectedCheckboxes(taskCheckboxes);
        var tasksToPairWithWorkitem = CreateTasksToAdd(selectedCheckboxes);
        var jsonPatchDocs = CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
        PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);
        LoadTasksOnMainWindow(selectedTeam);
        log(AddTasksButtonClicked.name, null);
    }
    function PairTasksToWorkitem(docs, parent) {
        var numberOfTasksHandled = 0;
        var container = $("#tasksContainer");
        var options = {
        //target: $("#tasksContainer"),
        //cancellable: true,
        //cancelTextFormat: "{0} to cancel",
        //cancelCallback: function () {
        //    console.log("cancelled");
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
        log(PairTasksToWorkitem.name, null);
    }
    function CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];
        tasks.forEach(function (element) {
            retval.push(new jsonPatchDoc(element).returnPatchDoc);
        });
        log(CreateJsonPatchDocsForTasks.name, null);
        return retval;
    }
    function jsonPatchDoc(task) {
        this.returnPatchDoc = [
            {
                "op": Enm_JsonPatchOperations.Add,
                "path": Enm_WorkitemPaths.Title,
                "value": task.title
            },
            {
                "op": Enm_JsonPatchOperations.Add,
                "path": Enm_WorkitemPaths.IterationPath,
                "value": task.workItemIterationPath
            },
            {
                "op": Enm_JsonPatchOperations.Add,
                "path": Enm_WorkitemPaths.AreaPath,
                "value": task.workItemAreaPath
            },
            {
                "op": Enm_JsonPatchOperations.Add,
                "path": Enm_WorkitemPaths.TaskActivity,
                "value": task.workItemTaskActivity
            },
            {
                "op": Enm_JsonPatchOperations.Add,
                "path": Enm_WorkitemPaths.AllRelations,
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
        log(jsonPatchDoc.name, null);
    }
    function CreateTasksToAdd(selectedCheckboxes) {
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
        log(CreateTasksToAdd.name, "Created tasks: " + retval.length);
        return retval;
    }
    function checkBoxInfo(title, activityType) {
        this.Title = title;
        this.ActivityType = activityType;
        log(checkBoxInfo.name, null);
    }
    function GetSelectedCheckboxes(allCheckboxes) {
        var retval = [];
        allCheckboxes.forEach(function (element) {
            if (element.checked) {
                retval.push(new checkBoxInfo(element.labels[0].innerText, element.value));
            }
        });
        log(GetSelectedCheckboxes.name, "Selected checkboxes: " + retval.length);
        return retval;
    }
    function SetTeamInAction(teamnaam) {
        vssDataService.setValue("team-in-action", teamnaam).then(function () {
            return __awaiter(this, void 0, void 0, function () {
                var teamInAction;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0:
                            console.log("SetTeamInAction(): Set team - " + teamnaam);
                            return [4 /*yield*/, vssDataService.getValue("team-in-action")];
                        case 1:
                            teamInAction = _a.sent();
                            log(SetTeamInAction.name, "team-in-action is now: " + teamInAction);
                            return [2 /*return*/];
                    }
                });
            });
        });
    }
    ;
    function GetTeamInAction() {
        return __awaiter(this, void 0, void 0, function () {
            var retval, teamInAction;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, vssDataService.getValue("team-in-action")];
                    case 1:
                        teamInAction = _a.sent();
                        log(GetTeamInAction.name, "Retrieved team in action value - " + teamInAction);
                        retval = teamInAction;
                        return [2 /*return*/, retval];
                }
            });
        });
    }
    function SetToDefault() {
        if (window.confirm("Alle instellingen terugzetten naar standaard instellingen?")) {
            DeleteAllSettings();
            CreateTeams();
        }
        function DeleteAllSettings() {
            log(SetToDefault.name, "DeleteAllettings()");
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                // Get all document under the collection
                dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
                    //console.log("There are " + docs.length + " in the collection.");
                    docs.forEach(function (element) {
                        DeleteTeamSettings(dataService, element.id, element.text);
                    });
                    VSS.notifyLoadSucceeded();
                });
                VSS.notifyLoadSucceeded();
            });
        }
        function DeleteTeamSettings(dservice, docId, docText) {
            log(DeleteTeamSettings.name, docId + " " + docText);
            if (dservice !== null) {
                dservice.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
                    log(DeleteTeamSettings.name, "Doc verwijderd");
                    VSS.notifyLoadSucceeded();
                });
            }
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                dataService.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
                    log(DeleteTeamSettings.name, "Doc verwijderddd");
                    VSS.notifyLoadSucceeded();
                });
                VSS.notifyLoadSucceeded();
            });
        }
        function CreateTeams() {
            log(CreateTeams.name, "executing");
            SetTeamSettingsNew("Xtreme");
            SetTeamSettingsNew("Committers");
            SetTeamSettingsNew("Test");
            SetTeamSettingsNew("NieuweTest");
            log(CreateTeams.name, "executed.");
        }
        function SetTeamSettingsNew(teamName) {
            log(SetTeamSettingsNew.name, teamName);
            VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                var newDoc = {
                    type: "team",
                    text: teamName
                };
                dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                    // Even if no ID was passed to createDocument, one will be generated
                    log(SetTeamSettingsNew.name, doc.text);
                });
                VSS.notifyLoadSucceeded();
            });
        }
    }
});
//function FirstTimeSetupData() {
//    //// First time setup code
//    //DeleteAllSettings();
//    //CreateTeams();
//    //var allTasks = [
//    //    { type: "task", owner: "xtreme",     title: "Kick-off",                             taskId: "xtremekickoff",                            activityType: "Requirements" },
//    //    { type: "task", owner: "xtreme",     title: "UC/UCR",                               taskId: "xtremeucr",                                activityType: "Requirements" },
//    //    { type: "task", owner: "xtreme",     title: "UC/UCR Review",                        taskId: "xtremeucrreview",                          activityType: "Requirements" },
//    //    { type: "task", owner: "xtreme",     title: "Code",                                 taskId: "xtremecode",                               activityType: "Development" },
//    //    { type: "task", owner: "xtreme",     title: "Code Review",                          taskId: "xtremecodereview",                         activityType: "Development" },
//    //    { type: "task", owner: "xtreme",     title: "Test",                                 taskId: "xtremetest",                               activityType: "Testing" },
//    //    { type: "task", owner: "xtreme",     title: "Test Review",                          taskId: "xtremetestreview",                         activityType: "Testing" },
//    //    { type: "task", owner: "xtreme",     title: "Regressietests aanmaken/aanpassen",    taskId: "xtremeregressietestsaanmakenaanpassen",    activityType: "Testing" },
//    //    { type: "task", owner: "xtreme",     title: "Wijzigingsverslag + Review",           taskId: "xtremewijzigingsverslagreview",            activityType: "Documentation" },
//    //    { type: "task", owner: "xtreme",     title: "Releasenotes",                         taskId: "xtremereleasenotes",                       activityType: "Documentation" },
//    //    { type: "task", owner: "xtreme",     title: "Reviewdocument",                       taskId: "xtremerevoewdcument",                      activityType: "Documentation" },
//    //    { type: "task", owner: "xtreme",     title: "Stuurdata aanvragen",                  taskId: "xtremestuurdataaanvragen",                 activityType: "Development" },
//    //    { type: "task", owner: "xtreme",     title: "Sonarmeldingen",                       taskId: "xtremesonarmeldingen",                     activityType: "Development" },
//    //    { type: "task", owner: "committers", title: "Bouw",                                 taskId: "committersbouw",                           activityType: "Development" },
//    //    { type: "task", owner: "committers", title: "Test",                                 taskId: "committerstest",                           activityType: "Testing" },
//    //    { type: "task", owner: "committers", title: "Code Review",                          taskId: "committerscodereview",                     activityType: "Development" },
//    //    { type: "task", owner: "committers", title: "Wijzigingsverslag",                    taskId: "committerswijzigingsverslag",              activityType: "Documentation" },
//    //    { type: "task", owner: "committers", title: "Releasenotes",                         taskId: "committersreleasenotes",                   activityType: "Documentation" },
//    //    { type: "task", owner: "committers", title: "DOD controle",                         taskId: "committersdodcontrole",                    activityType: "Requirements" },
//    //    { type: "task", owner: "test",       title: "TestBouw",                             taskId: "testbouw",                                 activityType: "Development" },
//    //    { type: "task", owner: "test",       title: "TestTest",                             taskId: "testtest",                                 activityType: "Testing" },
//    //    { type: "task", owner: "test",       title: "TeestCode Review",                     taskId: "testcodereview",                           activityType: "Development" }
//    //];
//    //LoadAllTasksIntoConfig();
//    //function LoadAllTasksIntoConfig() {
//    //    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
//    //        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
//    //            // delete only tasks setting. Not other settings
//    //            var taskDocs = docs.filter(function (d) { return d.type === 'task' });
//    //            taskDocs.forEach(
//    //                function (element) {
//    //                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
//    //                        console.log("LoadAllTasksIntoConfig(): Task docs verwijderd");
//    //                    });
//    //                }
//    //            );
//    //            allTasks.forEach(
//    //                function (element) {
//    //                    var newDoc = {
//    //                        type: element.type,
//    //                        owner: element.owner,
//    //                        title: element.title,
//    //                        taskid: element.taskId,
//    //                        activityType: element.activityType
//    //                    };
//    //                    dataService.createDocument(TeamSettingsCollectionName, newDoc).then(
//    //                        function (doc) {
//    //                            console.log("LoadAllTasksIntoConfig() CreateDocument : " + doc.id);
//    //                        });
//    //                    VSS.notifyLoadSucceeded();
//    //                });
//    //        });
//    //    });
//    //    VSS.notifyLoadSucceeded();
//    //}
//}
//# sourceMappingURL=witTs.js.map