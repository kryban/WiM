VSS.init({
    explicitNotifyLoaded: true,
    usePlatformScripts: true,
    usePlatformStyles: false
});  

var wi = "ttt";

var WorkItemObj =
{
    Id: null,
    Title: null,
    WorkItemType: null,
    WorkItemProjectName: null,
    WorkItemIterationPath: null,
    WorkItemAreaPath: null,
    WorkItemTaskActivity: null,
};

function MapWorkItemFields(witem, witemObject)
{
    witemObject.Title = witem.fields["System.Title"];
};

// https://docs.microsoft.com/en-us/azure/devops/extend/reference/client/api/tfs/workitemtracking/restclient/workitemtrackinghttpclient2_1?view=vsts

VSS.require(["TFS/WorkItemTracking/RestClient"], // modulepath
    function (_restWitClient) {
        var witClient = _restWitClient.getClient();
        
        witClient.getWorkItem(3, ["System.Title","System.WorkItemType"]).then(
            function (workitm)
            {
                  MapWorkItemFields(workitm, WorkItemObj);
                  wi = WorkItemObj.Title;
                  //wi = workitm.fields["System.Title"];//JSON.stringify(workitm);
                  var foo = 1;
            });

//        var projectNames = VSS.getWebContext().project.name;
        var workitemTypes = witClient.getWorkItemTypes(VSS.getWebContext().project.name).then(
            function (types)
            {
                var bar = JSON.stringify(types);
                return types[0];
                //var bar2 = 1;
            }
        );
        var foro = witClient;
    }
);

VSS.notifyLoadSucceeded();

function OpenButtonClicked(obj) {
    var workitemID = document.getElementById("existing-wit-id").value;
   
    document.getElementById("existing-wit-text").innerHTML = workitemID + "</br> " + wi;
};

