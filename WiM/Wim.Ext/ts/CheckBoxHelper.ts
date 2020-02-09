/// <reference path="logger.ts" />

import { Logger } from "./Logger"

export default class CheckboxHelper {
    parentWorkItem;

constructor(parentWi){
    this.parentWorkItem = parentWi;
}

    DisableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null || (this.parentWorkItem === undefined || this.parentWorkItem === null || !this.parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i] as HTMLInputElement;
                checkbox.disabled = true;
            }
        }
    }

    EnableCheckBoxes() {
        var checkBoxes = document.getElementsByClassName("checkbox");
        if (checkBoxes !== null && (this.parentWorkItem !== undefined && this.parentWorkItem !== null && this.parentWorkItem.allowedToAddTasks)) {
            for (var i = 0; i < checkBoxes.length; i++) {
                var checkbox = checkBoxes[i] as HTMLInputElement;
                checkbox.disabled = false;
            }
        }
    }

    CheckUncheck(obj) {
        var tasks = document.getElementsByName("taskcheckbox");

        if (obj.checked) {
            tasks.forEach(function (element) {
                if (!(element as HTMLInputElement).checked) {
                    element.toggleAttribute("checked");
                }
            });
        }
        else {
            tasks.forEach(function (element) {
                if ((element as HTMLInputElement).checked) {
                    element.toggleAttribute("checked");
                }
            });
        }
        new Logger().Log("CheckUncheck", null);
    }
}