using Microsoft.TeamFoundation.WorkItemTracking.WebApi.Models;

namespace WiM.Core.Repositories
{
    public interface IWitApi
    {
        WorkItem GetWorkItemById(int id);
    }
}