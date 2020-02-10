import { WimWorkItem } from "./wimworkitem.js";
import { Logger } from "./Logger.js";
import { ViewHelper } from "./ViewHelper.js";
import { WorkItemHelper } from "./workitemhelper.js";
import { CheckBoxInfo } from "./CheckBoxInfo.js";
import { JsonPatchDoc } from "./JsonPatchDoc.js";
import { WitTsClass } from "./witTs.js";
import { ModalHelper } from "./ModalHelper.js";
import { CheckBoxHelper } from "./CheckBoxHelper.js";


export class EventHandlers {
    parentWorkItem: WimWorkItem;
    vssWiTrackingClient;
    vssDataService;
    TeamSettingsCollectionName: string;
    defaultTeamName: string;
    defaultTaskTitle: string;
    vssControls;
    vssStatusindicator;
    vssService;

    logger: Logger = new Logger();

    constructor(parentWorkItem,
        vssWiTrackingClient,
        vssDataService,
        TeamSettingsCollectionName,
        defaultTeamName,
        defaultTaskTitle,
        vssControls,
        vssStatusindicator,
        vssService)
    {
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

    ExistingWitFieldFocussed() {
        var field = document.getElementById("existing-wit-id") as HTMLInputElement;
        if (field.value === "workitem ID") {
            field.value = "";
        }
    }

    async OpenButtonClicked(obj) {

        this.parentWorkItem = null;
        var logger = this.logger;
        var parentWorkItem = this.parentWorkItem;
        var vssDataService = this.vssDataService;
        var TeamSettingsCollectionName = this.TeamSettingsCollectionName;
        var defaultTeamName = this.defaultTeamName;
        var defaultTaskTitle = this.defaultTaskTitle;

        let witClient = this.vssWiTrackingClient.getClient();

        var witId = parseInt((document.getElementById("existing-wit-id") as HTMLInputElement).value);

        try {
            await witClient.getWorkItem(witId)// when only specific fields required , ["System.Title", "System.WorkItemType"])
                .then(function (workitemResult) {
                    logger.Log("workitemResult", "new");
                    parentWorkItem = new WimWorkItem(workitemResult, null);
                    new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).ShowSelectedWorkitemOnPage(parentWorkItem);
                });

            if (parentWorkItem === undefined || parentWorkItem === null) {
                new WorkItemHelper(parentWorkItem).WorkItemNietGevonden();
            }

        } catch (e) {
            let exc: Error = e;
            new WorkItemHelper(parentWorkItem).WorkItemNietGevonden(e);
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
        var parentWorkItem = this.parentWorkItem;

        selectedCheckboxes.forEach(
            function (element) {
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

    private CreateJsonPatchDocsForTasks(tasks) {
        var retval = [];
        var parentWorkItem = this.parentWorkItem;

        tasks.forEach(function (element) {
            retval.push(
                new JsonPatchDoc(element, parentWorkItem).Create() // this.jsonPatchDoc(element).returnPatchDoc
            );
        });

        new Logger().Log("CreateJsonPatchDocsForTasks", null);
        return retval;
    }

    async PairTasksToWorkitem(docs, parent) {
        var vssControls = this.vssControls;
        var vssStatusindicator = this.vssStatusindicator;
        var vssService = this.vssService;
        var vssWiTrackingClient = this.vssWiTrackingClient;

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

        var waitcontrol = await vssControls.create(vssStatusindicator.WaitControl, container, options);
        var client = await vssService.getCollectionClient(vssWiTrackingClient.WorkItemTrackingHttpClient);
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
        var parentWorkItem = this.parentWorkItem;
        var vssDataService = this.vssDataService;
        var TeamSettingsCollectionName = this.TeamSettingsCollectionName;
        var defaultTeamName = this.defaultTeamName;
        var defaultTaskTitle = this.defaultTaskTitle;

        var allowedToAdd = new WorkItemHelper(parentWorkItem).CheckAllowedToAddTaskToPbi();
        var taskCheckboxes = document.getElementsByName("taskcheckbox");
        var selectedCheckboxes = this.GetSelectedCheckboxes(taskCheckboxes);
        var tasksToPairWithWorkitem = this.CreateTasksToAdd(selectedCheckboxes);

        var jsonPatchDocs = this.CreateJsonPatchDocsForTasks(tasksToPairWithWorkitem);

        this.PairTasksToWorkitem(jsonPatchDocs, parentWorkItem);

        var team;
        await this.GetTeamInAction().then(function (t) { team = t; });

        await new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle).LoadTasksOnMainWindow(team);
        new Logger().Log("AddTasksButtonClicked", null);
    }

    async GetTeamInAction(): Promise<string> {
        let retval: string
        let vssDataService = this.vssDataService;
        let teamInAction = await vssDataService.getValue("team-in-action");
        new Logger().Log("GetTeamInAction", "Retrieved team in action value - " + teamInAction);

        retval = teamInAction as string;
        return retval;
    }

    async TeamModalOKButtonClicked(event, vssDataService: IExtensionDataService, TeamSettingsCollectionName: string) {

        let logger = new Logger();
        var teamsOnForm = document.getElementsByName("teamInpNaam");

        await vssDataService.getDocuments(TeamSettingsCollectionName).then(async function (docs) {

            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });

            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises: IPromise<void>[] = [];
            //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))

            var added = false;

            teamDocs.forEach(
                function (element) {
                    teamDeletionPromises.push(vssDataService.deleteDocument(TeamSettingsCollectionName, element.id));
                }
            );

            let witTs = new WitTsClass();
            Promise.all(teamDeletionPromises).then(async function (service) {

                if (!added) {
                    logger.Log("teamInpChangeHandler", "Doc verwijderd");
                    await witTs.AddTeamDocs(teamsOnForm, vssDataService);
                }
            });

            // refactor this
            if (!added) {
                logger.Log("teamInpChangeHandler", "Doc verwijderd");
                await witTs.AddTeamDocs(teamsOnForm, vssDataService);
            }
        });

        logger.Log("teamInpChangeHandler", "Finished");
        new ModalHelper().CloseTeamsModal();
        VSS.notifyLoadSucceeded();
    }

    TeamModalCancelButtonClicked() {
        new ModalHelper().CloseTeamsModal();
        new WitTsClass().ReloadHost();
    }

    TeamModalAddTeamButtonClicked(name: string) {
        new ModalHelper().AddNewTeamInputRow(name, this.defaultTeamName);
    }

    TeamModalRemoveTeamButtonClicked(clickedObj) {
        new ModalHelper().RemoveTeamInputRow(clickedObj);
    }

    RemoveDefaultText(focusedObject) {
        let obj = <HTMLInputElement>focusedObject
        if (obj.value === this.defaultTaskTitle || obj.value === this.defaultTeamName) {
            obj.value = "";
        }
        new Logger().Log("RemoveDefaultText", null);
    }

    TaskModalCancelButtonClicked() {
        new ModalHelper().CloseTasksModal();
        new WitTsClass().ReloadHost();
    }

    TaskModalAddTaskButtonClicked() {
        new ModalHelper().AddNewTaskInputRow(null, null, this.defaultTaskTitle);
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
        let selectedTeam = obj.value.toLowerCase(); //$(this).val();
        if (selectedTeam === undefined) {
            this.GetTeamInAction().then(function (v) { this.selectedTeam = v; });
        }

        let viewHelper = new ViewHelper(this.vssDataService, this.TeamSettingsCollectionName, this.parentWorkItem, this.defaultTeamName, this.defaultTaskTitle);

        viewHelper.LoadTeamTasks(selectedTeam);
        viewHelper.EnableBtn("voegTaskToe");
        viewHelper.EnableBtn("taskDialogConfirmBtn");

        new Logger().Log("TeamSelectedHandler", null);
    }

    CheckUncheckAllClicked(obj) {
        new CheckBoxHelper(this.parentWorkItem).CheckUncheck(obj);
    }
}