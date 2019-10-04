
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
                    '<a href="#" onclick="removeFieldClickHandler(this)" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
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



