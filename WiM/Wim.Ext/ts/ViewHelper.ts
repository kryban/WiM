//import { Logger } from "./Logger.js";
//import { ModalHelper } from "./ModalHelper.js";
//import { WorkItemHelper } from "./workitemhelper.js";
//import { CheckBoxHelper } from "./CheckBoxHelper.js";
//import { ButtonHelper } from "./ButtonHelper.js";
//import { WimWorkItem } from "./wimworkitem.js";
//import { EventHandlers } from "./EventHandlers.js"

//export class ViewHelper {

//    dataservice: IExtensionDataService;
//    TeamSettingsCollectionName: string;
//    parentWorkItem: WimWorkItem;
//    defaultTeamName: string
//    defaultTaskTitle: string
//    EventHandlers: EventHandlers

//    constructor(dataService: IExtensionDataService,
//        TeamSettingsCollectionName: string,
//        parentWorkItem: WimWorkItem,
//        defaultTeamName: string,
//        defaultTaskTitle: string,
//        EventHandlers: EventHandlers) {
//        this.dataservice = dataService;
//        this.TeamSettingsCollectionName = TeamSettingsCollectionName;
//        this.parentWorkItem = parentWorkItem;
//        this.defaultTeamName = defaultTeamName;
//        this.defaultTaskTitle = defaultTaskTitle;
//        this.EventHandlers = EventHandlers;
//    }

//    SetTeamInAction(teamnaam: string, dService: IExtensionDataService) {
//        dService.setValue("team-in-action", teamnaam).then(async function () {
//            new Logger().Log("SetTeamInAction,", "Set team - " + teamnaam);
//            let teamInAction: string = await dService.getValue("team-in-action");
//            new Logger().Log("SetTeamInAction", "team-in-action is now: " + teamInAction);
//        });
//    };

//    SetPageTitle(teamname: string) {
//        const constantTitle = "Workitem Manager ";
//        let teamNameToPresent = teamname.charAt(0).toUpperCase() + teamname.slice(1);
//        let pageTitleText = constantTitle + "for team " + teamNameToPresent;
//        document.getElementById("pageTitle").innerHTML = pageTitleText;
//        new Logger().Log("SetPageTitle", "Selected team: " + teamname + " - Presented team: " + teamNameToPresent);
//    }

//    ConfigureTeams(command) {
//        new ModalHelper().OpenTeamsModal();
//    }

//    ConfigureTasks(teamnaam) {
//        var substringVanaf = "tasks_".length;
//        var parsedTeamnaam = teamnaam.substring(substringVanaf);

//        new Logger().Log("ConfigureTasks", parsedTeamnaam);

//        new ModalHelper().OpenTasksModal();
//    }

//    DeleteTeamSettings(docs: any[], dservice: IExtensionDataService) {
//        docs.forEach(
//            function (doc) {
//                new Logger().Log("DeleteTeamSettings", doc.id + " " + doc.text);

//                if (dservice !== null) {
//                    dservice.deleteDocument(this.TeamSettingsCollectionName, doc.id).then(function () {
//                        this.log("DeleteTeamSettings", "Doc verwijderd");
//                        VSS.notifyLoadSucceeded();
//                    });
//                }

//                dservice.deleteDocument(this.TeamSettingsCollectionName, doc.id).then(function () {
//                    this.log("DeleteTeamSettings", "Doc verwijderddd");
//                });
//            }
//        )
//    }

//    GetTeamSettingsToDelete(dataService: IExtensionDataService) {

//        new Logger().Log("SetToDefault", "DeleteAllettings()");
//        var retval: any[];

//        dataService.getDocuments(this.TeamSettingsCollectionName).then(function (docs) {
//            //console.this.log("There are " + docs.length + " in the collection.");
//            docs.forEach(
//                function (element) {
//                    retval.push(element);
//                }
//            );
//        });

//        return retval;
//    }

//    async SetTeamSettingsNew(dService: IExtensionDataService, teamName: string) {

//        new Logger().Log("SetTeamSettingsNew", teamName);

//        var newDoc = {
//            type: "team",
//            text: teamName
//        };

//        await dService.createDocument(this.TeamSettingsCollectionName, newDoc).then(function (doc) {
//            // Even if no ID was passed to createDocument, one will be generated
//            this.log("SetTeamSettingsNew", doc.text);
//        });

