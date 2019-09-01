
//DeleteCurrentTeams();
//CreateTeams();

MaakMenu();

function MaakMenu() {
    VSS.require(["VSS/Controls", "VSS/Controls/Menus"], function(Controls, Menus) {

        CreateMenuBar(Controls, Menus);
    });
}

function CreateMenuBar(Controls, Menus) {
    var container = $(".menu-bar");

    var bar = [];


    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            console.log("CreateMenuBar() - getDocuments :" + docs.length);

            bar = docs.filter(function (d) { return d.type === 'team'; });

            var teamMenuItems = [];
            var teamTasksMenuItems = [];

            bar.forEach(
                function (element) {
                    teamMenuItems.push(
                        { id: "team_"+element.text.toLowerCase(), text: element.text }
                    );
                    teamTasksMenuItems.push(
                        { id: "tasks_"+element.text.toLowerCase(), text: element.text }
                    );
                }
            );

            var teamItemsStringified = JSON.stringify(teamMenuItems);
            var teamTasksItemsStringified = JSON.stringify(teamTasksMenuItems);

            console.log("CreateMenuBar() - teamMenuItemsCreated :" + teamItemsStringified);
            console.log("CreateMenuBar() - teamTaskMenuITemsreated:" + teamTasksItemsStringified);

            // docs worden gegroepeerd op basis van Collections
            // teams behoren tot de collection Wim
            // taken moeten behoren tot collections van teams, zo kunnen ze per team herkend worden
            // bij het getten kunnen ze dan de teamnaam als argument mee krijgen, waarna de tasks geretourneerd worden.
            //var teamTaskItems = '[{"id": "team-xtreme", "text": "Team XtremeNeww" },{ "id": "team-committers", "text": "Team CommittersNeww" }]';

            var menuItems =
                '[' +
                '{' +
                '"id":"menu-setting", "text":"Settings", "icon":"icon-settings", "childItems":' +
                '[' +
                '{' +
                '"id": "switch", "text": "Switch", "childItems":' +
                teamItemsStringified +
                '},' +
                '{' +
                '"id": "manage-teams", "text": "Manage teams", "childItems":' +
                '[{ "id": "add-new-team", "text": "Add new team" },' +
                '{ "id": "delete-team", "text": "Delete team" }' +
                ']' +
                '},' +
                '{' +
                '"id": "configure-team-tasks", "text": "Configure team tasks" ' +
                //', "childItems":' + teamTasksItemsStringified +
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
                    menuBarAction(command);
                }
            };

            var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);
            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });
}

// the center of all actions binded to menu items based on their names
function menuBarAction(command) {

    // all element ids begin with "team_", so we know user wants to switch teams
    if (command.startsWith("team_")) {
        LoadTasksOnMainWindow(command);
    }

    else if (command === "manage-teams") {
        ConfigureTeams(command);
    }
    // all element ids begin with "task_", so we know user wants to go to task management window
    else if (command === "configure-team-tasks") {
    //else if (command.startsWith("tasks_")) {
        ConfigureTasks(command);
    }
}

VSS.notifyLoadSucceeded();