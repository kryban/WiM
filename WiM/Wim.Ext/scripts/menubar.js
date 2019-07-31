
VSS.require(["VSS/Controls", "VSS/Controls/Menus"], function (Controls, Menus) {
    var container = $(".menu-bar");


    var menuItems = [
        {
            id: "menu-setting", text: "Settings", icon: "icon-settings", childItems:
                [{
                    id: "switch", text: "Switch", childItems:
                        [{ id: "xtreme", text: "Xtreme" }, { id: "committers", text: "Committersss" }, { id: "test", text: "Test" }]
                },
                {
                    id: "manage-teams", text: "Manage teams", childItems:
                        [{ id: "add-new-team", text: "Add new team" }, { id: "delete-team", text: "Delete team" }]
                },
                {
                    id: "configure-team-tasks", text: "Configure team tasks", childItems:
                        [{ id: "team-xtreme", text: "Team Xtreme" }, { id: "team-committers", text: "Team Committers" }]
                }
                ]
        },
        { separator: true }, // Default separator
        { id: "menu-help", text: "Help", icon: "icon-help", tag: "test" }

    ];

    var menubarOptions = {
        items: menuItems,
        executeAction: function (args) {
            var command = args.get_commandName();
            menuBarAction(command);
        }
    };

    var menubar = Controls.create(Menus.MenuBar, container, menubarOptions);

});

function menuBarAction(command) {
    switch (command) {
        case "xtreme":
            LoadTasks(XtremeTasks, command);
            break;
        case "committers":
            LoadTasks(CommittersTasks, command);
            break;
        case "test":
            LoadTasks(testTasks, command);
            break;
        default:
            break;
    }
}

VSS.notifyLoadSucceeded();