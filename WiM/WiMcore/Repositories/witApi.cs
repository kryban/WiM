using Microsoft.TeamFoundation.WorkItemTracking.WebApi;
using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;
using Microsoft.VisualStudio.Services.Client;
using Microsoft.VisualStudio.Services.WebApi;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WiM.Core.Repositories
{
    class WitApi : IWitApi
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
    }
}
