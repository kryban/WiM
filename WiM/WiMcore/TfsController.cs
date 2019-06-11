using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;
using System;
using Microsoft.VisualStudio.Services.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
//using System.Net.Http.Formatting;
using System.Collections.Generic;
//using Microsoft.TeamFoundation.WorkItemTracking.Client;

namespace WiM.Core
{
    public class TfsController
    {
        Uri tfsUri;
        VssClientCredentials defaultCredentials;
        VssConnection vssConnection;
        WorkItemTrackingHttpClient workItemTrackingClient;
        //List<KeyValuePair<string, string>> AllTasks;
        //List<KeyValuePair<string, string>> AllActivities;

        public TfsController()
        {
            tfsUri = new Uri(SettingsGetter.TfsUrl);
            defaultCredentials = new VssClientCredentials(true);
            vssConnection = new VssConnection(tfsUri, defaultCredentials);
            workItemTrackingClient = vssConnection.GetClient<WorkItemTrackingHttpClient>();
            //AllTasks = SettingsGetter.AllTasks;
            //AllActivities = SettingsGetter.AllActivities;
        }

        public WorkItemWrapper CreateTaskAndLinkToWorkItem(WorkItemWrapper workitemToCreate, int linkedWorkitemId, string linkedWorkItemProjectName)
        {
            //var newTask = new WorkItem();
            //newTask.Fields = new Dictionary<string, object>();
            //newTask.Fields.Add(WorkItemFields.Title, checkBox.Content);

            JsonPatchDocument patchDocument = new JsonPatchDocument();
            string linkedWorkitemUrl = SettingsGetter.ApiWorkitemUrl + linkedWorkitemId;

            patchDocument.Add(new JsonPatchOperation() {
                Operation = Operation.Add,
                Path = WorkitemPaths.Title,
                Value = workitemToCreate.Title
                });

            patchDocument.Add(new JsonPatchOperation()
            {
                Operation = Operation.Add,
                Path = WorkitemPaths.IterationPath,
                Value = workitemToCreate.WorkItemIterationPath
            });

            patchDocument.Add(new JsonPatchOperation()
            {
                Operation = Operation.Add,
                Path = WorkitemPaths.AreaPath,
                Value = workitemToCreate.WorkItemAreaPath
            });

            if(!String.IsNullOrEmpty(workitemToCreate.WorkItemTaskActivity))
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = WorkitemPaths.TaskActivity,
                    Value = workitemToCreate.WorkItemTaskActivity
                });
            }

            patchDocument.Add(new JsonPatchOperation() {
                   Operation = Operation.Add,
                   Path = WorkitemPaths.AllRelations,
                   Value = new
                   {
                       rel = "System.LinkTypes.Hierarchy-Reverse",
                       url = linkedWorkitemUrl,
                       attributes = new
                       {
                           comment = "decompositie van allerlei werk"
                       }
                   }
               }
           );

            return new WorkItemWrapper(workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result);  //patchDocument, project.Name, "Task").Result;

            //var foo = result.Fields[WorkItemFields.Title];

            //return new WorkItemWrapper(result);
        }

        public WorkItemWrapper GetById(object id)
        {
            WorkItem wi;

            try
            {
                wi = workItemTrackingClient.GetWorkItemAsync(Convert.ToInt32(id)).Result;
            }
            catch(Exception e)
            {
                wi = new WorkItem();
                wi.Fields = new Dictionary<string, object>();
                wi.Fields.Add(WorkItemFields.Title, $"Geen WorkItem gevonden met id {id}");// "Geen PBI gevonden met Id "+id+"!");
                wi.Fields.Add(WorkItemFields.WorkItemType, "onbekend type");
            }

            return new WorkItemWrapper(wi);
        }

        //public Workitem GetWorkitemById(int id)
        //{
        //   string query = SettingsGetter.ApiGetWorkitem + id;
        //   string jsonContent = null;

        //    using (var handler = new HttpClientHandler())
        //    {
        //        handler.UseDefaultCredentials = true;

        //        using (var client = new HttpClient(handler))
        //        {
        //            HttpResponseMessage response = client.GetAsync(query).Result;
        //            var responseContent = response.Content;
        //            jsonContent = responseContent.ReadAsStringAsync().Result;
        //        }
        //    }

        //    return JsonToWorkitem(jsonContent);
        //}

        //private Workitem JsonToWorkitem(string jsonString)
        //{
        //    var jsonContent = JObject.Parse(jsonString);
        //    var item = jsonContent["value"].First["fields"].ToObject<Workitem>();
        //    item.Id = (string)jsonContent["value"].First["id"];

        //    return item;
        //}

        //private string WorkitemToJson(Workitem workitem)
        //{
        //    return string.Empty;
        //}

        //private Workitem WorkItemToCustomWorkitem(WorkItem workItem)
        //{
        //    return new Workitem()
        //    {
        //        Title = workItem.Fields["Title"].ToString() //.Fields.Values. workItem.AreaPath,
        //        //BacklogPriority = String.Empty,
        //        //BoardColumn = String.Empty,
        //        //BoardColumnDone = String.Empty,
        //        //ChangedBy = workItem.ChangedBy,
        //        //ChangedDate = workItem.ChangedDate.ToString(),
        //        //Title = workItem.Title
        //    };
        //}
    }
}