//        VSS.notifyLoadSucceeded();
//    }

//    CreateTeams(dataService) {
//        new Logger().Log("CreateTeams", "executing");
//        this.SetTeamSettingsNew(dataService, "Xtreme");
//        this.SetTeamSettingsNew(dataService, "Committers");
//        this.SetTeamSettingsNew(dataService, "Test");
//        this.SetTeamSettingsNew(dataService, "NieuweTest");
//        new Logger().Log("CreateTeams", "executed.");
//    }

//    SetToDefault() {
//        if (window.confirm("Alle instellingen terugzetten naar standaard instellingen?")) {
//            var teamsettingsToDelete = this.GetTeamSettingsToDelete(this.dataservice);
//            this.DeleteTeamSettings(teamsettingsToDelete, this.dataservice);
//            this.CreateTeams(this.dataservice);
//        }
//    }

//    async CreateTeamSelectElementInitially() {

//        let logger: Logger = new Logger();
//        logger.Log("CreateTeamSelectElementInitially", "Received dataservice: " + this.dataservice);

//        this.dataservice.getDocuments(this.TeamSettingsCollectionName).then(function (docs) {
//            var x = 0;

//            // only teams setting. Not other settings
//            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
//            logger.Log("CreateTeamSelectElementInitially", "Initial load team settings : " + teamDocs.length + " out of " + docs.length + " settings.");

//            var teamSelectNode = document.getElementsByClassName("teamSelect")[0];

//            teamDocs.forEach(
//                function (element) {

//                    var inputId = "teamNaam" + x;
//                    x++;

//                    var teamSelecectOption = document.createElement("option");
//                    teamSelecectOption.setAttribute("class", "teamSelectOption");
//                    teamSelecectOption.setAttribute("id", inputId);
//                    teamSelecectOption.setAttribute("value", element.text);
//                    //teamSelecectOption.setAttribute("onchange", "new EventHandlers().TeamSelectedHandler(this)");
//                    teamSelecectOption.innerText = element.text;

//                    teamSelectNode.appendChild(teamSelecectOption);

//                    var teamTitle = (element.text !== null && typeof element.text !== "undefined") ? element.text : this.defaultTeamName;
//                    var teamRowNode = document.createElement("div");

//                    var teamNaamInputNode = document.createElement("input");
//                    //teamNaamInputNode.setAttribute("onfocus", "new EventHandlers().RemoveDefaultText(this)");
//                    teamNaamInputNode.setAttribute("type", "text");
//                    teamNaamInputNode.setAttribute("value", teamTitle);
//                    teamNaamInputNode.setAttribute("name", "teamInpNaam");
//                    teamNaamInputNode.setAttribute("class", "teamNaamInput");

//                    var removeTeamFieldNode = document.createElement("a");
//                    //removeTeamFieldNode.setAttribute("onclick", "removeTeamFieldClickHandler(this)");
//                    removeTeamFieldNode.setAttribute("href", "#");
//                    removeTeamFieldNode.setAttribute("style", "margin-left:10px;");
//                    removeTeamFieldNode.setAttribute("class", "remove_field");
//                    removeTeamFieldNode.innerText = "Verwijder teamm";

//                    var teamInputContainer = document.getElementsByClassName("input_fields_container_part")[0];
//                    teamInputContainer.appendChild(teamRowNode);
//                    teamRowNode.appendChild(teamNaamInputNode);
//                    teamRowNode.appendChild(removeTeamFieldNode);
//                    teamRowNode.appendChild(document.createElement("br"));
//                });

//            VSS.notifyLoadSucceeded();
//        });

//        logger.Log("CreateTeamSelectElementInitially", "Done loading teams.")
//    }

//    ShowSelectedWorkitemOnPage(workItem) {
//        var allowToAdd = new WorkItemHelper(this.parentWorkItem).CheckAllowedToAddTaskToPbi();

//        if (!allowToAdd) {
//            document.getElementById("existing-wit-text").className = "existing-wit-text-not";
//            document.getElementById("existing-wit-text").innerHTML =
//                "Aan een " + workItem.workItemType + " mag geen Task toegevoegd worden." +
//                "</br> " +
//                "(" + workItem.id + ")" + workItem.title;

