import { WimWorkItem } from "./wimworkitem.js";

export class ButtonHelper {
    parentWorkItem: WimWorkItem;
    constructor(parentWorkItem: WimWorkItem) { this.parentWorkItem = parentWorkItem }

    DisableAddButton() {
        var addButton = document.getElementById("addTasksButton") as HTMLInputElement;
        if (addButton !== null && (this.parentWorkItem === undefined || this.parentWorkItem === null || !this.parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = true;
        }
    }

    EnableAddButton() {
        var addButton = document.getElementById("addTasksButton") as HTMLInputElement;
        if (addButton !== null && (this.parentWorkItem !== undefined && this.parentWorkItem !== null && this.parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = false;
        }
    }

}