import { Logger } from "./Logger.js";
import { EventHandlers } from "./witTs.js";
import { VssWorkers } from "./VssWorkers.js";

export class EventHandlerRegister
{
    vssWorkers: VssWorkers;

    constructor(vssWorkers: VssWorkers) {
        this.vssWorkers = vssWorkers;
    }

    RegisterEvents() {
        var eventHandlers: EventHandlers = new EventHandlers(this.vssWorkers);
        new Logger().Log("PreLoader.RegisterEvents", "Registering events");

        $("#existing-wit-id").focus(eventHandlers.ExistingWitFieldFocussed);
        $("#existing-wit-id").keypress(function (e) { eventHandlers.MainPageEnterPressed(e) });
        $("#existing-wit-button").click(function (e) { eventHandlers.OpenButtonClicked(e) });
        $("#addTasksButton").click(function (e) { eventHandlers.AddTasksButtonClicked(e) });

        $("#tasks-check-all-checkbox").click(function (e) { eventHandlers.CheckUncheckAllClicked(e.target) });

        $("#teamDialogCancelBtn").click(eventHandlers.TeamModalCancelButtonClicked);
        $("#teamDialogConfirmBtn").click(function (e) { eventHandlers.TeamModalOKButtonClicked() });
        $("#voegTeamToe").click(function (e) { eventHandlers.TeamModalAddTeamButtonClicked((e as unknown as HTMLInputElement).value) });

        $("#taskDialogCancelBtn").click(eventHandlers.TaskModalCancelButtonClicked);
        $("#taskDialogConfirmBtn").click(function (e) { eventHandlers.TaskModalOKButtonClicked() });
        $("#voegTaskToe").click(eventHandlers.TaskModalAddTaskButtonClicked);

        // event delegation because elements are created dynamically 
        $(".input_fields_container_part").on("click", ".remove_field", function (e) { eventHandlers.TeamModalRemoveTeamButtonClicked(e.target) });
        $(".input_fields_container_part").on("focus", ".teamNaamInput", function (e) { eventHandlers.RemoveDefaultText(e.target) });
        $(".tasks_input_fields_container_part").on("click", ".remove_task_field", function (e) { eventHandlers.TaskModalRemoveTaskButtonClicked(e.target) });
        $(".tasks_input_fields_container_part").on("focus", ".taskNaamInput", function (e) { eventHandlers.RemoveDefaultText(e.target) });

        $(".teamSelect").change(function (e) { eventHandlers.TeamSelectedHandler(e.target) });

        new Logger().Log("PreLoader.RegisterEvents", "All events registered");
    }
}