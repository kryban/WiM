import { CheckBoxHelper } from "./CheckBoxHelper.js";
import { ButtonHelper } from "./ButtonHelper.js";
export class WorkItemHelper {
    constructor(parentWi) { this.parentWorkItem = parentWi; }
    CheckAllowedToAddTaskToPbi() {
        if (this.parentWorkItem !== null &&
            (this.parentWorkItem.workItemType !== "Product Backlog Item" && this.parentWorkItem.workItemType !== "Bug")) {
            return false;
        }
        return true;
    }
    WorkItemNietGevonden(e) {
        let exceptionMessage = "";
        if (e != null && e.message.length > 0) {
            exceptionMessage = e.message;
        }
        document.getElementById("existing-wit-text").innerHTML = "Workitem niet gevonden. " + exceptionMessage;
        new CheckBoxHelper(this.parentWorkItem).DisableCheckBoxes();
        new ButtonHelper(this.parentWorkItem).DisableAddButton();
    }
}
