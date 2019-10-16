r﻿var TeamSettingsCollectionName = "WimCollection";
var teamDialog = document.getElementById('manage-teams-dialog');
var tasksDialog = document.getElementById('manage-tasks-dialog');

document.addEventListener('DOMContentLoaded', function (event) {

    var name = window.location.pathname.split('/').slice(-1);
    
    alertWhenIE();
    
    ControleerSettingsCollection();
    SetCheckBoxes();

    MaakMenu();

    RegistreerButtonEvents();

    log("DocumentReady:" + name);
});

function isIE() {
  ua = navigator.userAgent;
  /* MSIE used to detect old browsers and Trident used to newer ones*/
  var is_ie = ua.indexOf("MSIE ") > -1 || ua.indexOf("Trident/") > -1;
  
  return is_ie; 
}

function alertWhenIE(){
if (isIE()){
    alert('Sorry, this extension does not work in IE. Maybe future version will. Use Chrome. ');
}}

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
                function(docs) {
                    if (docs.length < 1) {
                        CreateFirstTimeCollection();
                    }
                    log("Aantal gecvonden docs: " + docs.length);
                },
                function(err) {
                    CreateFirstTimeCollection();
                    log("Niets gevonden. Default aangemaakt");
                }
            );
    });
    log("Found");
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

function RegistreerButtonEvents() {

    var teamCancelBtn = document.getElementById('teamDialogCancel');
    var taskCancelBtn = document.getElementById('taskDialogCancel');

    //var confirmBtn = document.getElementById('dialogConfirm');;

    teamCancelBtn.addEventListener("click", function(){ teamDialog.close(); });
    taskCancelBtn.addEventListener("click", function(){ tasksDialog.close(); });

    //confirmBtn.addEventListener("click",teamInpChangeHandler());

    log();
}
