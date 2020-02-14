
/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.sdk.d.ts" />

import * as TFSWitContracts from "TFS/WorkItemTracking/Contracts";
import { WorkItemTrackingHttpClient4_1 } from "TFS/WorkItemTracking/RestClient";
import { ExtensionDataService } from "VSS/SDK/Services/ExtensionData";

import { Enm_JsonPatchOperations } from "./Enm_JsonPatchOperations.js";
import { Enm_WorkitemFields } from "./Enm_WorkitemFields.js"
import { Logger } from "./Logger.js"
import { ModalHelper } from "./ModalHelper.js"
import { ServiceHelper } from "./ServiceHelper.js"
import { JsonPatchDoc } from "./JsonPatchDoc.js"
import { WimWorkItem } from "./WimWorkItem.js"
import { CheckBoxInfo } from "./CheckBoxInfo.js"
import { CheckBoxHelper } from "./CheckBoxHelper.js"
import { ButtonHelper } from "./ButtonHelper.js"
import { WorkItemHelper } from "./workitemhelper.js";
import { ViewHelper } from "./ViewHelper.js";
import { MenuBuilder } from "./MenuBuilder.js";
import { VssWorkers } from "./VssWorkers.js";
import { EventHandlerRegister } from "./EventHandlerRegister.js";

const TeamSettingsCollectionName: string = "WimCollection";
const defaultTaskTitle: string = "Taak titel";
const defaultTeamName: string = "Team naam";

// to be replaced by VssWorkers
//var parentWorkItem: WimWorkItem;
//var witClient: WorkItemTrackingHttpClient4_1;
//var selectedTeam: string;
//var vssControls: any;
//var vssStatusindicator;
//var vssService;
//var vssWiTrackingClient;
//var vssMenus;
//var vssDataService: IExtensionDataService;

var vssWorkers: VssWorkers;

export class EventHandlers
{
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
                    new ViewHelper(this.vssWorkers.vssDataService, TeamSettingsCollectionName, this.vssWorkers.parentWorkItem,
                        defaultTeamName, defaultTaskTitle).ShowSelectedWorkitemOnPage(this.vssWorkers.parentWorkItem);
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

        tasks.forEach((element)=> {
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

        await new ViewHelper(this.vssWorkers.vssDataService, TeamSettingsCollectionName, this.vssWorkers.parentWorkItem, defaultTeamName, defaultTaskTitle).LoadTasksOnMainWindow(team);
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

        let logger = new Logger();
        let witTs = new WitTsClass(this.vssWorkers);
        var teamsOnForm = document.getElementsByName("teamInpNaam");
        logger.Log("this.vssWorkers.vssDataService team ok", ""+this.vssWorkers);
        await this.vssWorkers.vssDataService.getDocuments(TeamSettingsCollectionName).then(async (docs) => {

            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });

            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises: IPromise<void>[] = [];
            //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))

            var added = false;

            teamDocs.forEach(
                (element) => {
                    teamDeletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
                }
            );

            Promise.all(teamDeletionPromises).then(async (service) => {

                if (!added) {
                    logger.Log("teamInpChangeHandler", "Doc verwijderd");
                    await witTs.AddTeamDocs(teamsOnForm);
                    added = true;
                }
            });

            // refactor this
            if (!added) {
                logger.Log("teamInpChangeHandler", "Doc verwijderd");
                await witTs.AddTeamDocs(teamsOnForm);
                added = true;
            }
        });

