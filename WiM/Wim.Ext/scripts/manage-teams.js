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
});

VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

    dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
        console.log("GetAllTeamSettings :" + docs.length);
        var x = 0;
        docs.forEach(
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

    });
});


function teamInpChangeHandler() {
   
    var c = document.getElementsByName("teamInpNaam");

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {

            docs.forEach(
                function (element) {

                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
                        console.log("teamInpChangeHandler(): Doc verwijderd");
                    });   
                }
            );

            for (var i = 0; i < c.length; i++) {

                var teamnaam = c[i].value;
                teamsForm.push(teamnaam);

                console.log("teamInpChangeHandler() :" + docs.length);
                console.log("teamInpChangeHandler(): " + teamnaam);

                var newDoc = {
                    text: teamnaam
                };

                dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                    // Even if no ID was passed to createDocument, one will be generated
                    console.log("teamInpChangeHandler() CreateDocument : " + doc.text);
                });

                console.log("teamInpChangeHandler(). Setting NOT exists.");

            }
        });

    });

    console.log("teamInpChangeHandler() ended :");

}



