/// <reference path="../node_modules/vss-web-extension-sdk/typings/tfs.d.ts" />
/// <reference path="enm_workitempaths.ts" />
/// <reference path="enm_workitemfields.ts" />
/// <reference path="workitemhelper.ts" />
import { Enm_WorkitemFields } from "./Enm_WorkitemFields.js";
import { WorkItemHelper } from "./WorkItemHelper.js";
export class WimWorkItem {
    constructor(workItemQueryResult, parentWi) {
        this.parentWorkItem = parentWi;
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
            this.allowedToAddTasks = new WorkItemHelper(this.parentWorkItem).CheckAllowedToAddTaskToPbi();
        }
    }
}
