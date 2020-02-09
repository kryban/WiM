export class ButtonHelper {
    constructor(parentWorkItem) { this.parentWorkItem = parentWorkItem; }
    DisableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (this.parentWorkItem === undefined || this.parentWorkItem === null || !this.parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = true;
        }
    }
    EnableAddButton() {
        var addButton = document.getElementById("addTasksButton");
        if (addButton !== null && (this.parentWorkItem !== undefined && this.parentWorkItem !== null && this.parentWorkItem.allowedToAddTasks)) {
            addButton.disabled = false;
        }
    }
}
