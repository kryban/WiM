$(document).ready(function () {

    console.log("dcument.Ready()")

    var max_fields_limit = 7;
    var x = 0;

    $('.voeg_toe').click(function (e) {
        e.preventDefault();
        if (x < max_fields_limit) {
            x++;
            var inputId = "teamNaam" + x;
            
            $('.input_fields_container_part').append(
                '<div>' +
                '<input onchange="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId + '" value="... teamnaam ... "/>' +
                '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                '</div>');
        }
    });

    $('.input_fields_container_part').on("click", ".remove_field", function (e) {
        e.preventDefault();
        $(this).parent('div').remove();
        teamInpChangeHandler();
        x--;
    });

    var checkBoxes = Array.from(document.getElementsByClassName("checkbox"));
    var addButton = document.getElementById("addTasksButton");

    if (parentWorkItem === undefined || parentWorkItem === null) {
        DisableItems(checkBoxes, addButton);
    }

});

VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

    dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
        
        var x = 0;

        // only teams setting. Not other settings
        var teamDocs = docs.filter(function (d) { return d.type === 'team'; });
        console.log("Initial load team settings : " + teamDocs.length + " out of " + docs.length +" settings.");
        teamDocs.forEach(
            function (element) {
                var inputId = "teamNaam" + x;
                x++;
                $('.input_fields_container_part').append(
                    '<div>' +
                    '<input onchange="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId +'" value="' + element.text + '"/>' +
                    '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                    '</div>');
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