        logger.Log("teamInpChangeHandler", "Finished");
        new ModalHelper().CloseTeamsModal();
        witTs.ReloadHost();
        VSS.notifyLoadSucceeded();
    }

    TeamModalCancelButtonClicked() {
        new ModalHelper().CloseTeamsModal();
        new WitTsClass(this.vssWorkers).ReloadHost();
    }

    TeamModalAddTeamButtonClicked(name: string) {
        new ModalHelper().AddNewTeamInputRow(name, defaultTeamName);
    }

    TeamModalRemoveTeamButtonClicked(clickedObj) {
        new ModalHelper().RemoveTeamInputRow(clickedObj);
    }

    RemoveDefaultText(focusedObject) {
        let obj = <HTMLInputElement>focusedObject
        if (obj.value === defaultTaskTitle || obj.value === defaultTeamName) {
            obj.value = "";
        }
        new Logger().Log("RemoveDefaultText", null);
    }

    TaskModalCancelButtonClicked() {
        new ModalHelper().CloseTasksModal();
        new WitTsClass(this.vssWorkers).ReloadHost();
    }

    TaskModalAddTaskButtonClicked() {
        new ModalHelper().AddNewTaskInputRow(null, null, defaultTaskTitle);
    }

    TaskModalRemoveTaskButtonClicked(clickedObj) {
        new ModalHelper().RemoveTaskInputRow(clickedObj);
    }

    TaskModalOKButtonClicked() {
        var t = document.getElementsByClassName('taskInputRow');
        new WitTsClass(this.vssWorkers).UpdateTasksDocs(t);
        new Logger().Log("TaskModalOKButtonClicked", null);
    }

    TeamSelectedHandler(obj) {
        this.vssWorkers.selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (this.vssWorkers.selectedTeam === undefined) {
            this.GetTeamInAction().then((v) => { this.vssWorkers.selectedTeam = v; });
        }

        let viewHelper = new ViewHelper(this.vssWorkers.vssDataService, TeamSettingsCollectionName, this.vssWorkers.parentWorkItem, defaultTeamName, defaultTaskTitle);

        viewHelper.LoadTeamTasks(this.vssWorkers.selectedTeam);
        viewHelper.EnableBtn("voegTaskToe");
        viewHelper.EnableBtn("taskDialogConfirmBtn");

        new Logger().Log("TeamSelectedHandler", null);
    }

    CheckUncheckAllClicked(obj) {
        new CheckBoxHelper(this.vssWorkers.parentWorkItem).CheckUncheck(obj);
    }
}

class PreLoader
{
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    FindCollection() {

        let logger = new Logger();
        logger.Log("FindCollection", "3: " + this.vssWorkers.vssDataService);

        this.vssWorkers.vssDataService.getDocuments(TeamSettingsCollectionName)
            .then(
                (docs) => {
                    if (docs.length < 1) {
                        this.CreateFirstTimeCollection();
                    }
                    logger.Log("FindCollection", "Number of docs found: " + docs.length);
                }, // on reject
                (err) => {
                    this.CreateFirstTimeCollection();
                    logger.Log("FindCollection", "Nothing found. Default Created.");
                }
            );

        logger.Log("FindCollection", "Found");
    }

    CreateFirstTimeCollection() {
        let logger = new Logger();
        logger.Log("CreateFirstTimeCollection", "4: " + this.vssWorkers.vssDataService);
        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };

        this.vssWorkers.vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            logger.Log("CreateFirstTimeCollection", "Default document created: " + doc.text);
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

    //LoadPreState() {
    //    let modalHelper: ModalHelper = new ModalHelper();

    //    if (document.readyState == "complete") {
    //        var name = window.location.pathname.split('/').slice(-1);

    //        new CheckBoxHelper(parentWorkItem).DisableCheckBoxes();
    //        new ButtonHelper(parentWorkItem).DisableAddButton();

    //        //this.registerTasksModelButtonEvents(modalHelper);
    //        //this.registerTeamsModelButtonEvents(modalHelper);

    //        this.LoadRequired();

    //        new Logger().Log("window.onload", "DocumentReady:" + name);
    //    }
    //}

    async LoadPreConditions(window) {

        await this.LoadRequired();

        var name = window.location.pathname.split('/').slice(-1);

        new CheckBoxHelper(this.vssWorkers.parentWorkItem).DisableCheckBoxes();
        new ButtonHelper(this.vssWorkers.parentWorkItem).DisableAddButton();
        new EventHandlerRegister(this.vssWorkers).RegisterEvents();

        new Logger().Log("window.onload", "DocumentReady:" + name);
    }

