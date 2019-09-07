
// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts
var wi = "ttt";
var workItemFocused;

function workItem(wiResult) 
{

    this.id = wiResult.fields["System.Id"];;
    this.title = wiResult.fields["System.Title"];
    this.workItemType = wiResult.fields["System.WorkItemType"];
    this.workItemProjectName = wiResult.fields["System.WorkItemProjectName"];
    this.workItemIterationPath = wiResult.fields["System.WorkItemIterationPath"];
    this.workItemAreaPath = wiResult.fields["System.WorkItemAreaPath"];
    this.workItemTaskActivity = wiResult.fields["System.WorkItemTaskActivity"];
};

function MapWorkItemFields(witemObject, witem )
{
    witemObject.Title = witem.fields["System.Title"];
}

var witClient;

function OpenButtonClicked(obj) {
    VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
        function (_restWitClient) {
            witClient = _restWitClient.getClient();

            witClient.getWorkItem(3, ["System.Title", "System.WorkItemType"])
                .then(
                    function (workitmResult) {

                        workItemFocused = new workItem(workitmResult);

                        wi = workItemFocused.title;
                        var foo = 1;

                        var workitemID = document.getElementById("existing-wit-id").value;
                        document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + wi;

                        VSS.notifyLoadSucceeded();
                    });

            //        var projectNames = VSS.getWebContext().project.name;
            var workitemTypes = witClient.getWorkItemTypes(VSS.getWebContext().project.name)
                .then(
                    function (types) {
                        var bar = JSON.stringify(types);

                        VSS.notifyLoadSucceeded();

                        return types[0];
                    }
                );
            var foro = witClient;
        }
    );
}

