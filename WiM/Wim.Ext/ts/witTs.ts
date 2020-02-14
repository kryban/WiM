//////////////settings////////////////////////////////////////////////////////////////////
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
//see all settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents 

/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.sdk.d.ts" />

import { Logger } from "./Logger.js"
import { ModalHelper } from "./ModalHelper.js"
import { VssWorkers } from "./VssWorkers.js";
import { PreLoader } from "./PreLoader.js";

var vssWorkers: VssWorkers;

export class WitTsClass
{
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    async UpdateTasksDocs(tasks) {
        this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName).then(async (docs) => {
            // delete only tasks setting. Not other settings
            var taskDocs = docs.filter((d) => { return d.type === 'task' && d.owner === this.vssWorkers.selectedTeam; });
            let logger = new Logger();
            logger.Log("UpdateTasksDocs", "Emptying task settings." + taskDocs.length + " settings will be removed.");

            var added = false;
            var deletionPromises: IPromise<void>[] = [];
            //deletionPromises.push(new Promise(function () { /*empty*/ }));

            taskDocs.forEach(
                (element) => {
                    deletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(this.vssWorkers.TeamSettingsCollectionName, element.id));
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

            await this.vssWorkers.vssDataService.createDocument(this.vssWorkers.TeamSettingsCollectionName, newDoc).then(function (doc) {
                new Logger().Log("AddTasksDocs","created document : " + doc.text);
            });

            new ModalHelper().CloseTasksModal();
        }
    }

    async UpdateTeamDocs(witTs: WitTsClass, teamsOnForm: NodeListOf<HTMLElement>) {

        let logger = new Logger();
        // first delete all team settings
        await this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName).then(async (docs) => {
            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
            // always 1 element for at least 1 iteration in Promises.all
            var teamDeletionPromises: IPromise<void>[] = [];
            //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
            var added = false;
            teamDocs.forEach((element) => {
                teamDeletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(this.vssWorkers.TeamSettingsCollectionName, element.id));
            });
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
        VSS.notifyLoadSucceeded();
    }

    async AddTeamDocs(teamsCollection) {
        let logger = new Logger();

        for (var i = 0; i < teamsCollection.length; i++) {

            var teamnaam = teamsCollection[i].value;
            logger.Log("AddTeamDocs", teamnaam);

            var newDoc = {
                type: "team",
                text: teamnaam
            };

            await this.vssWorkers.vssDataService.createDocument(this.vssWorkers.TeamSettingsCollectionName, newDoc).then(function (doc) {
                // Even if no ID was passed to createDocument, one will be generated
                this.log("AddTeamDocs", doc.text);
            });

            logger.Log("AddTeamDocs", "Team Setting Added: " + teamnaam);
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
}

window.onload = function ()
{
    let preloader: PreLoader = new PreLoader(vssWorkers);
    preloader.LoadPreConditions(window);
};
