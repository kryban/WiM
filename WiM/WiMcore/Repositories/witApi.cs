using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.VisualStudio.Services.WebApi;
using System;
using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;

namespace WiM.Core.Repositories
{
    public class WitApi : IWitApi
    {
        Uri tfsUri;
        VssClientCredentials defaultCredentials;
        VssConnection vssConnection;
        WorkItemTrackingHttpClient workItemTrackingClient;

        public WitApi()
        {
            tfsUri = new Uri(SettingsGetter.TfsUrl);
            defaultCredentials = new VssClientCredentials(true);
            vssConnection = new VssConnection(tfsUri, defaultCredentials);
            workItemTrackingClient = vssConnection.GetClient<WorkItemTrackingHttpClient>();
        }

        public WorkItem GetWorkItemById(int id)
        {
            return workItemTrackingClient.GetWorkItemAsync(Convert.ToInt32(id)).Result;
        }

        public WorkItem CreateTaskAndLinkToWorkItem(WorkItemWrapper workitemToCreate, int linkedWorkitemId,string linkedWorkItemProjectName)
        {
            JsonPatchDocument patchDocument = new JsonPatchDocument();
            string linkedWorkitemUrl = SettingsGetter.ApiWorkitemUrl + linkedWorkitemId;

            patchDocument.Add(new JsonPatchOperation()
            {
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

            if (!String.IsNullOrEmpty(workitemToCreate.WorkItemTaskActivity))
            {
                patchDocument.Add(new JsonPatchOperation()
                {
                    Operation = Operation.Add,
                    Path = WorkitemPaths.TaskActivity,
                    Value = workitemToCreate.WorkItemTaskActivity
                });
            }

            patchDocument.Add(new JsonPatchOperation()
                {
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

            return workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result;
        }
    }
}
