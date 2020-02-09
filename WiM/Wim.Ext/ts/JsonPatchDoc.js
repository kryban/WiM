import { Enm_JsonPatchOperations } from "./Enm_JsonPatchOperations.js";
import { Enm_WorkitemPaths } from "./Enm_WorkitemPaths.js";
import { Logger } from "./Logger.js";
export class JsonPatchDoc {
    constructor(task, parentWorkItem) {
        this.task = task;
        this.parentWorkItem = parentWorkItem;
    }
    Create() {
        let operations = new Enm_JsonPatchOperations();
        let paths = new Enm_WorkitemPaths();
        this.retval = [
            {
                "op": operations.Add,
                "path": paths.Title,
                "value": this.task.title
            },
            {
                "op": operations.Add,
                "path": paths.IterationPath,
                "value": this.task.workItemIterationPath
            },
            {
                "op": operations.Add,
                "path": paths.AreaPath,
                "value": this.task.workItemAreaPath
            },
            {
                "op": operations.Add,
                "path": paths.TaskActivity,
                "value": this.task.workItemTaskActivity
            },
            {
                "op": operations.Add,
                "path": paths.AllRelations,
                "value": {
                    "rel": "System.LinkTypes.Hierarchy-Reverse",
                    "url": this.parentWorkItem.url,
                    "attributes": {
                        "comment": "todo: comment voor decompositie"
                    }
                }
            }
        ];
        new Logger().Log("JsonPatchDoc.Create", "Created JsonPatchdoc for task " + this.task.title);
        return this.retval;
    }
}
