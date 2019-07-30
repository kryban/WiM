


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

    //var menuItems: Menus.IMenuItemSpec[] = [
    //    {
    //        id: "file", text: "File", icon: "icon-pause", childItems: [
    //            { separator: true, text: "NEW" }, // Separator as group text
    //            { id: "new-tab", text: "New tab", icon: "icon-info" },
    //            { id: "new-file", text: "New file", icon: "icon-commented-file" },
    //            { separator: true, text: "SAVE" }, , // Separator as group text
    //            { id: "save-file", text: "Save file", icon: "icon-save" },
    //            { id: "save-file-close", text: "Save file & close", icon: "icon-save-close" },
    //            { separator: true }, // Default separator
    //            { id: "save-all", text: "Save all", icon: "icon-save-all" },
    //            { separator: true, text: "MISC" }, // Separator as group text
    //            {
    //                id: "recent-files", text: "Recent files", icon: "icon-play", childItems: [
    //                    { id: "file1", text: "file1.txt", icon: "icon-restricted" },
    //                    { id: "file2", text: "file2.txt", icon: "icon-restricted" },
    //                    { id: "file3", text: "file3.txt", icon: "icon-restricted" }
    //                ]
    //            },
    //            { id: "exit", text: "Exit" }
    //        ]
    //    },
    //    { separator: true }, // Default separator
    //    { id: "settings", text: "Settings...", icon: "icon-settings" },
    //    { id: "help", text: "Help", icon: "icon-help", tag: "test" }

    //];


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
            LoadTasks(XtremeTasks);
            break;
        case "committers":
            LoadTasks(CommittersTasks);
            break;
        case "test":
            LoadTasks(testTasks);
            break;
        default:
            break;
    }
}

// COMBO CONTROL
//VSS.require(["VSS/Controls", "VSS/Controls/Combos"], function (Controls, Combos) {
//    var container = $("#combo-container");
//    var multiValueOptions = {
//        type: "multi-value",
//        width: 500,
//        source: [
//            "English", "Chinese", "German", "Turkish", "Spanish",
//            "Japanese", "Korean", "Russian", "Portuguese", "French",
//            "Italian", "Arabic"],
//        change: function () {
//            // Displaying the selected value
//            commandArea.prepend($("<div />").text(this.getText()));
//        }
//    };
//    $("<label />").text("Select the supported languages:").appendTo(container);

//    var multiValueCombo = Controls.create(Combos.Combo, container, multiValueOptions);

//    var commandArea = $("<div style='margin:10px' />").appendTo(container);
//});


VSS.notifyLoadSucceeded();