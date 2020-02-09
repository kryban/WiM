
import { Logger } from "./Logger.js";
import { ViewHelper } from "./ViewHelper.js";
import { WimWorkItem } from "./wimworkitem.js";

export class MenuBuilder {
    menuSettings;
    vssDataservice: IExtensionDataService;
    TeamSettingsCollectionName: string;
    parentWorkItem: WimWorkItem;
    defaultTeamName: string;
    defaultTaskTitle: string;
    viewHelper;

    constructor(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle) {
        this.vssDataservice = vssDataService;
        this.TeamSettingsCollectionName = TeamSettingsCollectionName;
        this.parentWorkItem = parentWorkItem;
        this.defaultTeamName = defaultTeamName;
        this.defaultTaskTitle = defaultTaskTitle;
        this.viewHelper = new ViewHelper(vssDataService, TeamSettingsCollectionName, parentWorkItem, defaultTeamName, defaultTaskTitle);
    }

    async GetMenuSettings(): Promise<any[]> {
        let menusettings = [];
        await this.vssDataservice.getDocuments(this.TeamSettingsCollectionName).then(
            async function (docs) {
                await docs.forEach(
                    async function (element) {
                        await menusettings.push(element)
                    }
                )
            }
        );

        return menusettings;
    }

    BuildMenuItems(docs, Controls, Menus) {
        var viewHelper = this.viewHelper;
        let logger = new Logger();

        var container = $(".menu-bar");

        var bar = [];

        logger.Log("BuildMenu", "CreateMenuBar() - getDocuments :" + docs.length);

        bar = docs.filter(function (d) { return d.type === 'team'; });

        var teamMenuItems = [];
        var teamTasksMenuItems = [];

        bar.forEach(
            function (element) {
                teamMenuItems.push(
                    { id: "team_" + element.text.toLowerCase(), text: element.text }
                );
                teamTasksMenuItems.push(
                    { id: "tasks_" + element.text.toLowerCase(), text: element.text }
                );
            }
        );

        var teamItemsStringified = JSON.stringify(teamMenuItems);
        var teamTasksItemsStringified = JSON.stringify(teamTasksMenuItems);

        logger.Log("BuildMenu", "teamMenuItemsCreated :" + teamItemsStringified);
        logger.Log("BuildMenu", "teamTaskMenuITemsreated:" + teamTasksItemsStringified);

        var menuItems =
            '[' +
            '{' +
            '"id":"menu-setting", "text":"Settings", "icon":"icon-settings", "childItems":' +
            '[' +
            '{' +
            '"id": "switch", "text": "Switch team", "childItems":' +
            teamItemsStringified +
            '},' +
            '{' +
            '"id": "manage-teams", "text": "Manage teams"' +
            '},' +
            '{' +
            '"id": "configure-team-tasks", "text": "Manage team tasks" ' +
            '},' +
            '{' +
            '"id": "set-to-default", "text": "Set to default" ' +
            '}' +
            ']' +
            '},' +
            '{ "separator": "true" },' +
            '{ "id": "menu-help", "text": "Help", "icon": "icon-help", "tag": "test" }' +
            ']';

        var menuItemsParsed = JSON.parse(menuItems);

        // stukje abrakadabra
        var menubarOptions = {
            items: menuItemsParsed,
            executeAction: function (args) {
                var command = args.get_commandName();
                //this.MenuBarAction(command);
                // all team element ids begin with "team_", so we know user wants to switch teams
                if (command.startsWith("team_")) {
                    viewHelper.LoadTasksOnMainWindow(command);
                }

                else if (command === "manage-teams") {
                    viewHelper.ConfigureTeams(command);
                }

                else if (command === "configure-team-tasks") {
                    viewHelper.ConfigureTasks(command);
                }

                else if (command === "set-to-default") {
                    viewHelper.SetToDefault();
                }
            }
        };

        var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);
        VSS.notifyLoadSucceeded();
    }

    async BuildMenu(controls, menus) {
        this.menuSettings = await this.GetMenuSettings().then(function (s) { return s; });
        this.BuildMenuItems(this.menuSettings, controls, menus);
    }
}