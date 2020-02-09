///// <reference path="checkboxhelper.ts" />
//import CheckboxHelper from "./CheckBoxHelper"
//import WimWorkItem from "./wimworkitem";
//import ButtonHelper from "./ButtonHelper";
//export default class WorkItemHelper {
//    parentWorkItem: WimWorkItem;
//    constructor(parentWi: WimWorkItem) { this.parentWorkItem = parentWi }
//    CheckAllowedToAddTaskToPbi() {
//        if (this.parentWorkItem.workItemType === 'undefined' || this.parentWorkItem.workItemType === null ||
//            (this.parentWorkItem.workItemType !== "Product Backlog Item" && this.parentWorkItem.workItemType !== "Bug")
//        ) {
//            return false;
//        }
//        return true;
//    }
//    WorkItemNietGevonden(e?: Error) {
//        let exceptionMessage: string = "";
//        if (e != null && e.message.length > 0) {
//            exceptionMessage = e.message;
//        }
//        document.getElementById("existing-wit-text").innerHTML = "Workitem niet gevonden. " + exceptionMessage;
//        new CheckboxHelper(this.parentWorkItem).DisableCheckBoxes();
//        new ButtonHelper(this.parentWorkItem).DisableAddButton();
//    }
//}
