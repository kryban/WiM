$(document).ready(function () {
    var max_fields_limit = 7;
    var x = 0;
    $('.voeg_toe').click(function (e) {
        e.preventDefault();
        if (x < max_fields_limit) {
            x++;
            var inputId = "teamNaam" + x;
            //$('.input_fields_container_part').append('<div><input type="text" name="tags"/><a href="#" class="remove_field" style="margin-left:10px;">Remove</a></div>');
            $('.input_fields_container_part').append(
                '<div>' +
                '<input type="text" name="teamNaam" id="' + inputId + '"/>' +
                '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                '</div>');
        }
    });
    $('.input_fields_container_part').on("click", ".remove_field", function (e) {
        e.preventDefault(); $(this).parent('div').remove(); x--;
    })
});

VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
    // Get all document under the collection
    dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
        //console.log("There areee " + docs.length + " in the collection in GetAllTeamSettings function.");
        console.log("GetAllTeamSettings :" + docs.length);
        var x = 0;
        docs.forEach(
            function (element) {
                var inputId = "teamNaam" + x;
                x++;
                $('.input_fields_container_part').append(
                    '<div>' +
                    '<input type="text" name="teamNaam" id="' + inputId +'" value="' + element.text + '"/>' +
                    '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                    '</div>');
            }
        );

    });
});

// Get data service
VSS.getService(VSS.ServiceIds.ExtensionData)
    .then(function (dataService) {
        // Set value in user scope
        dataService.setValue("userScopedKey", 12345, { scopeType: "User" })
            .then(function (value) {
                console.log("User scoped key value is " + value);
            });
    });