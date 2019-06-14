using Microsoft.VisualStudio.Services.WebApi.Patch;
using Microsoft.VisualStudio.Services.WebApi.Patch.Json;
using System;
using Microsoft.VisualStudio.Services.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.VisualStudio.Services.Client;
using WiM.Core.Repositories;

namespace WiM.Core
{
    public class TfsController : ITfsController
    {
        private Uri tfsUri;
        private VssClientCredentials defaultCredentials;
        private VssConnection vssConnection;
        private WorkItemTrackingHttpClient workItemTrackingClient;
        private IWorkitemRepository workitemRepo;

        public TfsController(IWorkitemRepository workitemRepository)
        {
            workitemRepo = workitemRepository;
        }

        public WorkItemWrapper CreateTaskAndLinkToWorkItem(WorkItemWrapper workitemToCreate, int linkedWorkitemId, string linkedWorkItemProjectName)
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

            return new WorkItemWrapper(workItemTrackingClient.CreateWorkItemAsync(patchDocument, linkedWorkItemProjectName, "Task").Result);
        }

        public WorkItemWrapper GetById(object id)
        {
            return new WorkItemWrapper(
                workitemRepo.GetWorkitemById(Convert.ToInt32(id))
                );
        }
    }
}
