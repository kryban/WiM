﻿

function MaakMenu(vssControls, vssMenus) {
    log("Start creating menu bar (vssControls; vssMenus): " + vssControls + "+" + vssMenus);
    CreateMenuBar(vssControls, vssMenus);
}

function CreateMenuBar(controls, menus) {

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName).then(
            function(docs) {
                menuFoo(docs, controls, menus);
            }
        );
        VSS.notifyLoadSucceeded();
    });
}

function menuFoo(docs, Controls, Menus) {
    var container = $(".menu-bar");

    var bar = [];

    log("CreateMenuBar() - getDocuments :" + docs.length);

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

    log("teamMenuItemsCreated :" + teamItemsStringified);
    log("teamTaskMenuITemsreated:" + teamTasksItemsStringified);

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
}

// the center of all actions binded to menu items based on their names
function menuBarAction(command) {

    // all team element ids begin with "team_", so we know user wants to switch teams
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