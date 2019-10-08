
VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

    dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
        
        var x = 0;

        // only teams setting. Not other settings
        var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
        console.log("Initial load team settings : " + teamDocs.length + " out of " + docs.length +" settings.");
        teamDocs.forEach(
            function (element) {
                //var inputId = "teamNaam" + x;
                //x++;
                //$('.input_fields_container_part').append(
                //    '<div>' +
                //    '<input onchange="teamInpChangeHandler()" onblur="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId +'" value="' + element.text + '"/>' +
                //    '<a href="#" onclick="removeTeamFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                //    '</div>');
                addTeamHandler(element.text);
            }
        );
        VSS.notifyLoadSucceeded();

    });
    VSS.notifyLoadSucceeded();
});


function teamInpChangeHandler() {
   
    var c = document.getElementsByName("teamInpNaam");

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            // delete only teams setting. Not other settings
            var teamDocs = docs.filter(function (d) { return d.type === 'team'; });

            teamDocs.forEach(
                function (element) {

                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
                        console.log("teamInpChangeHandler(): Doc verwijderd");
                    });   
                }
            );

            for (var i = 0; i < c.length; i++) {

                var teamnaam = c[i].value;
                teamsForm.push(teamnaam);

                console.log("teamInpChangeHandler() :" + teamDocs.length);
                console.log("teamInpChangeHandler() : " + teamnaam);

                var newDoc = {
                    type: "team",
                    text: teamnaam
                };

                dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                    // Even if no ID was passed to createDocument, one will be generated
                    console.log("teamInpChangeHandler() CreateDocument : " + doc.text);
                });

                console.log("teamInpChangeHandler(). Setting NOT exists.");

            }
            VSS.notifyLoadSucceeded();
        });
        VSS.notifyLoadSucceeded();
    });

    console.log("teamInpChangeHandler() ended :");
}

var defaultTeamName = "Team naam";
function addTeamHandler(name) {
    //arbitrary maximum
    //var max_teamfields_limit = 7;
    //var t = 0;

    //if (t < max_teamfields_limit) {
    //    alert("hoihoi");
    //    t++;
    //    var inputId = "teamNaam" + t;

    //    $('.input_fields_container_part').append(
    //        '<div>' +
    //        '<input onchange="teamInpChangeHandler()" onblur="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId + '" value="... teamnaam ... "/>' +
    //        '<a href="#" onclick="removeFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
    //        '</div>');
    //}

    var teamTitle = name !== null ? name : defaultTeamName;

    var teamRowNode = document.createElement("div");
    //teamRowNode.setAttribute("class", "taskInputRow");

    var teamNaamInputNode = document.createElement("input");
    teamNaamInputNode.setAttribute("onchange", "teamInpChangeHandler()");
    teamNaamInputNode.setAttribute("onblur", "teamInpChangeHandler()");
    teamNaamInputNode.setAttribute("onfocus", "removeDefaultTextHandler(this)");
    teamNaamInputNode.setAttribute("type", "text");
    teamNaamInputNode.setAttribute("value", teamTitle);
    teamNaamInputNode.setAttribute("name", "teamInpNaam");
    teamNaamInputNode.setAttribute("class", "teamNaamInput");

    
    var removeTeamFieldNode = document.createElement("a");
    removeTeamFieldNode.setAttribute("onclick", "removeTeamFieldClickHandler(this)");
    removeTeamFieldNode.setAttribute("href", "#");
    //removeTaskFieldNode.setAttribute("type", "text");
    //removeTaskFieldNode.setAttribute("value", "... taskActivityType ...");
    removeTeamFieldNode.setAttribute("style", "margin-left:10px;");
    removeTeamFieldNode.setAttribute("class", "remove_field");
    removeTeamFieldNode.innerText = "Verwijder team";

    //var labelNode = document.createElement("label");
    //labelNode.setAttribute("for", element.id);
    //labelNode.innerHTML = element.title;
    var teamInputContainer = document.getElementsByClassName("input_fields_container_part")[0];

    teamInputContainer.appendChild(teamRowNode);
    teamRowNode.appendChild(teamNaamInputNode);
    teamRowNode.appendChild(removeTeamFieldNode);
    teamRowNode.appendChild(document.createElement("br"));

}

function removeTeamFieldClickHandler(obj) {

    if (obj !== null) {
        while (obj.parentNode !== null && obj.parentNode.firstChild) {
            obj.parentNode.removeChild(obj.parentNode.firstChild);
        }
    }
    teamInpChangeHandler();
}



