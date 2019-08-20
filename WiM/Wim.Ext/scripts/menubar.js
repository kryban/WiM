



VSS.require(["VSS/Controls", "VSS/Controls/Menus"], function (Controls, Menus){
    var container = $(".menu-bar");

    var team1 = { text: "Xtreme" };
    var team2 = { text: "Committers" };
    var team3 = { text: "Test" };

    //DeleteTeams();
    CreateTeams();
    //GetTeams();

    var teams = [team1, team2, team3];
    var foo = configuredTeams;

    var teamMenuItems = [];

    teams.forEach(
        function (element) {
            teamMenuItems.push(
                { id: element.text.toLowerCase(), text: element.text }
            );
        }
    );

    var teamItemsStringified = JSON.stringify(teamMenuItems);


    // docs worden gegroepeerd op basis van Collections
    // teams behoren tot de collectio Wim
    // taken moeten behoren tot collections van teams, zo kunnen ze per team herkend worden
    // bij het getten kunnen ze dan de teamnaam als argument mee krijgen, waarna de tasks geretourneerd worden.
    var teamTaskItems = '[{"id": "team-xtreme", "text": "Team XtremeNeww" },{ "id": "team-committers", "text": "Team CommittersNeww" }]';

    var menuItems =
        '[' +
            '{'+
                '"id":"menu-setting", "text":"Settings", "icon":"icon-settings", "childItems":'+
                    '['+
                        '{'+
                            '"id": "switch", "text": "Switch", "childItems":'+
                                teamItemsStringified+
                        '},'+
                        '{'+
                            '"id": "manage-teams", "text": "Manage teams", "childItems":'+
                                '[{ "id": "add-new-team", "text": "Add new team" },'+
                                 '{ "id": "delete-team", "text": "Delete team" }'+
                                ']'+
                        '},'+
                        '{'+
                            '"id": "configure-team-tasks", "text": "Configure team tasks", "childItems":'+
                                teamTaskItems +
                        '}'+
                    ']'+
            '},'+
            '{ "separator": "true" },'+
            '{ "id": "menu-help", "text": "Help", "icon": "icon-help", "tag": "test" }'+
        ']';

    var menuItemsParsed = JSON.parse(menuItems);

    // todo: menuitems moeten op basis van configuratie bij elkaar gegenereerd worden.
    // dus eerst configs ophalen (https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts)
    // en vervolgens op basis van de opgehaalde data onderstaande string gegenereren.
    //var menuItems =
    //    [
    //        {id: "menu-setting", text: "Settings", icon: "icon-settings", childItems:
    //                [
    //                    {id: "switch", text: "Switch", childItems:
    //                        [
    //                            { id: "xtreme", text: "Xtreme" },
    //                            { id: "committers", text: "Committers" },
    //                            { id: "test", text: "Test" }
    //                            ]
    //                    },
    //                    {id: "manage-teams", text: "Manage teams", childItems:
    //                        [   { id: "add-new-team", text: "Add new team" },
    //                            { id: "delete-team", text: "Delete team" }
    //                        ]
    //                    },
    //                    {id: "configure-team-tasks", text: "Configure team tasks", childItems:
    //                        [
    //                            { id: "team-xtreme", text: "Team Xtreme" },
    //                            { id: "team-committers", text: "Team Committers" }
    //                        ]
    //                    }
    //                ]
    //        },
    //        { separator: true }, // Default separator
    //        { id: "menu-help", text: "Help", icon: "icon-help", tag: "test" }

    //];

    // stukje abrakadabra
    var menubarOptions = {
        items: menuItemsParsed,
        executeAction: function (args) {
            var command = args.get_commandName();
            menuBarAction(command);
        }
    };

    var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);

});

// the center of all actions binded to menu items based on their names
function menuBarAction(command) {
    switch (command) {
        case "xtreme":
            LoadTasks(xtremeTasks, command);
            break;
        case "committers":
            LoadTasks(committersTasks, command);
            break;
        case "test":
            LoadTasks(testTasks, command);
            break;
        case "add-new-team":
            ConfigureTeams(command);
            break;
        default:
            break;
    }
}

VSS.notifyLoadSucceeded();