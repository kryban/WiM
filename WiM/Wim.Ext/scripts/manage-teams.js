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
        e.preventDefault();
        $(this).parent('div').remove();
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
                    '<input type="text" name="teamNaam" id="' + inputId +'" value="' + element.text + '"/>' +
                    '<a href="#" class="remove_field" style="margin-left:10px;">Verwijder</a>' +
                    '</div>');
            }
        );

    });
});

//var formDataa = "pietjepuk-external";

//// Register form object to be used across this extension
//console.log("VSS.Register() pietjepuk: " + formDataa);
//VSS.register("pietjepukk", formDataa);

function GatherFormInfo() {
    console.log("GatherFormInfo()");

    VSS.init();
    var registrationForm = (function () {
        var callbacks = [];

        function inputChanged() {
            // Execute registered callbacks
            for (var i = 0; i < callbacks.length; i++) {
                callbacks[i](isValid());
            }
        }

        function isValid() {
            // Check whether form is valid or not
            return !!(name.value) && !!(dateOfBirth.value) && !!(email.value);
        }

        function getFormData() {
            // Get form values
            return {
                name: name.value,
                dateOfBirth: dateOfBirth.value,
                email: email.value
            };
        }

        var name = document.getElementById("inpName");
        var dateOfBirth = document.getElementById("inpDob");
        var email = document.getElementById("inpEmail");

        name.addEventListener("change", inputChanged);
        dateOfBirth.addEventListener("change", inputChanged);
        email.addEventListener("change", inputChanged);

        return {
            isFormValid: function () {
                return isValid();
            },
            getFormData: function () {
                return getFormData();
            },
            attachFormChanged: function (cb) {
                callbacks.push(cb);
            }
        };
    })();

    // Register form object to be used across this extension
    VSS.register("Bandik.WimDevOpExtension.teamsettings-form", registrationForm);
}
