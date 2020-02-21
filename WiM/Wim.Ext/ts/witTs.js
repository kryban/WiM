//////////////settings////////////////////////////////////////////////////////////////////
//https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts
//see all settings
//http://krylp:8080/tfs/DefaultCollection/_apis/ExtensionManagement/InstalledExtensions/bandik/WimDevOpExtension/Data/Scopes/Default/Current/Collections/WimCollection/Documents 
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.d.ts" />
/// <reference path="../node_modules/vss-web-extension-sdk/typings/vss.sdk.d.ts" />
/// <reference path="../node_modules/@types/react/index.d.ts" /> 
/// <reference path="../node_modules/@types/react-dom/index.d.ts" /> 
import { Logger } from "./Logger.js";
import { ModalHelper } from "./ModalHelper.js";
import { PreLoader } from "./PreLoader.js";
var vssWorkers;
export class WitTsClass {
    constructor(vssWorkers) {
        this.vssWorkers = vssWorkers;
    }
    UpdateTasksDocs(tasks) {
        return __awaiter(this, void 0, void 0, function* () {
            this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName).then((docs) => __awaiter(this, void 0, void 0, function* () {
                // delete only tasks setting. Not other settings
                var taskDocs = docs.filter((d) => { return d.type === 'task' && d.owner === this.vssWorkers.selectedTeam; });
                let logger = new Logger();
                logger.Log("UpdateTasksDocs", "Emptying task settings." + taskDocs.length + " settings will be removed.");
                var added = false;
                var deletionPromises = [];
                //deletionPromises.push(new Promise(function () { /*empty*/ }));
                taskDocs.forEach((element) => {
                    deletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(this.vssWorkers.TeamSettingsCollectionName, element.id));
                    logger.Log("UpdateTasksDocs", "Created promise for deletion");
                });
                let curr = this;
                yield Promise.all(deletionPromises).then((s) => __awaiter(this, void 0, void 0, function* () {
                    if (!added) {
                        new WitTsClass(this.vssWorkers).AddTasksDocs(tasks, this.vssWorkers.selectedTeam);
                        added = true;
                    }
                    logger.Log("UpdateTasksDocs", "Tasks updated");
                }));
                // todo: refactor dit is nodig, zodat als er niets te verwijderen valt (1e opgevoerde regel bij nieuwe team)
                // dan toch nog toevoegingen uitgevoerd worden
                if (!added) {
                    yield curr.AddTasksDocs(tasks, this.vssWorkers.selectedTeam);
                    added = true;
                }
                logger.Log("UpdateTasksDocs", "adding new doc "); // + newDoc.taskId);
            }));
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
                yield this.vssWorkers.vssDataService.createDocument(this.vssWorkers.TeamSettingsCollectionName, newDoc).then(function (doc) {
                    new Logger().Log("AddTasksDocs", "created document : " + doc.text);
                });
                new ModalHelper().CloseTasksModal();
            }
        });
    }
    UpdateTeamDocs(witTs, teamsOnForm) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            // first delete all team settings
            yield this.vssWorkers.vssDataService.getDocuments(this.vssWorkers.TeamSettingsCollectionName).then((docs) => __awaiter(this, void 0, void 0, function* () {
                // delete only teams setting. Not other settings
                var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
                logger.Log("UpdateTeamDocs", "Queried team docs: " + teamDocs.length);
                // always 1 element for at least 1 iteration in Promises.all
                var teamDeletionPromises = [];
                //teamDeletionPromises.push(new Promise(function () { /*empty*/ }))
                var added = false;
                teamDocs.forEach((element) => {
                    teamDeletionPromises.push(this.vssWorkers.vssDataService.deleteDocument(this.vssWorkers.TeamSettingsCollectionName, element.id));
                });
                yield Promise.all(teamDeletionPromises).then((service) => __awaiter(this, void 0, void 0, function* () {
                    if (!added) {
                        logger.Log("UpdateTeamDocs", "Docs verwijderd");
                        yield witTs.AddTeamDocs(teamsOnForm);
                        added = true;
                    }
                }));
                // refactor this
                if (!added) {
                    logger.Log("UpdateTeamDocs", "Doc verwijderd");
                    yield witTs.AddTeamDocs(teamsOnForm);
                    added = true;
                }
            }));
            logger.Log("UpdateTeamDocs", "Finished");
            new ModalHelper().CloseTeamsModal();
            VSS.notifyLoadSucceeded();
        });
    }
    AddTeamDocs(teamsCollection) {
        return __awaiter(this, void 0, void 0, function* () {
            let logger = new Logger();
            for (var i = 0; i < teamsCollection.length; i++) {
                var teamnaam = teamsCollection[i].value;
                logger.Log("AddTeamDocs", teamnaam);
                logger.Log("AddTeamDocs", "Number of teams to set: " + teamsCollection.length);
                logger.Log("AddTeamDocs", "Teams set: " + (i + 1));
                var newDoc = {
                    type: "team",
                    text: teamnaam
                };
                yield this.vssWorkers.vssDataService.createDocument(this.vssWorkers.TeamSettingsCollectionName, newDoc).then(function (doc) {
                    // Even if no ID was passed to createDocument, one will be generated
                    logger.Log("AddTeamDocs", doc.text);
                });
                logger.Log("AddTeamDocs", "Team Setting Added: " + teamnaam);
            }
        });
    }
    ReloadHost() {
        VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
            console.log("navigationService.reload()");
            navigationService.reload();
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
window.onload = function () {
    let preloader = new PreLoader(vssWorkers);
    preloader.LoadPreConditions(window);
};
