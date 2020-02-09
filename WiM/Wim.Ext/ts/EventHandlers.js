//import { Logger } from "./Logger.js"
//import { WimWorkItem } from "./wimworkitem.js";
//import { WorkItemHelper } from "./workitemhelper.js";
//import { ViewHelper } from "./ViewHelper.js";
//import { CheckBoxInfo } from "./CheckBoxInfo.js";
//import { JsonPatchDoc } from "./JsonPatchDoc.js";
//import { ModalHelper } from "./ModalHelper.js";
//import { CheckBoxHelper } from "./CheckBoxHelper.js";
//import { WitTsClass } from "./witTs.js";
//export class EventHandlers {
//    TeamSettingsCollectionName: string;
//    parentWorkItem: WimWorkItem;
//    defaultTeamName: string
//    defaultTaskTitle: string
//    vssDataService: IExtensionDataService;
//    vssControls: any;
//    vssStatusindicator;
//    vssService;
//    vssWiTrackingClient;
//    vssMenus;
//    constructor(vssDataService: IExtensionDataService,
//        vssControls: any,
//        vssStatusindicator,
//        vssService,
//        vssWiTrackingClient,
//        vssMenus,
//        TeamSettingsCollectionName: string,
//        parentWorkItem: WimWorkItem,
//        defaultTeamName: string,
//        defaultTaskTitle: string)
//    {
//        this.vssDataService = vssDataService;
//        this.vssControls = vssControls;
//        this.vssStatusindicator = vssStatusindicator;
//        this.vssService = vssService;
//        this.vssWiTrackingClient = vssWiTrackingClient;
//        this.vssMenus = vssMenus;
//        this.TeamSettingsCollectionName = TeamSettingsCollectionName;
//        this.parentWorkItem = parentWorkItem;
//        this.defaultTeamName = defaultTeamName;
//        this.defaultTaskTitle = defaultTaskTitle;
//    }
//    ExistingWitFieldFocussed() {
//        var field = document.getElementById("existing-wit-id") as HTMLInputElement;
//        if (field.value === "workitem ID") {
//            field.value = "";
//        }
//    }
//    async OpenButtonClicked(obj) {
//        var ds = this.vssDataService;
//        var t = this.TeamSettingsCollectionName;
//        var tname = this.defaultTeamName;
//        var tTitle = this.defaultTaskTitle;
//        var parentWorkItem = null;
//        var witClient = this.vssWiTrackingClient.getClient();
//        var witId = parseInt((document.getElementById("existing-wit-id") as HTMLInputElement).value);
//        try {
//            await witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
//                .then(function (workitemResult) {
//                    new Logger().Log("workitemResult", "new");
//                    parentWorkItem = new WimWorkItem(workitemResult, null);
//                    new ViewHelper(ds, t, parentWorkItem, tname, tTitle, this).ShowSelectedWorkitemOnPage(parentWorkItem);
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
//        var pwi = this.parentWorkItem;
//        selectedCheckboxes.forEach(
//            function (element) {
//                var task = new WimWorkItem(null, this.parentWorkItem);
//                task.title = element.title;
//                task.workItemType = "Task";
//                task.workItemProjectName = pwi.workItemProjectName;
//                task.workItemIterationPath = pwi.workItemIterationPath;
//                task.workItemAreaPath = pwi.workItemAreaPath;
//                task.workItemTaskActivity = element.activityType;
//                retval.push(task);
//            });
//        new Logger().Log("CreateTasksToAdd", "Created tasks: " + retval.length);
//        return retval;
//    }
//    private CreateJsonPatchDocsForTasks(tasks) {
//        var retval = [];
//        var pwi = this.parentWorkItem;
//        tasks.forEach(function (element) {
//            retval.push(
//                new JsonPatchDoc(element, pwi).Create() // this.jsonPatchDoc(element).returnPatchDoc
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
//        var waitcontrol = await this.vssControls.create(this.vssStatusindicator.WaitControl, container, options);
//        var client = await this.vssService.getCollectionClient(this.vssWiTrackingClient.WorkItemTrackingHttpClient);
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
//        var allowedToAdd = new WorkItemHelper(this.parentWorkItem).CheckAllowedToAddTaskToPbi();
//        var taskCheckboxes = document.getElementsByName("taskcheckbox");
//        var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
//        var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);
//        var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);
//        this.PairTasksToWorkitem(jsonPatchDocs, this.parentWorkItem);
//        var team;
//        await this.GetTeamInAction().then(function (t) { team = t; });
//        await new ViewHelper(this.vssDataService, this.TeamSettingsCollectionName, this.parentWorkItem, this.defaultTeamName, this.defaultTaskTitle, this).LoadTasksOnMainWindow(team);
//        new Logger().Log("AddTasksButtonClicked", null);
//    }
//    async GetTeamInAction(): Promise<string> {
//        let retval: string
//        let teamInAction = await this.vssDataService.getValue("team-in-action");
//        new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);
//        retval = teamInAction as string;
//        return retval;
//    }
//    async TeamModalOKButtonClicked() {
//        let logger = new Logger();
//        var teamsOnForm = document.getElementsByName("teamInpNaam");
//        await this.vssDataService.getDocuments(this.TeamSettingsCollectionName).then(async function (docs) {
//            // delete only teams setting. Not other settings
//            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
//            // always 1 element for at least 1 iteration in Promises.all
//            var teamDeletionPromises: IPromise<void>[] = [];
//            //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
//            var added = false;
//            teamDocs.forEach(
//                function (element) {
//                    teamDeletionPromises.push(this.vssDataService.deleteDocument(this.TeamSettingsCollectionName, element.id));
//                }
//            );
//            let witTs = new WitTsClass();
//            Promise.all(teamDeletionPromises).then(async function (service) {
//                if (!added) {
//                    logger.Log("teamInpChangeHandler", "Doc verwijderd");
//                    await witTs.AddTeamDocs(teamsOnForm, this.vssDataService);
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
//        new ModalHelper().AddNewTeamInputRow(name, this.defaultTeamName);
//    }
//    TeamModalRemoveTeamButtonClicked(clickedObj) {
//        new ModalHelper().RemoveTeamInputRow(clickedObj);
//    }
//    RemoveDefaultText(focusedObject) {
//        let obj = <HTMLInputElement>focusedObject
//        if (obj.value === this.defaultTaskTitle || obj.value === this.defaultTeamName) {
//            obj.value = "";
//        }
//        new Logger().Log("RemoveDefaultText", null);
//    }
//    TaskModalCancelButtonClicked() {
//        new ModalHelper().CloseTasksModal();
//        new WitTsClass().ReloadHost();
//    }
//    TaskModalAddTaskButtonClicked() {
//        new ModalHelper().AddNewTaskInputRow(null, null, this.defaultTaskTitle);
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
//        let selectedTeam = obj.value.toLowerCase(); //$(this).val();
//        if (selectedTeam === undefined) {
//            this.GetTeamInAction().then(function (v) { this.selectedTeam = v; });
//        }
//        let viewHelper = new ViewHelper(this.vssDataService, this.TeamSettingsCollectionName, this.parentWorkItem, this.defaultTaskTitle, this.defaultTaskTitle, this);
//        viewHelper.LoadTeamTasks(selectedTeam);
//        viewHelper.EnableBtn("voegTaskToe");
//        viewHelper.EnableBtn("taskDialogConfirmBtn");
//        new Logger().Log("TeamSelectedHandler", null);
//    }
//    CheckUncheckAllClicked(obj) {
//        new CheckBoxHelper(this.parentWorkItem).CheckUncheck(obj);
//    }
//}
