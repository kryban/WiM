$(document).ready(function () {

    console.log("dcument.Ready()")

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
                    '<input onchange="teamInpChangeHandler()" type="text" class="teamNaamInput" name="teamInpNaam" id="' + inputId +'" value="' + element.text + '"/>' +
                    '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                    '</div>');

                //document.getElementById(inputId).addEventListener("change", teamInpChangeHandler);
            }
        );

    });
});


function teamInpChangeHandler() {
    
    //var c = document.getElementById("teamInputFields").children;

    var c = document.getElementsByName("teamInpNaam");
    var retVal = [];

    VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {

        // Get all document under the collection
        dataService.getDocuments(TeamSettingsCollectionName).then(function (docs) {
            //console.log("There are " + docs.length + " in the collection.");
            docs.forEach(
                function (element) {
                    //DeleteTeamSettings(dataService, element.id, element.text);
                    dataService.deleteDocument(TeamSettingsCollectionName, element.id).then(function (service) {
                        console.log("Doc verwijderd");
                    });

                    
                }
            );

            for (var i = 0; i < c.length; i++) {

                var teamnaam = c[i].value;


                console.log("GetAllTeamSettingsNewInline :" + docs.length);
                //configuredTeams = [];
                //docs.forEach(
                //    function (element) {
                //        configuredTeams.push(element);
                //    }
                //);

                //////////////////
                //result = configuredTeams.find(obj => obj.text === teamnaam);
                //console.log("checkNew: " + result);
                console.log("SetTeamSettingsNewInline(): " + teamnaam);

                var newDoc = {
                    text: teamnaam
                };

                dataService.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
                    // Even if no ID was passed to createDocument, one will be generated
                    console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
                });

                console.log("SettingNewInline NOT exists.");

            }

                    //// Get data service
                    //VSS.getService(VSS.ServiceIds.ExtensionData).then(function (dataService) {
                    //    //var docId = "1234-4567-8910";
                    //    // Delete document
                    //    dataService.deleteDocument(TeamSettingsCollectionName, docId).then(function () {
                    //        console.log("Doc verwijderddd");
                    //    });
                    //});

        });


        
            //SetTeamSettingsNew(c[i].value);

            /////////////////////////////////
            //c



            //    function (dataService) {
            //        dataService.getDocuments(TeamSettingsCollectionName).then(


            //            function (docs) {


            //                //console.log("SettingNewInline ALREADY exists.");
            //                //////////////////

            //            }
            //        );

            ///////////////////////////////////
            //retVal.push(c[i].value);
        //}


    });

    //for (var i = 0; i < c.length; i++) {

    //    var teamnaam = c[i].value;
    //    //SetTeamSettingsNew(c[i].value);

    //    /////////////////////////////////
    //    console.log("SetTeamSettingsNewInline(): " + teamnaam);

    //    VSS.getService(VSS.ServiceIds.ExtensionData).then(
    //        function (dataservice) {
    //            dataservice.getDocuments(TeamSettingsCollectionName).then(
    //                function (docs) {
    //                    console.log("GetAllTeamSettingsNew :" + docs.length);
    //                    configuredTeams = [];
    //                    docs.forEach(
    //                        function (element) {
    //                            configuredTeams.push(element);
    //                        }
    //                    );

    //                    //////////////////
    //                    result = configuredTeams.find(obj => obj.text === teamnaam);
    //                    console.log("checkNew: " + result);

    //                    if (typeof result === 'undefined') {

    //                        var newDoc = {
    //                            text: teamnaam
    //                        };

    //                        dataservice.createDocument(TeamSettingsCollectionName, newDoc).then(function (doc) {
    //                            // Even if no ID was passed to createDocument, one will be generated
    //                            console.log("SetTeamSetting (CreateTeamsNew) : " + doc.text);
    //                        });

    //                        console.log("SettingNewInline NOT exists.");
    //                    }

    //                    //console.log("SettingNewInline ALREADY exists.");
    //                    //////////////////

    //                }
    //            );
    //        });

    //    /////////////////////////////////
    //    retVal.push(c[i].value);
    //}

    //MaakMenu();

    // Get navigation service
    //VSS.getService(VSS.ServiceIds.Navigation).then(function (navigationService) {
    //    // Reload whole page
    //    console.log("navigationService.reload()");
    //    navigationService.reload();
    //});

    console.log("teamInpChangeHandler() :" + retVal);

    //var formData = "foo-manage-teams-form-data-at-teamInpChangeHandler";

    // Register form object to be used across this extension
    //console.log("VSS.Register() in teamInpChangeHandler: " + formData);
    //VSS.register("nieuweTeams", formData);

}