//            new CheckBoxHelper(this.parentWorkItem).DisableCheckBoxes();
//            new ButtonHelper(this.parentWorkItem).DisableAddButton();
//        }
//        else {
//            document.getElementById("existing-wit-text").className = "existing-wit-text";
//            document.getElementById("existing-wit-text").innerHTML = workItem.id + "</br> " + workItem.title;

//            new CheckBoxHelper(this.parentWorkItem).EnableCheckBoxes();
//            new ButtonHelper(this.parentWorkItem).EnableAddButton();
//        }

//        VSS.notifyLoadSucceeded();
//    }

//    EnableBtn(id) {
//        document.getElementById(id).removeAttribute("disabled");
//    }

//    async LoadTasksOnMainWindow(teamnaam: string) {
//        let parsedTeamnaam: string;
//        if (teamnaam.startsWith("team_")) {
//            var substringVanaf = "team_".length;
//            parsedTeamnaam = teamnaam.substring(substringVanaf);
//        }
//        else { parsedTeamnaam = teamnaam; }

//        this.SetTeamInAction(parsedTeamnaam, this.dataservice);

//        new Logger().Log("LoadTasksOnMainWindow", "Registered team-naam-in-actie ");

//        VSS.register("team-naam-in-actie", parsedTeamnaam);

//        this.SetPageTitle(parsedTeamnaam);

//        var taskFieldSet = document.getElementById("task-checkbox");

//        // first remove all 
//        while (taskFieldSet.firstChild) {
//            taskFieldSet.removeChild(taskFieldSet.firstChild);
//        }

//        var foo;
//        await this.dataservice.getDocuments(this.TeamSettingsCollectionName).then(function (dcs) { foo = dcs });

//        await this.dataservice.getDocuments(this.TeamSettingsCollectionName).then(function (docs) {
//            new Logger().Log("LoadTasksOnMainWindow", docs.length as unknown as string);

//            // only team task setting. Not other settings or other tam tasks
//            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === parsedTeamnaam.toLowerCase(); });

//            // build up again
//            teamTasks.forEach(
//                function (element) {
//                    var inputNode = document.createElement("input");
//                    inputNode.setAttribute("type", "checkbox");
//                    inputNode.setAttribute("id", element.id);
//                    inputNode.setAttribute("value", element.activityType);
//                    inputNode.setAttribute("checked", "true");
//                    inputNode.setAttribute("name", "taskcheckbox");
//                    inputNode.setAttribute("class", "checkbox");

//                    var labelNode = document.createElement("label");
//                    labelNode.setAttribute("for", element.id);
//                    labelNode.setAttribute("class", "labelforcheckbox");
//                    labelNode.innerHTML = element.title;

//                    taskFieldSet.appendChild(inputNode);
//                    taskFieldSet.appendChild(labelNode);
//                    taskFieldSet.appendChild(document.createElement("br"));
//                });
//        });
//        VSS.notifyLoadSucceeded();
//    }

//    LoadTeamTasks(selection) {
//        let e = this.EventHandlers;
//        this.dataservice.getDocuments(this.TeamSettingsCollectionName).then(function (docs) {
//            let logger = new Logger();

//            logger.Log("LoadTeamTasks", (docs.length as unknown) as string);
//            var x = 0;

//            if (selection === undefined) {
//                selection = e.GetTeamInAction();
//            }
//            // only team task setting. Not other settings
//            var teamTasks = docs.filter(function (d) { return d.type === 'task' && d.owner === selection; });

//            logger.Log("LoadTeamTasks", "Initial load task settings : " + teamTasks.length + " out of " + teamTasks.length + " settings.");

//            var taskInputRowDivs = $('div.taskInputRow');
//            taskInputRowDivs.remove();

//            logger.Log("LoadTeamTasks", 'Build new list with ' + teamTasks.length + ' items.');

//            var modalHelper = new ModalHelper();

//            teamTasks.forEach(
//                function (element) {
//                    modalHelper.AddNewTaskInputRow(element.title, element.activityType, this.defaultTaskTitle);
//                }
//            );
//            VSS.notifyLoadSucceeded();
//        });
//    }
//}