    async LoadRequired() {
        let logger: Logger = new Logger();
        this.vssWorkers = new VssWorkers();

        logger.Log("LoadRequired()", "Begin of LoadRequired()");
        VSS.ready(async () => {
            await VSS.require(["VSS/Controls", "VSS/Controls/StatusIndicator", "VSS/Service", "TFS/WorkItemTracking/RestClient", "VSS/Controls/Menus"],
                async (c, i, s, r, m) => {
                    this.vssWorkers.vssControls = c;
                    this.vssWorkers.vssStatusindicator = i;
                    this.vssWorkers.vssService = s;
                    this.vssWorkers.vssWiTrackingClient = r;
                    this.vssWorkers.vssMenus = m;

                    logger.Log("LoadRequired", "Required vssControls: " + this.vssWorkers.vssControls);
                    logger.Log("LoadRequired", "Required vssStatusIndicator: " + this.vssWorkers.vssStatusindicator);
                    logger.Log("LoadRequired", "Required vssService: " + this.vssWorkers.vssService);
                    logger.Log("LoadRequired", "Required vssWiTrackingClient: " + this.vssWorkers.vssWiTrackingClient);
                    logger.Log("LoadRequired", "Required vssMenus: " + this.vssWorkers.vssMenus);

                    this.vssWorkers.vssDataService = await new ServiceHelper().GetDataService();
                    await new MenuBuilder(this.vssWorkers.vssDataService, TeamSettingsCollectionName,
                        this.vssWorkers.parentWorkItem, defaultTeamName, defaultTaskTitle)
                        .BuildMenu(this.vssWorkers.vssControls, this.vssWorkers.vssMenus);
                    new ViewHelper(this.vssWorkers.vssDataService, TeamSettingsCollectionName, this.vssWorkers.parentWorkItem,
                        defaultTeamName, defaultTaskTitle).CreateTeamSelectElementInitially();

                    VSS.notifyLoadSucceeded();
                });
        });
    }
}

class WitTsClass
{
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    async UpdateTasksDocs(tasks) {

        this.vssWorkers.vssDataService.getDocuments(TeamSettingsCollectionName).then(async (docs) => {
            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter((d) => { return d.type === 'task' && d.owner === this.vssWorkers.selectedTeam; });
            let logger = new Logger();
            logger.Log("UpdateTasksDocs", "Emptying task settings." + taskDocs.length + " settings will be removed.");

            var added = false;
            var deletionPromises: IPromise<void>[] = [];
            //deletionPromises.push(new Promise(function () { /*empty*/ }));

            taskDocs.forEach(
                (element) => {
                    deletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
                    logger.Log("UpdateTasksDocs","Created promise for deletion");
                }
            );

            let curr: WitTsClass = this
            await Promise.all(deletionPromises).then(async (s) => {

                if (!added) {
                    new WitTsClass(this.vssWorkers).AddTasksDocs(tasks, this.vssWorkers.selectedTeam);
                    added = true;
                }
                logger.Log("UpdateTasksDocs", "Tasks updated")
            });

            // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
            // dan toch nog toevoegingen uitgevoerd worden

            if (!added) {
                await curr.AddTasksDocs(tasks, this.vssWorkers.selectedTeam);
                added = true;
            }

            logger.Log("UpdateTasksDocs", "adding new doc ");// + newDoc.taskId);
        });
        VSS.notifyLoadSucceeded();
    }

    async AddTasksDocs(tasks, teamName) {
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

            await this.vssWorkers.vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                new Logger().Log("AddTasksDocs","created document : " + doc.text);
            });

            new ModalHelper().CloseTasksModal();
            this.ReloadHost();
        }
    }

    AddTeamDocs(teamsCollection) {
        let logger = new Logger();

        for (var i = 0; i < teamsCollection.length; i++) {

            var teamnaam = teamsCollection[i].value;
            logger.Log("AddTeamDocs", teamnaam);

            var newDoc = {
                type: "team",
                text: teamnaam
            };

            this.vssWorkers.vssDataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                this.log("AddTeamDocs", doc.text);
            });

            logger.Log("AddTeamDocs", "Team Setting Added: " + teamnaam);
            //this.ReloadHost();
        }
    }

    ReloadHost() {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            console.log("navigationService.reload()");
            (navigationService as IHostNavigationService).reload();
        });
        new Logger().Log("reloadHost", null);
    }

    GetWorkItemTypes(callback) {
        VSS.require(["TFS/WorkItemTracking/RestClient"], (_restWitClient) => {
            this.vssWorkers.witClient = _restWitClient.getClient();

            this.vssWorkers.witClient.getWorkItemTypes(VSS.getWebContext().project.name)
                .then(function () {
                    callback();
                });
        });
    }

    //////////////settings////////////////////////////////////////////////////////////////////
    //https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
    //see all settings
    //http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents 
}

window.onload = function ()
{
    let preloader: PreLoader = new PreLoader(vssWorkers);
    preloader.LoadPreConditions(window);
};
