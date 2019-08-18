
VSS.require(["VSS/Controls", "VSS/Controls/Menus"], function (Controls, Menus) {
    var container = $(".menu-bar");

    // todo: menuitems moeten op basis van configuratie bij elkaar gegenereerd worden. 
    // dus eerst configs ophalen (https://docs.microsoft.com/en-us/azure/devops/extend/develop/data-storage?view=azure-devops&viewFallbackFrom=vsts)
    // en vervolgens op basis van de opgehaalde data onderstaande string gegenereren.
    var menuItems =
        [
            {id: "menu-setting", text: "Settings", icon: "icon-settings", childItems:
                    [
                        {id: "switch", text: "Switch", childItems:
                            [
                                { id: "xtreme", text: "Xtreme" },
                                { id: "committers", text: "Committersss" },
                                { id: "test", text: "Test" }
                                ]
                        },
                        {id: "manage-teams", text: "Manage teams", childItems:
                            [   { id: "add-new-team", text: "Add new team" },
                                { id: "delete-team", text: "Delete team" }
                            ]
                        },
                        {id: "configure-team-tasks", text: "Configure team tasks", childItems:
                            [
                                { id: "team-xtreme", text: "Team Xtreme" },
                                { id: "team-committers", text: "Team Committers" }
                            ]
                        }
                    ]
            },
            { separator: true }, // Default separator
            { id: "menu-help", text: "Help", icon: "icon-help", tag: "test" }

    ];

    // stukje abrakadabra
    var menubarOptions = {
        items: menuItems,
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