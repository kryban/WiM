var TeamSettingsCollectionName = "WimCollection";

document.addEventListener('DOMContentLoaded', function (event) {

    var name = window.location.pathname.split('/').slice(-1);

    ControleerSettingsCollection();
    SetCheckBoxes();

    MaakMenu();

    log("DocumentReady:" + name);
});

function log(txt) {
    var tekst = (txt !== null && typeof txt !== "undefined") ? txt : "";
    console.log(arguments.callee.caller.name + " : " + tekst);
}

function ControleerSettingsCollection() {
    try {
        FindCollection();
    }
    catch (e) {
        CreateFirstTimeCollection();
    }
}

function FindCollection() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
        dataService.getDocuments(TeamSettingsCollectionName)
            .then(
                (docs) => {
                    if (docs.length < 1) {
                        CreateFirstTimeCollection();
                    }
                    log("Aantal gevonden docs: " + docs.length);
                },
                (err) => {
                    CreateFirstTimeCollection();
                    log("Niets gevonden. Default aangemaakt");
                }
            );
    });
}

function CreateFirstTimeCollection() {
    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        var newDoc = {
            type: "team",
            text: "DefaultTeam"
        };

        dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
            log(doc.text);
        });
    });

    log();
}

function SetCheckBoxes() {
    var checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    var addButton = document.getElementById("addTasksButton");
    if (checkBoxes !== null && addButton !== null &&
        (parentWorkItem === undefined || parentWorkItem === null)) {
        DisableItems(checkBoxes, addButton);
    }
}